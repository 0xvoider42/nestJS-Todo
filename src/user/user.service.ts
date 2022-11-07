import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { aUser } from './types';
import { Users } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: EntityRepository<Users>,
  ) {}

  async findOne(email: string): Promise<aUser> {
    const user = await this.usersRepository.findOne({ email });

    return { id: user.id, email: user.email };
  }

  async create(newUser: {
    email: string;
    passwordHash: string;
  }): Promise<{ id: number; email: string }> {
    const { email, passwordHash } = newUser;

    const response = await this.usersRepository.nativeInsert({
      email,
      passwordHash,
    });

    return { id: response, email };
  }
}
