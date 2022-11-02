import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Users } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: EntityRepository<Users>,
  ) {}

  async findByEmail(email: string): Promise<Users | undefined> {
    return this.userRepository.findOne({ email: email });
  }
}
