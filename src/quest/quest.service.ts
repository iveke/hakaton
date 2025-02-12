import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { Repository } from 'typeorm';
import { QuestEntity } from './quest.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { USER_ROLE } from 'src/user/enum/user-role.enum';
import { UploadService } from 'src/file/upload-file.service';
import { QUEST_LEVEL_ENUM } from './enum/quest-level.enum';
import { CATEGORY_ENUM } from './enum/quest-category.enum';
import { QuestProgress } from './quest-progress.entity';
import { TaskProgress } from 'src/task/task-progress.entity';

@Injectable()
export class QuestService {
  constructor(
    @InjectRepository(QuestEntity)
    private readonly questRepository: Repository<QuestEntity>,
    @InjectRepository(QuestProgress)
    private readonly questProgressRepository: Repository<QuestProgress>,
    @InjectRepository(TaskProgress)
    private readonly taskProgressRepository: Repository<TaskProgress>,
    private readonly uploadService: UploadService,
  ) {}

  async create(
    createQuestDto: CreateQuestDto,
    userId: string,
    file?: Express.Multer.File,
  ): Promise<QuestEntity> {
    let fileUrl = null;
    if (file) {
      fileUrl = await this.uploadService.uploadFile(file);
    }
    const quest = await this.questRepository.create({
      ...createQuestDto,
      ownerId: userId,
      posterImage: fileUrl,
    });

    return this.questRepository.save(quest);
  }

  async update(
    id: number,
    updateQuestDto: UpdateQuestDto,
    user: UserEntity,
    file: Express.Multer.File,
  ): Promise<QuestEntity> {
    const quest = await this.findOne(id);
    const { fileDelete, ...updateData } = updateQuestDto;
    if (!quest) {
      throw new NotFoundException(`Quest with id ${id} not found`);
    }

    const isAdmin = user.role === USER_ROLE.ADMIN;
    const isOwner = quest.ownerId === user.id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Ви не маєте права редагувати цей квест');
    }

    if (fileDelete) {
      await this.uploadService.deleteFileByUrl(quest.posterImage);
      quest.posterImage = null;
    }

    let fileUrl = null;
    if (file) {
      fileUrl = await this.uploadService.uploadFile(file);
    }

    await this.questRepository.update(id, {
      ...updateData,
      posterImage: fileUrl ?? undefined,
    });
    return this.findOne(id);
  }

  async joinToQuest(questId: number, user: UserEntity) {
    const quest = await this.questRepository.findOne({
      where: { id: questId },
      relations: ['users', 'taskList'],
    });

    const existingQuestProgress = await this.questProgressRepository.findOne({
      where: { quest: { id: questId }, user: { id: user.id } },
    });

    if (existingQuestProgress) {
      throw new ConflictException('Ви вже приєдналися до цього квесту');
    }

    const userQuest = await this.questProgressRepository.save(
      await this.questProgressRepository.create({
        quest,
        user,
        countCompletedTask: 0,
      }),
    );

    quest.users.push(userQuest);

    const taskProgressList = quest.taskList.map((task) =>
      this.taskProgressRepository.create({
        userQuest,
        task,
        status: false,
      }),
    );

    await this.taskProgressRepository.save(taskProgressList);

    quest.userCount += 1;
    await this.questRepository.save(quest);
    return userQuest;
  }

  async leaveFromQuest(questId: number, user: UserEntity) {
    const questProgress = await this.questProgressRepository.findOne({
      where: { user: { id: user.id }, quest: { id: questId } },
    });

    if (!questProgress) {
      throw new NotFoundException('Прогрес квесту не знайдено');
    }
    console.log(questProgress);

    await this.questProgressRepository.delete(questProgress.id);
    return 'Все видалено успішно';
  }

  async checkUserJoined(questId: number, user: UserEntity) {
    const userQuest = await this.questProgressRepository.findOne({
      where: { user: { id: user.id }, quest: { id: questId } },
    });
    if (userQuest) {
      return true;
    }
    return false;
  }

  async findAll(
    category?: CATEGORY_ENUM,
    level?: QUEST_LEVEL_ENUM,
  ): Promise<QuestEntity[]> {
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (level) {
      where.level = level;
    }
    return this.questRepository.find({
      relations: ['taskList', 'reviews'],
      where: where,
    });
  }

  async getUserCreatedQuest(
    userId: string,
    category?: CATEGORY_ENUM,
    level?: QUEST_LEVEL_ENUM,
  ): Promise<QuestEntity[]> {
    const where: any = { ownerId: userId };

    if (category) {
      where.category = category;
    }

    if (level) {
      where.level = level;
    }
    return await this.questRepository.find({ where: where });
  }

  async findOne(id: number): Promise<QuestEntity> {
    const quest = await this.questRepository.findOne({ where: { id } });
    if (!quest) {
      throw new NotFoundException(`Quest with id ${id} not found`);
    }
    return quest;
  }

  async remove(id: number, user: UserEntity): Promise<string> {
    const quest = await this.findOne(id);

    if (!quest) {
      throw new NotFoundException(`Quest with id ${id} not found`);
    }

    const isAdmin = user.role === USER_ROLE.ADMIN;
    const isOwner = quest.ownerId === user.id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Ви не маєте права видаляти цей квест');
    }

    await this.questRepository.delete(id);
    if (quest.posterImage) {
      await this.uploadService.deleteFileByUrl(quest.posterImage);
    }
    return 'Все видалено успішно';
  }
}
