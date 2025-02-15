import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSensorDataDto } from './dto/create-sensor-data.dto';

@Injectable()
export class SensorDataService {
  constructor(private prisma: PrismaService) {}

  create(createSensorDataDto: CreateSensorDataDto) {
    return this.prisma.sensorData.create({
      data: createSensorDataDto,
    });
  }

  findLatest() {
    return this.prisma.sensorData.findMany({
      take: 10,
      orderBy: {
        timestamp: 'desc',
      },
    });
  }
}