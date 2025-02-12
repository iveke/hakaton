import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from 'src/user/guard/account.guard';
import { GetAccount } from './../user/decorator/get-account.decorator';
import { UserEntity } from 'src/user/user.entity';
import { UpdateUserTaskDto } from './dto/update-userTask.dto';
import { Roles } from 'src/user/decorator/role.decorator';
import { USER_ROLE } from 'src/user/enum/user-role.enum';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('/create')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  @UseInterceptors(FileInterceptor('files'))
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @UploadedFile() file: Express.Multer.File,
    @GetAccount() user: UserEntity,
  ) {
    return this.taskService.create(createTaskDto, file, user);
  }

  @Get('/list/:questId')
  async findByQuest(@Param('questId') questId: number) {
    return this.taskService.getList(questId);
  }

  @Get('/user-list/:questId')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async getUserTaskListByQuest(
    @Param('questId') questId: number,
    @GetAccount() user: UserEntity,
  ) {
    return this.taskService.getUserTaskList(questId, user);
  }

  @Get('/getInfo/:id')
  async findOne(@Param('id') id: number) {
    return this.taskService.getOne(id);
  }

  @Get('/getUserTaskInfo/:questId')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async getUserTask(
    @Param('questId') questId: number,
    @Query('taskId') taskId: number,
    @GetAccount() user: UserEntity,
  ) {
    return this.taskService.getUserTask(questId, user, taskId);
  }
  // @Get('/check/:id')
  // async checkAnswer(@Param('id') id: number) {
  //   return this.taskService.checkAnswer(id);
  // }

  @Patch('/update/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async update(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetAccount() user: UserEntity,
  ) {
    return this.taskService.update(id, updateTaskDto, user);
  }

  @Patch('/update/user-task/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async updateUserTask(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateUserTaskDto,
    @GetAccount() user: UserEntity,
  ) {
    return this.taskService.updateUserTask(id, updateTaskDto, user);
  }

  @Delete('/remove/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  @Roles(USER_ROLE.ADMIN, USER_ROLE.USER)
  async remove(@Param('id') id: number, @GetAccount() user: UserEntity) {
    return this.taskService.remove(id, user);
  }
}
