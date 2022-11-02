import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Users } from './entities/user.entity';
import { AuthDto } from 'src/authentication/dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: EntityRepository<Users>,
  ) {}

  async findOne(email: string): Promise<Users> {
    return this.usersRepository.findOne({ email: email });
  }

  async create(newUser): Promise<AuthDto> {
    const { email, password } = newUser;
    const response = await this.usersRepository.nativeInsert({
      email,
      password,
    });

    return { id: response, email, password };
  }
}
