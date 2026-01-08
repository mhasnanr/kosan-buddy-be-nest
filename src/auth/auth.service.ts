import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import bcrypt from 'bcrypt';

type SanitizedUser = Omit<User, 'password' | 'hashPassword'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerUserDto: RegisterUserDto,
  ): Promise<{ id: number; username: string }> {
    const { username } = registerUserDto;
    const existingUser = await this.usersService.findOne(username);

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const user = await this.usersService.create(registerUserDto);
    return { id: user.id, username: user.username };
  }

  async validateUser(
    loginUserDto: LoginUserDto,
  ): Promise<SanitizedUser | null> {
    const { username, password } = loginUserDto;
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: SanitizedUser) {
    const payload = { username: user.username, id: user.id };
    return {
      name: user.name,
      username: user.username,
      access_token: this.jwtService.sign(payload),
    };
  }
}
