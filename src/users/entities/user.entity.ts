import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class Users {
  @PrimaryKey()
  id: number;

  @Property()
  @Unique()
  email: string;

  @Property()
  password: string;

  @Property()
  hash: string;

  @Property({ type: 'timestamptz' })
  createdAt: Date;

  @Property({ type: 'timestamptz' })
  updatedAt: Date;

  constructor(email: string, password: string, hash: string) {
    this.email = email;
    this.password = password;
    this.hash = hash;
  }
}
