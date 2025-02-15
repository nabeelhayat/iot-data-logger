import { IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSensorDataDto {
  @ApiProperty()
  @IsString()
  deviceId: string;

  @ApiProperty()
  @IsNumber()
  @Min(-50)
  @Max(100)
  temperature: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  humidity: number;
}