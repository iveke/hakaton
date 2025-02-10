import { QuestEntity } from "src/quest/quest.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity("review")
@Unique(['user', 'quest'])
export class ReviewEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, type: "text"})
    text: string;

    @Column({nullable: false, type: "int"})
    mark: number;

    @ManyToOne(() => UserEntity, (user) => user.reviews, { onDelete: 'CASCADE' })
    user: UserEntity;
  
    @ManyToOne(() => QuestEntity, (quest) => quest.reviews, { onDelete: 'CASCADE' })
    quest: QuestEntity;
}
