import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { TASK_TYPE } from '../enum/task-type.enum';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  condition: string;

  @IsOptional()
  picture?: string;

  @IsOptional()
  video?: string;

  @IsOptional()
  @IsEnum(TASK_TYPE)
  type: TASK_TYPE;

  @IsOptional()
  @IsString()
  inputAnswer: string;

  @IsOptional()
  @IsBoolean()
  checkAnswer: boolean;

  @IsOptional()
  @IsArray()
  matchingOptions?: { question: string; answer: string }[];

  @IsOptional()
  @IsArray()
  multipleChoiceOptions?: { question: string[]; answer: string[] };
}
