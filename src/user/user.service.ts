import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Users } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: EntityRepository<Users>,
  ) {}

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
