import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class VerifyDto {
  @IsNotEmpty()
  @MinLength(6)
  otp: string;
}
export class ResetPasswordDto {
  @IsEmail()
  email: string;
}
export class ChangePasswordDto {
  @IsNotEmpty()
  @MinLength(6)
  otp: string;
  @IsNotEmpty()
  new_password: string;
}