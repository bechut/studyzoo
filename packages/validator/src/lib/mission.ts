import { IsEmail, IsNotEmpty, IsOptional, Length, Min, MinLength } from 'class-validator';

export class CreateMissionDto {
  @Length(6, 6)
  code: string;
  @IsNotEmpty()
  @MinLength(3)
  title: string;
  @IsNotEmpty()
  videoUrl: string;
  @IsNotEmpty()
  mapImage: string;
  @IsNotEmpty()
  mapImageUrl: string;
  @IsNotEmpty()
  duration: string;
  @IsNotEmpty()
  distance: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  description: Date;
  @IsNotEmpty()
  description: string;
}

