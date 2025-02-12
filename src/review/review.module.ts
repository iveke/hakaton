import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './review.entity';
import { UserEntity } from 'src/user/user.entity';
import { QuestEntity } from 'src/quest/quest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity, UserEntity, QuestEntity])],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
