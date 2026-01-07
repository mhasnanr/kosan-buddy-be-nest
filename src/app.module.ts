import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { ElectricityHistoryModule } from './electricity_history/electricity_history.module';
import { ElectricityHistoryController } from './electricity_history/electricity_history.controller';
import { ElectricityHistoryService } from './electricity_history/electricity_history.service';
import * as fs from 'fs';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const caPath = path.join(process.cwd(), 'certificate', 'ca.pem');
        const environment = configService.get<string>('NODE_ENV');
        const sslConfig =
          environment === 'production'
            ? { ca: fs.readFileSync(caPath).toString() }
            : false;

        return {
          type: 'postgres',
          host: configService.get<string>('POSTGRES_HOST'),
          port: configService.get<number>('POSTGRES_PORT'),
          username: configService.get<string>('POSTGRES_USER'),
          password: configService.get<string>('POSTGRES_PASSWORD'),
          database: configService.get<string>('POSTGRES_DB'),
          entities: [User, ElectricityHistory],
          synchronize: true,
          ssl: sslConfig,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ElectricityHistoryModule,
  ],
  controllers: [AppController, ElectricityHistoryController],
  providers: [AppService, ElectricityHistoryService],
})
export class AppModule {}
