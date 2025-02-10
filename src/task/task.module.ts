import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { TaskProgress } from './task-progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, TaskProgress])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
