import { type GENDERS } from '@user-ms-prisma';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, Min, MinLength } from 'class-validator';

export enum EGENDERS {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

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
  @IsEnum(EGENDERS)
  gender: GENDERS;
  @Min(18)
  @IsOptional()
  age: number;
  @IsOptional()
  bio;
}


