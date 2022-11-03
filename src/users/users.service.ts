import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Users } from './entities/user.entity';

type aUser = {
  id: number;
  email: string;
  passwordHash: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: EntityRepository<Users>,
  ) {}

  async findOne(email: string): Promise<aUser> {
    const user = await this.usersRepository.findOne({ email: email });

    return { id: user.id, email: user.email, passwordHash: user.passwordHash };
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
