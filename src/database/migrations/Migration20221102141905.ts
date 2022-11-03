import { Migration } from '@mikro-orm/migrations';

export class Migration20221102141905 extends Migration {
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
      'create table "todo" ("id" serial primary key, "title" varchar(255) not null, "text" varchar(255) not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now());',
    );

    this.addSql(`
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON "todo"
      FOR EACH ROW
      EXECUTE PROCEDURE trigger_set_timestamp();`);

    this.addSql(
      'create table "users" ("id" serial primary key, "email" varchar(255) not null, "password" varchar(255) not null);',
    );
  }
}