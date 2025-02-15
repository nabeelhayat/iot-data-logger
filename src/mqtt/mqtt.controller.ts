import { Controller, Post, Body } from '@nestjs/common';
import { MqttService } from './mqtt.service';

@Controller('mqtt')
export class MqttController {
  constructor(private readonly mqttService: MqttService) {}

  @Post('publish')
  async publishMessage(@Body() data: any) {
    try {
      await this.mqttService.publish(data);
      return { success: true, message: 'Data published successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}