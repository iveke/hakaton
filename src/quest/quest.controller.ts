import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { QuestService } from './quest.service';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from 'src/user/guard/account.guard';
import { GetAccount } from 'src/user/decorator/get-account.decorator';
import { UserEntity } from 'src/user/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CATEGORY_ENUM } from './enum/quest-category.enum';
import { QUEST_LEVEL_ENUM } from './enum/quest-level.enum';

@Controller('quest')
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  @Post('/create')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createQuestDto: CreateQuestDto,
    @UploadedFile() file: Express.Multer.File,
    @GetAccount() user: UserEntity,
  ) {
    return this.questService.create(createQuestDto, user.id, file);
  }

  @Get('/list')
  findAll(
    @Query('category') category?: CATEGORY_ENUM,
    @Query('level') level?: QUEST_LEVEL_ENUM,
  ) {
    return this.questService.findAll(category, level);
  }

  @Get('/created-list')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  findUserQuest(
    @GetAccount() user: UserEntity,
    @Query('category') category?: CATEGORY_ENUM,
    @Query('level') level?: QUEST_LEVEL_ENUM,
  ) {
    return this.questService.getUserCreatedQuest(user.id, category, level);
  }

  @Post('/join/:questId')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async createTaskProgress(
    @GetAccount() user: UserEntity,
    @Param('questId') questId: number,
  ) {
    return this.questService.joinToQuest(questId, user);
  }

  @Get('/getInfo/:id')
  findOne(@Param('id') id: string) {
    return this.questService.findOne(+id);
  }

  @Patch('/update/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateQuestDto: UpdateQuestDto,
    @UploadedFile() file: Express.Multer.File,
    @GetAccount() user: UserEntity,
  ) {
    return this.questService.update(+id, updateQuestDto, user, file);
  }

  @Delete('/leave/:questId')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async leaveFromQuest(
    @GetAccount() user: UserEntity,
    @Param('questId') questId: number,
  ) {
    return this.questService.leaveFromQuest(questId, user);
  }

  @Delete('/remove/:id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @GetAccount() user: UserEntity) {
    return this.questService.remove(+id, user);
  }
}
