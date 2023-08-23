import { MissionAssetType } from '@types';
import { IsNotEmpty, IsOptional, Length, MinLength, IsEnum } from 'class-validator';

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
  @IsOptional()
  map_id: string;
  @IsOptional()
  video_id: string;
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
  map_id: string;
  @IsOptional()
  video_id: string;
}

export class UploadMissionAssetsDto {
  @IsNotEmpty()
  @IsEnum(MissionAssetType)
  type: MissionAssetType;
}

export class GetMissionAssetsDto {
  @IsNotEmpty()
  @IsEnum(MissionAssetType, { each: true })
  types: MissionAssetType[];
}

export class AddAssetDto {
  type: MissionAssetType;
  cloudLink: string;
  cloudId: string;
  name: string;
}