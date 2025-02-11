import { IsEnum, IsNumber, IsString } from 'class-validator';
import { TASK_TYPE } from '../enum/task-type.enum';

export class CreateTaskDto {
  @IsString()
  condition: string;

  @IsEnum(TASK_TYPE)
  type: TASK_TYPE;

  @IsNumber()
  questId: number;
}
