import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SensorDataService } from '../sensor-data/sensor-data.service';
import { CreateSensorDataDto } from '../sensor-data/dto/create-sensor-data.dto';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private client: ReturnType<typeof mqtt.connect>;
  private readonly brokerUrl = process.env.MQTT_URL || 'mqtt://mosquitto:1883';
  private readonly topic = 'sensors/data';
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectInterval = 5000; // 5 seconds

  constructor(private sensorDataService: SensorDataService) {}

  async onModuleInit() {
    await this.connectWithRetry();
  }

  private async connectWithRetry() {
    try {
      this.client = mqtt.connect(this.brokerUrl, {
        clientId: `nest_server_${Math.random().toString(16).slice(3)}`,
        reconnectPeriod: 5000,
        connectTimeout: 30000,
      });

      this.client.on('connect', () => {
        console.log('Connected to MQTT broker');
        this.reconnectAttempts = 0;
        this.subscribe();
      });

      this.client.on('error', (error) => {
        console.error('MQTT Error:', error);
        this.handleConnectionError();
      });

      this.client.on('offline', () => {
        console.log('MQTT client went offline');
        this.handleConnectionError();
      });

      this.client.on('message', this.handleMessage.bind(this));

    } catch (error) {
      console.error('MQTT Connection error:', error);
      this.handleConnectionError();
    }
  }

  private handleConnectionError() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connectWithRetry(), this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.end(true);
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
      
      const result = await this.sensorDataService.create(sensorData);
      console.log('Sensor data saved:', result);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  async publish(data: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.client.connected) {
        reject(new Error('MQTT client not connected'));
        return;
      }

      this.client.publish(this.topic, JSON.stringify(data), { qos: 1 }, (error) => {
        if (error) {
          console.error('Publication error:', error);
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  }
}