import { UserEntity } from 'src/user/user.entity';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRepository } from 'src/user/user.repository';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Injectable } from '@nestjs/common';
// import { UploadService } from 'src/user/upload-file.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    // private readonly uploadService: UploadService,
  ) {}

  async signUp(userSignUpDto: CreateUserDto) {
    const user: UserEntity = await this.userRepository.createUser({
      ...userSignUpDto,
    });

    // let fileUrl = null;

    // if (file) {
    //   const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    //   if (!allowedMimeTypes.includes(file.mimetype)) {
    //     throw new BadRequestException('Недопустимий формат файлу');
    //   }

    //   fileUrl = await this.uploadService.uploadFile(file, user.id);
    // }

    const accessToken = await this.createJwt(user, userSignUpDto.token);

    return {
      accessToken,
      user,
    };
  }

  async login(userLoginDto: UserLoginDto) {
    const { email } = userLoginDto;

    let user;
    if (email) {
      user = await this.userRepository.FindUser(email);
    }
    // if (!user) {
    //   throw new BadRequestException(AUTH_ERROR.COULDNT_FOUND_USER);
    // } else {
    //   const passwordCorrect = await user.validatePassword(password);

    //   if (passwordCorrect === false) {
    //     throw new BadRequestException(AUTH_ERROR.UNCORRECT_PASSWORD_OR_LOGIN);
    //   }
    // }

    const accessToken = await this.createJwt(user, userLoginDto.token);

    // const loginInfo: LoginInfoDto = { accessToken };
    return { accessToken, user };
  }

  // async updateLogin(user: UserEntity): Promise<LoginInfoDto> {
  //   const accessToken = await this.createJwt(user);

  //   return { accessToken };
  // }

  async createJwt(user: UserEntity, token: string): Promise<string> {
    const { id, email, role, clerkId } = user;

    const payload: JwtPayload = {
      id,
      email,
      role,
      token,
      clerkId,
    };

    return this.jwtService.sign(payload);
  }
}
