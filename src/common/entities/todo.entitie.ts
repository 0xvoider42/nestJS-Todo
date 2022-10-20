import { Entity, Formula, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class TodoEntity {
  @PrimaryKey()
  id: string;

  @Property()
  title: string;

  @Property()
  text: string;

  @Formula(
    'CREATE OR REPLACE FUNCTION setTime() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END;',
  )
  setTime: string;

  @Formula(
    'CREATE TRIGGER updateTime BEFORE UPDATE ON title, text FOR EACH ROW EXECUTE PROCEDURE setTime();',
  )
  updateTime: string;

  constructor(id: string, title: string, text: string, setTime: string) {
    this.id = id;
    this.title = title;
    this.text = text;
    this.setTime = setTime;
  }
}
