import { IsNotEmpty, IsString, IsNumber, Max, Min } from 'class-validator';

export class CreateReviewDto {
    @IsNotEmpty()
    @IsString()
    text: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    mark: number;

}