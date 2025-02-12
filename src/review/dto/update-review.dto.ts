import { IsString, IsNumber, Max, Min, IsOptional } from 'class-validator';

export class UpdateReviewDto {
    @IsOptional()
    @IsString()
    text?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    mark?: number;
}