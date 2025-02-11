import { TASK_TYPE } from './enum/task-type.enum';
import { TaskProgress } from './task-progress.entity';
import { QuestEntity } from 'src/quest/quest.entity';
import { PrimaryGeneratedColumn, Entity, ManyToOne, OneToMany, Column } from 'typeorm';

@Entity('task')
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=>QuestEntity, (quest)=> quest.taskList)
  quest: QuestEntity;

  @OneToMany(() => TaskProgress, (taskProgress) => taskProgress.task)
  userTaskList: TaskProgress[];

  @Column({ type: 'text', nullable: false })
  condition: string;

  @Column({ type: 'text', nullable: true })
  picture: string;

  @Column({ type: 'text', nullable: true })
  video: string;

  @Column({
    type: 'enum',
    enum: TASK_TYPE,
    nullable: false,
    default: TASK_TYPE.INPUT,
  })
  type: TASK_TYPE;
}
