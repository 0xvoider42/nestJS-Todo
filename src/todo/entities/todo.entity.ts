import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'todo' })
export class TodoEntity {
  @PrimaryKey()
  id: string;

  @Property()
  title: string;

  @Property()
  text: string;

  @Property({ type: 'timestamptz' })
  createdAt: Date;

  @Property({ type: 'timestamptz' })
  updatedAt: Date;

  constructor(id: string, title: string, text: string) {
    this.id = id;
    this.title = title;
    this.text = text;
  }
}
