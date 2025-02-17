import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { TaskProgress } from './task-progress.entity';
import { QuestEntity } from 'src/quest/quest.entity';
import { UploadModule } from 'src/file/upload-file.module';
import { QuestProgress } from 'src/quest/quest-progress.entity';
import { UserEntity } from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskEntity,
      TaskProgress,
      QuestEntity,
      QuestProgress,
      UserEntity,
    ]),
    UploadModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
