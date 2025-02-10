import { Module } from '@nestjs/common';
import { QuestService } from './quest.service';
import { QuestController } from './quest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestEntity } from './quest.entity';
import { QuestProgress } from './quest-progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestEntity, QuestProgress])],
  controllers: [QuestController],
  providers: [QuestService],
})
export class QuestModule {}
