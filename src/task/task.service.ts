import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UploadService } from 'src/file/upload-file.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { QuestEntity } from 'src/quest/quest.entity';
import { TaskProgress } from './task-progress.entity';
import { QuestProgress } from 'src/quest/quest-progress.entity';
import { UserEntity } from 'src/user/user.entity';
import { UpdateUserTaskDto } from './dto/update-userTask.dto';
import { TASK_TYPE } from './enum/task-type.enum';
import { USER_ROLE } from 'src/user/enum/user-role.enum';

@Injectable()
export class TaskService {
  constructor(
    private readonly uploadService: UploadService,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(TaskProgress)
    private readonly taskProgressRepository: Repository<TaskProgress>,
    @InjectRepository(QuestEntity)
    private readonly questRepository: Repository<QuestEntity>,
    @InjectRepository(QuestProgress)
    private readonly questProgressRepository: Repository<QuestProgress>,
  ) {}
  async create(
    createTaskDto: CreateTaskDto,
    file: Express.Multer.File,
    user: UserEntity,
  ) {
    // let pictureUrl: string | null = null;
    let fileUrl: string | null = null;

    const quest = await this.questRepository.findOne({
      where: { id: createTaskDto.questId },
      relations: ['taskList', 'owner'],
    });

    if (!quest) {
      throw new NotFoundException('Квест не знайдено');
    }

    if (quest.ownerId !== user.id) {
      throw new ForbiddenException(
        'У вас немає доступу створювати завдання до цього квесту',
      );
    }

    if (file) {
      fileUrl = await this.uploadService.uploadFile(file);
      // for (const file of files) {
      //   const url = await this.uploadService.uploadFile(file);
      //   if (file.mimetype.startsWith('image/')) {
      //     pictureUrl = url;
      //   } else if (file.mimetype.startsWith('video/')) {
      //     videoUrl = url;
      //   }
      // }
    }

    quest.countTask += 1;

    const {
      condition,
      type,
      matchingOptions,
      multipleChoiceOptions,
      inputAnswer,
      checkAnswer,
    } = createTaskDto;

    const task: TaskEntity = new TaskEntity();

    if (condition) {
      task.condition = condition;
    }

    if (type) {
      task.type = type;
    }

    if (fileUrl) {
      task.file = fileUrl;
    }

    if (type === TASK_TYPE.OPTION) {
      task.multipleChoiceOptions = multipleChoiceOptions;
    }
    if (type === TASK_TYPE.INPUT) {
      task.inputAnswer = inputAnswer;
    }
    if (type === TASK_TYPE.CHECK) {
      task.checkAnswer = checkAnswer;
    }
    if (type === TASK_TYPE.CONFORMITY) {
      task.matchingOptions = matchingOptions;
    }

    task.quest = quest;
    // quest.taskList.push(task);

    await this.questRepository.save(quest);
    return this.taskRepository.save(task);
  }

  async createTaskProgress(questId: number, user: UserEntity) {
    const userQuest = await this.questProgressRepository.findOne({
      where: {
        quest: {
          id: questId,
        },
        user: {
          id: user.id,
        },
      },
      relations: ['userTaskList', 'quest', 'quest.taskList'],
    });

    if (!userQuest) {
      throw new Error('User quest progress not found');
    }

    const quest = await this.questRepository.findOne({
      where: { id: questId },
      relations: ['taskList'],
    });

    if (!quest) {
      throw new Error('Quest not found');
    }

    const taskProgressList = quest.taskList.map((task) =>
      this.taskProgressRepository.create({
        userQuest,
        task,
        status: false,
      }),
    );

    await this.taskProgressRepository.save(taskProgressList);

    return taskProgressList;
  }

  async getList(questId: number) {
    return await this.taskRepository.find({
      where: { quest: { id: questId } },
      relations: ['quest'],
    });
  }

  async getOne(id: number) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['quest'],
    });

    if (!task) {
      throw new NotFoundException('Завдання не знайдено');
    }

    if (task.type === TASK_TYPE.CONFORMITY && task.matchingOptions) {
      const questions = task.matchingOptions.map((option) => option.question);
      const answers = this.shuffleArray(
        task.matchingOptions.map((option) => option.answer),
      );

      return {
        ...task,
        conformityData: {
          questions,
          answers,
        },
      };
    }
    return task;
  }

  // async checkAnswer(id:number, answer: string){
  //   const task = await this.taskRepository.findOne({where: {id}});

  // }

  async update(id: number, updateTaskDto: UpdateTaskDto, user: UserEntity) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['quest', 'quest.owner'],
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    const questCreatorId = task.quest.owner.id;
    console.log(questCreatorId);
    const isAdmin = user.role === USER_ROLE.ADMIN;
    const isQuestCreator = questCreatorId === user.id;

    if (!isAdmin && !isQuestCreator) {
      throw new ForbiddenException('Вам не дозволено змінювати це завдання');
    }

    const { matchingOptions, multipleChoiceOptions, ...rest } = updateTaskDto; // Розділяємо JSON поля
    console.log({ ...rest });
    const updateData: Partial<TaskEntity> = { ...rest }; // Створюємо частковий об'єкт

    if (matchingOptions) {
      updateData.matchingOptions = matchingOptions;
    }

    if (multipleChoiceOptions) {
      updateData.multipleChoiceOptions = multipleChoiceOptions;
    }

    await this.taskRepository.update(id, updateData);

    return await this.taskRepository.findOne({ where: { id } });
  }

  async updateUserTask(
    id: number,
    updateTaskDto: UpdateUserTaskDto,
    user: UserEntity,
  ) {
    const userTask = await this.taskProgressRepository.findOne({
      where: { id },
      relations: ['userQuest', 'userQuest.user'],
    });

    if (!userTask) {
      throw new NotFoundException(`Task progress with id ${id} not found`);
    }

    const userQuest = userTask.userQuest;

    const isOwner = userQuest.user.id === user.id;
    const isAdmin = user.role === USER_ROLE.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'Вам не дозволено змінювати статус цього завдання',
      );
    }

    if (updateTaskDto.status) {
      userQuest.countCompletedTask += 1;
      userTask.status = true;
    }

    if (!updateTaskDto.status) {
      userQuest.countCompletedTask -= 1;
      userTask.status = false;
    }

    await this.questProgressRepository.save(userQuest);
    return await this.taskProgressRepository.save(userTask);
  }

  async remove(id: number, user: UserEntity) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['quest', 'quest.owner'],
    });

    if (task.quest.owner.id === user.id || user.role === USER_ROLE.ADMIN) {
      await this.taskRepository.delete(id);
      return `завдання ${id} Видалено успішно`;
    }

    throw new ForbiddenException('Вам не дозволено видаляти завдання');
  }

  shuffleArray<T>(array: T[]): T[] {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
}
