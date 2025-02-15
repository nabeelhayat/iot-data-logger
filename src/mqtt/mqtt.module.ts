import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { SensorDataModule } from '../sensor-data/sensor-data.module';
import { SensorDataService } from 'src/sensor-data/sensor-data.service';

@Module({
  imports: [SensorDataModule],
  providers: [MqttService, SensorDataService],
  exports: [MqttService],
})
export class MqttModule {}