import { IsNotEmpty } from "class-validator";

export class CreateIntroDto {
    @IsNotEmpty()
    title: string;
}