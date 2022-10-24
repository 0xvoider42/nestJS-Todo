import { Migration } from '@mikro-orm/migrations';

export class Migration20221024091248 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW."updated_at" = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;`);

    this.addSql(
      'create table "todo" ("id" varchar(255) not null, "title" varchar(255) not null, "text" varchar(255) not null, "created_at" timestamptz not null DEFAULT NOW(), "updated_at" timestamptz(0) not null DEFAULT NOW(), constraint "todo_pkey" primary key ("id"));',
    );

    this.addSql(`
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON "todo"
      FOR EACH ROW
      EXECUTE PROCEDURE trigger_set_timestamp();`);
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "todo" cascade;');
  }
}
