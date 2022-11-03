import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { TodoEntity } from 'src/todo/entities/todo.entity';

@Entity()
export class Users extends BaseEntity<TodoEntity, 'createdAt'> {
  @PrimaryKey()
  id: number;

  @Property()
  email: string;

  @Property()
  password: string;

  @Property({ type: 'timestamptz' })
  createdAt: Date;

  constructor(email: string, password: string) {
    super();
    this.email = email;
    this.password = password;
  }
}
