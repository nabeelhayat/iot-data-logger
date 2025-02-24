import { Module } from '@nestjs/common';
import { SensorDataModule } from './sensor-data/sensor-data.module';
import { PrismaModule } from './prisma/prisma.module';
import { MqttModule } from './mqtt/mqtt.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [MqttModule, SensorDataModule, PrismaModule],
})
export class AppModule {}