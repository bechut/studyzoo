import { IsNotEmpty } from "class-validator";

export class TestDto {
    @IsNotEmpty()
    test: string;
}