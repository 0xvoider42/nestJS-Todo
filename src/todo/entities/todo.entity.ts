import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'todo' })
export class TodoEntity {
  @PrimaryKey()
  id: number;

  @Property()
  title: string;

  @Property()
  text: string;

  @Property({ type: 'timestamptz' })
  createdAt: Date;

  @Property({ type: 'timestamptz' })
  updatedAt: Date;

  constructor(title: string, text: string) {
    this.title = title;
    this.text = text;
  }
}
