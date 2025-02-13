import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TASK_TYPE } from '../enum/task-type.enum';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  condition: string;

  @IsOptional()
  picture?: string;

  @IsOptional()
  video?: string;

  @IsEnum(TASK_TYPE)
  type: TASK_TYPE;

  @IsNotEmpty()
  @IsNumber()
  questId: number;

  @IsOptional()
  @IsArray()
  matchingOptions?: { question: string, answer: string }[];

  @IsOptional()
  multipleChoiceOptions?: { question: string[], answer: string[] };

  @IsOptional()
  @IsString()
  inputAnswer?: string;

  @IsOptional()
  @IsBoolean()
  checkAnswer?: boolean;
}
