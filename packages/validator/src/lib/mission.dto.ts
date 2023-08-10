import { IsNotEmpty, IsOptional, Length, MinLength } from 'class-validator';

export class CreateMissionDto {
  @Length(6, 6)
  code: string;
  @IsNotEmpty()
  @MinLength(3)
  title: string;
  @IsNotEmpty()
  duration: number;
  @IsNotEmpty()
  distance: string;
  @IsNotEmpty()
  description: string;
}

export class UpdateMissionDto {
  @IsNotEmpty()
  mission_id: string;
  @Length(6, 6)
  @IsOptional()
  code: string;
  @IsOptional()
  @MinLength(3)
  title: string;
  @IsOptional()
  duration: number;
  @IsOptional()
  distance: string;
  @IsOptional()
  description: string;
  @IsOptional()
  video: string;
  @IsOptional()
  videoUrl: string;
  @IsOptional()
  mapImage: string;
  @IsOptional()
  mapImageUrl: string;
}