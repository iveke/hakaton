import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CATEGORY_ENUM } from "../enum/quest-category.enum";
import { QUEST_LEVEL_ENUM } from "../enum/quest-level.enum";

export class CreateQuestDto {
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsOptional()
    @IsString()
    description: string;
  
    @IsEnum(CATEGORY_ENUM)
    category: CATEGORY_ENUM;
  
    @IsEnum(QUEST_LEVEL_ENUM)
    level: QUEST_LEVEL_ENUM;
  
    @IsOptional()
    @IsString()
    posterImage: string;
  
    // @IsOptional()
    // @IsNumber()
    // rating: number;
  
    // @IsOptional()
    // @IsNumber()
    // userCount: number;
}
