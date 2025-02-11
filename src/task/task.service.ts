import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UploadService } from 'src/file/upload-file.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { QuestEntity } from 'src/quest/quest.entity';

@Injectable()
export class TaskService {
  constructor(
    private readonly uploadService: UploadService,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(QuestEntity)
    private readonly questRepository: Repository<QuestEntity>,
  ) {}
  async create(createTaskDto: CreateTaskDto, files: Express.Multer.File[]) {
    let pictureUrl: string | null = null;
    let videoUrl: string | null = null;

    const quest = await this.questRepository.findOne({
      where: { id: createTaskDto.questId },
    });
  
    if (!quest) {
      throw new NotFoundException('Квест не знайдено');
    }

    if (files && files.length > 0) {
      for (const file of files) {
        const { url } = await this.uploadService.uploadFile(file);
        if (file.mimetype.startsWith('image/')) {
          pictureUrl = url;
        } else if (file.mimetype.startsWith('video/')) {
          videoUrl = url;
        }
      }
    }

    const newTask = this.taskRepository.create({
      ...createTaskDto,
      picture: pictureUrl,
      video: videoUrl,
    });

    return this.taskRepository.save(newTask);
  }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
