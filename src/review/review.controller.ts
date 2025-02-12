import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UserEntity } from 'src/user/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from 'src/user/guard/account.guard';
import { GetAccount } from 'src/user/decorator/get-account.decorator';
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post("/create/:questId")
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  create(
    @Param("questId") questId: number,
    @Body() createReviewDto: CreateReviewDto,
    @GetAccount() user: UserEntity,
  ) {
    return this.reviewService.create(createReviewDto, user, questId);
  }

  @Get("/list/:questId")
  findAll(
    @Param("questId") questId: number,
  ) {
    return this.reviewService.findAll(questId);
  }

  @Get('/getInfo/:id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Patch('/update/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @GetAccount() user: UserEntity,
  ) {
    return this.reviewService.update(+id, updateReviewDto, user);
  }

  @Delete('/remove/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  remove(@Param('id') id: string, @GetAccount() user: UserEntity) {
    return this.reviewService.remove(+id, user);
  }

  // @Get('/:questId')
  // findByQuest(@Param('questId') questId: string) {
  //   return this.reviewService.findByQuest(+questId);
  // }
}
