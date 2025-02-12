import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { QuestEntity } from './quest.entity';
import { TaskProgress } from 'src/task/task-progress.entity';

@Entity('quest_progress')
@Unique(['user', 'quest'])
export class QuestProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.quests, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(() => QuestEntity, (quest) => quest.users, { onDelete: 'CASCADE' })
  quest: QuestEntity;

  @OneToMany(() => TaskProgress, (userTaskList) => userTaskList.userQuest)
  userTaskList: TaskProgress[];

  @Column({ type: 'int', nullable: false, default: 0 })
  countCompletedTask: number;
}
