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
import { ExpenseModule } from './expense/expense.module';
import { Expense } from './expense/expense.entity';
import { AccountModule } from './account/account.module';
import { AccountCategoryModule } from './account-category/account-category.module';
import { Account } from './account/account.entity';
import { AccountCategory } from './account-category/account-category.entity';
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
          entities: [
            User,
            Expense,
            Account,
            AccountCategory,
            ElectricityHistory,
          ],
          synchronize: false,
          ssl: sslConfig,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ElectricityHistoryModule,
    ExpenseModule,
    AccountModule,
    AccountCategoryModule,
  ],
  controllers: [AppController, ElectricityHistoryController],
  providers: [AppService, ElectricityHistoryService],
})
export class AppModule {}
