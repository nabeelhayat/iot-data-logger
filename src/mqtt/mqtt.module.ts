import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { SensorDataModule } from '../sensor-data/sensor-data.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SensorDataService } from 'src/sensor-data/sensor-data.service';
import { MqttController } from './mqtt.controller';

@Module({
  imports: [
    SensorDataModule,
  ],
  providers: [MqttService, SensorDataService],
  controllers: [MqttController],
  exports: [MqttService],
})
export class MqttModule {}