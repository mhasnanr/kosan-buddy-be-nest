import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccountCategoryService } from './account-category.service';
import { CreateAccountCategoryDto } from './dto/create-account-category.dto';
import { UpdateAccountCategoryDto } from './dto/update-account-category.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('account/:accountId/categories')
export class AccountCategoryController {
  constructor(
    private readonly accountCategoryService: AccountCategoryService,
  ) {}

  @Post()
  create(
    @Param('accountId', ParseIntPipe) accountId: number,
    @Body() createAccountCategoryDto: CreateAccountCategoryDto,
  ) {
    return this.accountCategoryService.create(
      accountId,
      createAccountCategoryDto,
    );
  }

  @Get()
  findByAccount(@Param('accountId', ParseIntPipe) accountId: number) {
    return this.accountCategoryService.findByAccount(accountId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const category = await this.accountCategoryService.findOne(id);
    if (!category) {
      throw new NotFoundException(`Account Category with ID ${id} not found`);
    }
    return category;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccountCategoryDto: UpdateAccountCategoryDto,
  ) {
    const updatedCategory = await this.accountCategoryService.update(
      id,
      updateAccountCategoryDto,
    );
    if (!updatedCategory) {
      throw new NotFoundException(`Account Category with ID ${id} not found`);
    }
    return updatedCategory;
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.accountCategoryService.remove(id);
  }
}
