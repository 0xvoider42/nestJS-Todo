import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class Users {
  @PrimaryKey()
  id: number;

  @Property()
  @Unique()
  email: string;

  @Property()
  hash: string;

  @Property({ type: 'timestamptz' })
  createdAt: Date;

  @Property({ type: 'timestamptz' })
  updatedAt: Date;

  constructor(email: string, hash: string) {
    this.email = email;
    this.hash = hash;
  }
}
