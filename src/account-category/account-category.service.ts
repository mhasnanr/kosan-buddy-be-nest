import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountCategory } from './account-category.entity';
import { CreateAccountCategoryDto } from './dto/create-account-category.dto';
import { UpdateAccountCategoryDto } from './dto/update-account-category.dto';

@Injectable()
export class AccountCategoryService {
  constructor(
    @InjectRepository(AccountCategory)
    private readonly accountCategoryRepository: Repository<AccountCategory>,
  ) {}

  create(
    accountId: number,
    createAccountCategoryDto: CreateAccountCategoryDto,
  ): Promise<AccountCategory> {
    const category = this.accountCategoryRepository.create({
      ...createAccountCategoryDto,
      account: { id: accountId },
    });
    return this.accountCategoryRepository.save(category);
  }

  findByAccount(accountId: number): Promise<AccountCategory[]> {
    return this.accountCategoryRepository.find({
      where: { account: { id: accountId } },
      relations: ['account'],
    });
  }

  findOne(id: number): Promise<AccountCategory | null> {
    return this.accountCategoryRepository.findOne({
      where: { id },
      relations: ['account'],
    });
  }

  async update(
    id: number,
    updateAccountCategoryDto: UpdateAccountCategoryDto,
  ): Promise<AccountCategory | null> {
    const result = await this.accountCategoryRepository.update(
      id,
      updateAccountCategoryDto,
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Account Category with ID ${id} not found`);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.accountCategoryRepository.delete(id);
  }
}
