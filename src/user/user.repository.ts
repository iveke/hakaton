import { UserEntity } from './user.entity';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
// import * as argon2 from 'argon2';
import { AUTH_ERROR } from '../auth/enum/auth-error.enum';
// import { UserSignUpDto } from 'src/auth/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { format } from 'date-fns';
import { UpdateUserDto } from './dto/update-user.dto';
// import { UploadService } from './upload-file.service';
// import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';

export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    // private readonly uploadService: UploadService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, firstName, lastName, imageURL, clerkId } =
      createUserDto;

    const isUserExist = await this.repository.findOne({
      where: { email: email },
    });

    if (isUserExist) {
      throw new BadRequestException(AUTH_ERROR.USER_ALREADY_EXISTS);
    }

    const user: UserEntity = new UserEntity();

    // user.password = await argon2.hash(password);

    user.email = email.toLowerCase();

    if (firstName) {
      user.firstName = firstName;
    }
    if (clerkId) {
      user.clerkId = clerkId;
    }
    if(lastName){
      user.lastName = lastName;
    }
    if(imageURL){
      user.imageURL = imageURL;
    }
    try {
      return await this.repository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(AUTH_ERROR.USER_ALREADY_EXISTS);
      } else {
        console.log(error);
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async updateUser(
    userID: string,
    updateUserDto: UpdateUserDto,
    // file: Express.Multer.File,
  ) {
    const user = await this.repository.findOne({
      where: [{ id: userID }],
    });

    const { phone, name } = updateUserDto;

console.log(phone, name)

    await this.repository.save(user);

    return { ...user, password: undefined };
  }

  async FindUser(email: string) {
    return await this.repository.findOne({
      where: {
        email: email,
      },
    });
  }
}
