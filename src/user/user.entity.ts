import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { USER_ROLE } from './enum/user-role.enum';
import * as argon2 from 'argon2';
import { QuestProgress } from 'src/quest/quest-progress.entity';
import { ReviewEntity } from 'src/review/review.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => QuestProgress, (userQuest) => userQuest.user)
  quests: QuestProgress[];

  @OneToMany(() => ReviewEntity, (review) => review.user, { cascade: true })
  reviews: ReviewEntity[];

  @Column({ nullable: false, unique: true })
  clerkId: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  firstName: string;

  @Column({ type: 'text', nullable: true })
  lastName: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({
    type: 'enum',
    enum: USER_ROLE,
    default: USER_ROLE.USER,
    nullable: false,
  })
  role: USER_ROLE;

  @Column({ type: 'int', nullable: true })
  countQuest: number;

  @Column({ nullable: true })
  imageURL: string;

  @Column({ nullable: true, type: 'text' })
  phone: string;

  // Хешування пароля
  static async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  // Валідація пароля
  // async validatePassword(password: string): Promise<boolean> {
  //   return await argon2.verify(this.password, password);
  // }

  // // Оновлення пароля
  // async updatePassword(password: string): Promise<void> {
  //   this.password = await UserEntity.hashPassword(password);
  // }
}
