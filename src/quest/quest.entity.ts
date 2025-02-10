import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CATEGORY_ENUM } from './enum/quest-category.enum';
import { QUEST_LEVEL_ENUM } from './enum/quest-level.enum';
import { QuestProgress } from './quest-progress.entity';
import { ReviewEntity } from 'src/review/review.entity';
import { TaskEntity } from 'src/task/task.entity';

@Entity('quest')
export class QuestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => QuestProgress, (userQuest) => userQuest.quest)
  users: QuestProgress[];

  @OneToMany(() => ReviewEntity, (review) => review.quest, { cascade: true })
  reviews: ReviewEntity[];

  @OneToMany(() => TaskEntity, (task) => task.quest)
  taskList: TaskEntity[];

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: false, type: 'text' })
  owner: string;

  @Column({ type: 'enum', enum: CATEGORY_ENUM, nullable: false })
  category: CATEGORY_ENUM;

  @Column({ type: 'int', nullable: false, default: 0 })
  countTask: number;

  @Column({
    type: 'enum',
    enum: QUEST_LEVEL_ENUM,
    nullable: false,
    default: QUEST_LEVEL_ENUM.EASY,
  })
  level: QUEST_LEVEL_ENUM;

  @Column({ nullable: true })
  posterImage: string;

  @Column({ type: 'int', nullable: true })
  rating: number;

  @Column({ type: 'int', nullable: true })
  userCount: number;

  
}
