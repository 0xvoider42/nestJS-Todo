import { Entity, Index, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class Users {
  @PrimaryKey()
  id: number;

  @Property()
  @Unique()
  @Index({ name: 'email_index' })
  email: string;

  @Property()
  passwordHash: string;

  @Property({ type: 'timestamptz' })
  createdAt: Date;

  @Property({ type: 'timestamptz' })
  updatedAt: Date;

  constructor(email: string, passwordHash: string) {
    this.email = email;
    this.passwordHash = passwordHash;
  }
}
