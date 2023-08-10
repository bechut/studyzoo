import { type GENDERS } from '@user-ms-prisma';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, Min, MinLength, ValidateNested } from 'class-validator';
import { EGENDERS } from './user.dto';

export class PlayerProfileDto {
  @IsNotEmpty()
  @IsEnum(EGENDERS)
  gender: GENDERS;
  @IsNotEmpty()
  @MinLength(3)
  first_name: string;
  @IsNotEmpty()
  @MinLength(3)
  last_name: string;
  @IsNotEmpty()
  age: number;
  @IsOptional()
  bio: string;
  player_id: string;
  user_id: string;
}

export class CreatePlayerDto {
  user_id: string;
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PlayerProfileDto)
  players: PlayerProfileDto[]
}

export class RegisterBinocularDto {
  @IsNotEmpty()
  player_id: string;
  @IsNotEmpty()
  machine_code: string;
}

export class EditPlayerProfileDto {
  @IsEnum(EGENDERS)
  @IsNotEmpty()
  gender: GENDERS;
  @IsNotEmpty()
  @MinLength(3)
  first_name: string;
  @IsNotEmpty()
  @MinLength(3)
  last_name: string;
  @IsNotEmpty()
  @Min(10)
  age: number;
  @IsOptional()
  bio: string;
}