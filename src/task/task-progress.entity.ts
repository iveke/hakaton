import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { TASK_TYPE } from './enum/task-type.enum';
import { QuestProgress } from 'src/quest/quest-progress.entity';
import { TaskEntity } from './task.entity';

@Entity('task_progress')
export class TaskProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => QuestProgress, (userQuest) => userQuest.userTaskList, {
    onDelete: 'CASCADE',
  })
  userQuest: QuestProgress;

  @ManyToOne(() => TaskEntity, (task) => task.userTaskList, {
    onDelete: 'CASCADE',
  })
  task: TaskEntity;

  @Column({ nullable: false, default: false, type: 'bool' })
  status: boolean;
}
