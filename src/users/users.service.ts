import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Users } from './entities/user.entity';

type aUser = {
  id: number;
  email: string;
  hash: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: EntityRepository<Users>,
  ) {}

  async findOne(email: string): Promise<aUser> {
    const user = await this.usersRepository.findOne({ email: email });

    return { id: user.id, email: user.email, hash: user.hash };
  }

  async create(newUser: {
    email: string;
    hash: string;
  }): Promise<{ id: number; email: string }> {
    const { email, hash } = newUser;
    const response = await this.usersRepository.nativeInsert({
      email,
      hash,
    });

    return { id: response, email };
  }
}
