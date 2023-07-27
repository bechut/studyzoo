import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

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