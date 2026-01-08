import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountCategory } from './account-category.entity';
import { AccountCategoryController } from './account-category.controller';
import { AccountCategoryService } from './account-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccountCategory])],
  controllers: [AccountCategoryController],
  providers: [AccountCategoryService],
  exports: [AccountCategoryService],
})
export class AccountCategoryModule {}
