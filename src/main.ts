import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('IoT Data Logger API')
    .setDescription('API for IoT sensor data')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Configure MQTT Microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: process.env.MQTT_URL || 'mqtt://mosquitto:1883',
      clientId: 'nestjs_mqtt_client',
    },
  });

  // Start all microservices and then the main application
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 4001, '0.0.0.0');
  
  console.log('HTTP Server is running on http://localhost:4000/api');
  console.log('MQTT Microservice is running');
}
bootstrap();