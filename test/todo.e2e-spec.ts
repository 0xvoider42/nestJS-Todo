import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Todo', () => {
  let app: INestApplication;
  const testTitle = 'test title';
  const testText = 'test text';

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('Create new todos POST /todos', () => {
    it('should return 201 and create new todo', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .send({
          title: testTitle,
          text: testText,
        })
        .expect(201)
        .then((res) => {
          expect(res.body.id).toEqual(expect.any(String));
        });
    });

    it('should return 500 if text is not provided', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .send({
          title: testTitle,
        })
        .expect(500);
    });
  });

  describe('Fetches all todos GET /todos', () => {
    it('should return 200 if todos are created', () => {
      return request(app.getHttpServer())
        .get('/todos')
        .expect(200)
        .then((res) => {
          expect(res.body[0].title).toEqual(testTitle);
        });
    });
  });
});
