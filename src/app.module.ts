import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewModule } from './review/review.module';
import { QuestModule } from './quest/quest.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
        synchronize: true,
      }),
    }),
    ReviewModule,
    QuestModule,
    TaskModule,
    AuthModule,
    UserModule,
  ],
  providers: [],
})
export class AppModule {}
