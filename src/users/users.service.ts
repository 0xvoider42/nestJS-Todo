import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Users } from './entities/user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: EntityRepository<Users>,
  ) {}

  async findOne(email: string): Promise<Users> {
    return this.usersRepository.findOne({ email: email });
  }

  async create(newUser: UserDto) {
    const { email, password } = newUser;
    const response = await this.usersRepository.nativeInsert({
      email,
      password,
    });

    return { id: response, email };
  }

  async update(user) {
    const { id } = user;

    const response = await this.usersRepository.nativeUpdate(id, {
      password: '',
    });

    return response;
  }
}