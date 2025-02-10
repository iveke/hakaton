import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestEntity } from './quest.entity';
import { TaskProgress } from 'src/task/task-progress.entity';

@Entity('quest_progress')
export class QuestProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.quests, { onDelete: 'CASCADE' })
  user: UserEntity;

  @ManyToOne(() => QuestEntity, (quest) => quest.users, { onDelete: 'CASCADE' })
  quest: QuestEntity;

  @OneToMany(() => TaskProgress, (userTaskList) => userTaskList.userQuest)
  userTaskList: TaskProgress[];
  //   @Column({ type: 'text' })
  //   name: string;

  //   @Column({ type: 'text', nullable: true })
  //   description: string;

  //   @Column({ nullable: false, type: 'text' })
  //   owner: string;

  //   @Column({ type: 'enum', enum: CATEGORY_ENUM, nullable: false })
  //   category: CATEGORY_ENUM;

  @Column({ type: 'int', nullable: false, default: 0 })
  countCompletedTask: number;

  //   @Column({
  //     type: 'enum',
  //     enum: QUEST_LEVEL_ENUM,
  //     nullable: false,
  //     default: QUEST_LEVEL_ENUM.EASY,
  //   })
  //   level: QUEST_LEVEL_ENUM;

  //   @Column({ nullable: true })
  //   posterImage: string;

  //   @Column({ type: 'int', nullable: true })
  //   rating: number;

  //   @Column({ type: 'int', nullable: true })
  //   userCount: number;
}
