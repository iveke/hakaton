import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { TaskProgress } from './task-progress.entity';
import { QuestEntity } from 'src/quest/quest.entity';
import { UploadModule } from 'src/file/upload-file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity, TaskProgress, QuestEntity]),
    UploadModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
