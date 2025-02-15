import { Controller, Get, Post, Body } from '@nestjs/common';
import { SensorDataService } from './sensor-data.service';
import { CreateSensorDataDto } from './dto/create-sensor-data.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('sensor-data')
@Controller('sensor-data')
export class SensorDataController {
  constructor(private readonly sensorDataService: SensorDataService) {}

  @Post()
  @ApiOperation({ summary: 'Create new sensor reading' })
  create(@Body() createSensorDataDto: CreateSensorDataDto) {
    return this.sensorDataService.create(createSensorDataDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get latest sensor readings' })
  findLatest() {
    return this.sensorDataService.findLatest();
  }
}