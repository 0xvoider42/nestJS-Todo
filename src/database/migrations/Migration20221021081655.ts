import { Migration } from '@mikro-orm/migrations';

export class Migration20221021081655 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `CREATE OR REPLACE FUNCTION trigger_set_timestamp() 
          RETURNS TRIGGER AS $$ BEGIN NEW."updated_at" = NOW();
          RETURN NEW; 
          END;
      $$ LANGUAGE 'plpgsql'`,
    );
    this.addSql(
      'create table "todo_entity" ("id" varchar(255) not null, "title" varchar(255) not null, "text" varchar(255) not null, constraint "todo_entity_pkey" primary key ("id"), "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(), "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW());',
    );
    this.addSql(`
    CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON "todo_entity"
      FOR EACH ROW
      EXECUTE PROCEDURE trigger_set_timestamp();
    `);
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "todo_entity" cascade;');
  }
}
