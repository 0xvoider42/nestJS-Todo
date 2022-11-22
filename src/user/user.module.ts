import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { Users } from './entities/user.entity';
import { UserService } from './user.service';

@Module({
  imports: [MikroOrmModule.forFeature([Users])],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
