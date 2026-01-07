import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectricityHistory } from './electricity_history.entity';
import { ElectricityHistoryController } from './electricity_history.controller';
import { ElectricityHistoryService } from './electricity_history.service';

@Module({
  imports: [TypeOrmModule.forFeature([ElectricityHistory])],
  controllers: [ElectricityHistoryController],
  providers: [ElectricityHistoryService],
  exports: [ElectricityHistoryService],
})
export class ElectricityHistoryModule {}
