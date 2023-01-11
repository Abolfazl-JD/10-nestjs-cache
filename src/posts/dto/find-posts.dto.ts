import { Type } from "class-transformer"
import { IsPositive, IsOptional } from "class-validator"

export class FindPostsDto {
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    skip: number

    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    take: number
}