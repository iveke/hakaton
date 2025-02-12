import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateUserTaskDto {
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
