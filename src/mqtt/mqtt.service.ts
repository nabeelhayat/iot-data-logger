import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SensorDataService } from '../sensor-data/sensor-data.service';
import { CreateSensorDataDto } from '../sensor-data/dto/create-sensor-data.dto';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private client: ReturnType<typeof mqtt.connect>;;
  private readonly brokerUrl = 'mqtt://mosquitto:1883';
  private readonly topic = 'sensors/data'; 

  constructor(private sensorDataService: SensorDataService) {}

  onModuleInit() {
    this.client = mqtt.connect(this.brokerUrl, {
      clientId: `nest_server_${Math.random().toString(16).slice(3)}`,
    });

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.subscribe();
    });

    this.client.on('error', (error) => {
      console.error('MQTT Error:', error);
    });

    this.client.on('message', this.handleMessage.bind(this));
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.end();
    }
  }

  private subscribe() {
    this.client.subscribe(this.topic, (error) => {
      if (error) {
        console.error('MQTT Subscription error:', error);
        return;
      }
      console.log(`Subscribed to ${this.topic}`);
    });
  }

  private async handleMessage(topic: string, payload: Buffer) {
    try {
      const message = JSON.parse(payload.toString());
      const sensorData: CreateSensorDataDto = {
        deviceId: message.sensorId,
        temperature: message.temperature,
        humidity: message.humidity,
      };

      await this.sensorDataService.create(sensorData);
      console.log('Sensor data saved:', sensorData);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  // Method to publish data (if needed)
  async publish(data: any) {
    return new Promise((resolve, reject) => {
      this.client.publish(this.topic, JSON.stringify(data), (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  }
}