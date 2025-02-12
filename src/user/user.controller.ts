import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from './guard/account.guard';
import { Roles } from './decorator/role.decorator';
import { USER_ROLE } from './enum/user-role.enum';
import { GetAccount } from './decorator/get-account.decorator';
import { UserEntity } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/create")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('/getInfo')
  @UseGuards(AuthGuard("jwt"), AccountGuard)
  findOne(@GetAccount() user: UserEntity) {
    return this.userService.findOne(user);
  }

  @Get('/list')
  @UseGuards(AuthGuard("jwt"), AccountGuard)
  @Roles(USER_ROLE.ADMIN)
  getAllUserList(){
    return this.userService.getAllUserList();
    
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
