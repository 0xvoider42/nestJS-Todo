import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class TodoEntity {
  @PrimaryKey()
  id: string;

  @Property()
  title: string;

  @Property()
  text: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  constructor(id: string, title: string, text: string) {
    this.id = id;
    this.title = title;
    this.text = text;
  }
}
