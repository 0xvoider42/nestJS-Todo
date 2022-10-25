import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';

@Entity({ tableName: 'todo' })
export class TodoEntity {
  @PrimaryKey()
  @SerializedPrimaryKey()
  id: number;

  @Property()
  title: string;

  @Property()
  text: string;

  @Property({ type: 'timestamptz' })
  createdAt: Date;

  @Property({ type: 'timestamptz' })
  updatedAt: Date;

  constructor(id: number, title: string, text: string) {
    this.title = title;
    this.text = text;
  }
}
