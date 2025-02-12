import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CATEGORY_ENUM } from '../enum/quest-category.enum';
import { QUEST_LEVEL_ENUM } from '../enum/quest-level.enum';

export class UpdateQuestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(CATEGORY_ENUM)
  category: CATEGORY_ENUM;

  @IsOptional()
  @IsEnum(QUEST_LEVEL_ENUM)
  level: QUEST_LEVEL_ENUM;

  @IsOptional()
  @IsBoolean()
  fileDelete: boolean;
}
