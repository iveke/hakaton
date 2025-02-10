import {
  Body,
  Controller,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth') 
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  // @UseInterceptors(FileInterceptor('file'))
  async signUp(
    // @UploadedFile() file: Express.Multer.File,
    @Body(ValidationPipe) userSignUpDto: CreateUserDto,
  ) {
    return await this.authService.signUp(userSignUpDto);
  }

  @Post('/login')
  async login(@Body(ValidationPipe) userLoginDto: UserLoginDto) {
    return await this.authService.login(userLoginDto);
  }

  // @Get('/token')
  // @UseGuards(AuthGuard(), AccountGuard)
  // async checkToken(@GetAccount() account: UserEntity): Promise<LoginInfoDto> {
  //   return await this.authService.updateLogin(account);
  // }
}
