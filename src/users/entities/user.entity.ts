import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Users {
  @PrimaryKey()
  id: number;

  @Property()
  email: string;

  @Property()
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
