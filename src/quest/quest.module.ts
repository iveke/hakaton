import { Module } from '@nestjs/common';
import { QuestService } from './quest.service';
import { QuestController } from './quest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestEntity } from './quest.entity';
import { QuestProgress } from './quest-progress.entity';
import { UserEntity } from 'src/user/user.entity';
import { UploadModule } from 'src/file/upload-file.module';
import { TaskProgress } from 'src/task/task-progress.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestEntity,
      QuestProgress,
      UserEntity,
      TaskProgress,
    ]),
    UploadModule,
  ],
  controllers: [QuestController],
  providers: [QuestService],
})
export class QuestModule {}
