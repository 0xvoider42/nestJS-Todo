import { Migration } from '@mikro-orm/migrations';

export class Migration20221020103926 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "todo_entity" ("id" varchar(255) not null, "title" varchar(255) not null, "text" varchar(255) not null, constraint "todo_entity_pkey" primary key ("id"));',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "todo_entity" cascade;');
  }
}
