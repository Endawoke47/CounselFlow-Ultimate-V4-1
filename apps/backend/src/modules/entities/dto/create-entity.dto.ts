import { IsString, IsOptional, IsDateString, IsObject, IsArray } from 'class-validator';

export class CreateEntityDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  jurisdiction: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;

  @IsOptional()
  @IsDateString()
  incorporationDate?: string;

  @IsOptional()
  @IsDateString()
  dissolutionDate?: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  taxId?: string;

  @IsOptional()
  @IsArray()
  officers?: Record<string, any>[];

  @IsOptional()
  @IsArray()
  filings?: Record<string, any>[];

  @IsOptional()
  @IsObject()
  compliance?: Record<string, any>;
}
