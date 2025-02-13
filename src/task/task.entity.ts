import { TASK_TYPE } from './enum/task-type.enum';
import { TaskProgress } from './task-progress.entity';
import { QuestEntity } from 'src/quest/quest.entity';
import {
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  OneToMany,
  Column,
} from 'typeorm';

@Entity('task')
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => QuestEntity, (quest) => quest.taskList, {
    onDelete: 'CASCADE',
  })
  quest: QuestEntity;

  @OneToMany(() => TaskProgress, (taskProgress) => taskProgress.task)
  userTaskList: TaskProgress[];

  @Column({ type: 'text', nullable: false })
  condition: string;

  @Column({ type: 'text', nullable: true })
  file: string;

  @Column({
    type: 'enum',
    enum: TASK_TYPE,
    nullable: false,
    default: TASK_TYPE.INPUT,
  })
  type: TASK_TYPE;

  @Column({ type: 'text', nullable: true })
  inputAnswer: string;

  @Column({ type: 'bool', nullable: true })
  checkAnswer: boolean;

  @Column({ type: 'json', nullable: true })
  matchingOptions: { question: string; answer: string }[];

  @Column({ type: 'json', nullable: true })
  multipleChoiceOptions: { question: string[]; answer: string[] };
}
