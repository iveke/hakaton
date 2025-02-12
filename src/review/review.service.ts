import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from './review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UserEntity } from 'src/user/user.entity';
import { QuestEntity } from 'src/quest/quest.entity';
import { USER_ROLE } from 'src/user/enum/user-role.enum';
@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(QuestEntity)
    private questRepository: Repository<QuestEntity>,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    user: UserEntity,
    questId: number,
  ): Promise<ReviewEntity> {
    const quest = await this.questRepository.findOne({
      where: { id: questId },
      relations: ['reviews'],
    });

    if (!quest) {
      throw new NotFoundException('Такого квесту не існує');
    }

    const existingReview = await this.reviewRepository.findOne({
      where: { user: { id: user.id }, quest: { id: questId } },
    });

    if (existingReview) {
      throw new ConflictException('Ви вже залишали відгук для цього квесту');
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      user,
      quest,
    });

    quest.reviews.push(review);

    const savedReview = await this.reviewRepository.save(review);

    await this.updateQuestRating(quest);

    return savedReview;
  }

  async findAll(questId: number): Promise<ReviewEntity[]> {
    return this.reviewRepository.find({
      where: { quest: { id: questId } },
      relations: ['user', 'quest'],
    });
  }

  async findOne(id: number): Promise<ReviewEntity> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'quest'],
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
    user: UserEntity,
  ): Promise<ReviewEntity> {
    const review = await this.findOne(id);

    if (!review) {
      throw new NotFoundException('Not found review');
    }

    if (review.user.id !== user.id) {
      throw new UnauthorizedException(
        'У вас немає доступу редагувати цей відгук',
      );
    }

    if (review.mark != updateReviewDto.mark) {
      await this.updateQuestRating(review.quest);
    }

    Object.assign(review, updateReviewDto);

    return this.reviewRepository.save(review);
  }

  async remove(id: number, user: UserEntity): Promise<void> {
    const review = await this.findOne(id);

  const isReviewOwner = review.user.id === user.id;

  const isAdmin = user.role === USER_ROLE.ADMIN; 

  const isQuestOwner = review.quest.owner.id === user.id;

  if (!isReviewOwner && !isAdmin && isQuestOwner) {
    throw new UnauthorizedException(
      'Ви не маєте прав на видалення цього відгуку.',
    );
  }

    await this.reviewRepository.remove(review);

    await this.updateQuestRating(review.quest);
  }

  private async updateQuestRating(quest: QuestEntity): Promise<void> {
    const reviews = await this.reviewRepository.find({
      where: { quest: { id: quest.id } },
    });
    if (reviews.length === 0) {
      quest.rating = null;
    } else {
      const totalMark = reviews.reduce((sum, review) => sum + review.mark, 0);
      quest.rating = parseFloat((totalMark / reviews.length).toFixed(1));
    }
    await this.questRepository.save(quest);
  }
}
