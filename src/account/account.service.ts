import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  create(createAccountDto: CreateAccountDto): Promise<Account> {
    const { userId, ...rest } = createAccountDto;
    const account = this.accountRepository.create({
      ...rest,
      user: { id: userId },
    });
    return this.accountRepository.save(account);
  }

  findAll(): Promise<Account[]> {
    return this.accountRepository.find({ relations: ['user'] });
  }

  findOne(id: number): Promise<Account | null> {
    return this.accountRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async update(
    id: number,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account | null> {
    const { userId, ...rest } = updateAccountDto;
    const updatePayload: Partial<Account> = { ...rest };

    if (userId !== undefined) {
      updatePayload.user = { id: userId } as Account['user'];
    }

    const result = await this.accountRepository.update(id, updatePayload);

    if (result.affected === 0) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.accountRepository.delete(id);
  }
}
