import { type GENDERS } from '@user-ms-prisma';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, MinLength, ValidateNested } from 'class-validator';

export class PlayerProfileDto {
  @IsNotEmpty()
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
