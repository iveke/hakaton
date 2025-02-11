import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { TASK_TYPE } from './enum/task-type.enum';
import { QuestProgress } from 'src/quest/quest-progress.entity';
import { TaskEntity } from './task.entity';

@Entity('task')
export class TaskProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=>QuestProgress, (userQuest) => userQuest.userTaskList)
  userQuest: QuestProgress;

  @ManyToOne(()=>TaskEntity, (task)=> task.userTaskList)
  task: TaskEntity;

  @Column({ nullable: false, default: false, type: "bool" })
  status: boolean;
}
