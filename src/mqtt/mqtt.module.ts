import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { SensorDataModule } from '../sensor-data/sensor-data.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SensorDataService } from 'src/sensor-data/sensor-data.service';
import { MqttController } from './mqtt.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MQTT_SERVICE',
        transport: Transport.MQTT,
        options: {
          url: process.env.MQTT_URL || 'mqtt://mosquitto:1883',
          clientId: `nest_client_${Math.random().toString(16).slice(3)}`,
        },
      },
    ]),
    SensorDataModule,
  ],
  providers: [MqttService, SensorDataService],
  controllers: [MqttController],
  exports: [MqttService],
})
export class MqttModule {}