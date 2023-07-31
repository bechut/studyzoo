import { type GENDERS } from '@user-ms-prisma';
import { IsEmail, IsNotEmpty, IsOptional, Min, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  @IsNotEmpty()
  @MinLength(3)
  first_name: string;
  @IsNotEmpty()
  @MinLength(3)
  last_name: string;
}

export class UpdateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  first_name: string;
  @IsNotEmpty()
  @MinLength(3)
  last_name: string;
  @IsOptional()
  gender: GENDERS;
  @Min(18)
  @IsOptional()
  age: number;
  @IsOptional()
  bio;
}


