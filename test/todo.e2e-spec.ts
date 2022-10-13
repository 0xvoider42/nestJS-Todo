import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TodoModule } from '../src/todo.module';

describe('Todo', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [TodoModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('Create new todos POST /todos', () => {
    it('should create a new todo', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .send({
          title: 'Testing Title',
          text: 'Testing text',
        })
        .expect(201);
    });

    it('should return 500 if text is not provided', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .send({
          title: 'title',
        })
        .expect(500);
    });
  });

  describe('Fetches all todos GET /todos', () => {
    it('should create a new todo', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .send({
          title: 'Testing Title',
          text: 'Testing text',
        })
        .send({
          title: 'Testing Title',
          text: 'Testing text',
        })
        .expect(201);
    });

    it('should get todos with 200', () => {
      return request(app.getHttpServer()).get('/todos').expect(200);
    });
  });
});
