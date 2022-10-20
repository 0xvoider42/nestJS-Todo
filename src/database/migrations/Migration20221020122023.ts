import { Migration } from '@mikro-orm/migrations';

export class Migration20221020122023 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "todo_entity" add column "created_at" timestamptz(0) not null, add column "updated_at" timestamptz(0) not null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "todo_entity" drop column "created_at";');
    this.addSql('alter table "todo_entity" drop column "updated_at";');
  }
}
