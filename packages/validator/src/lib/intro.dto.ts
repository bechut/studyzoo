import { type INTRO_TYPE } from "@user-ms-prisma";
import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class CreateIntroDto {
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    type: INTRO_TYPE;
    @IsNotEmpty()
    @Type(() => Number)
    order: Number;
}

export class GetIntroDto {
    @IsNotEmpty()
    type: INTRO_TYPE;
}