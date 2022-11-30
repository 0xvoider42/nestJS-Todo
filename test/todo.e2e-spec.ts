import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { AuthenticationService } from '../src/authentication/authentication.service';
import { createUser } from './queries';
import { dbConnection, randomEmail, randomStr } from './utils';
import { TestDataBase } from './types';
import { TodoEntity } from '../src/todo/entities/todo.entity';

describe('Todo', () => {
  let app: INestApplication;
  let authService: AuthenticationService;
  let connection: TestDataBase;

  const testTitle = randomStr();
  const testText = randomStr();

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    authService = await moduleRef.get(AuthenticationService);
    connection = await dbConnection();
  });

  describe('Create new todos POST /todos', () => {
    it('should return 201 and create new todo', async () => {
      const email = randomEmail();
      const password = randomStr();

      await createUser({ email, password });

      const { token } = await authService.signIn({ email, password });

      return request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${token.access_token.toString()}`)
        .send({
          title: testTitle,
          text: testText,
        })
        .expect(201)
        .then(async () => {
          expect(
            await connection.findOne(TodoEntity, { title: testTitle }),
          ).toEqual(expect.objectContaining({ title: testTitle }));
        });
    });

    it('should return 400 if text is not provided', async () => {
      const email = randomEmail();
      const password = randomStr();

      await createUser({ email, password });

      const { token } = await authService.signIn({ email, password });

      return request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${token.access_token.toString()}`)
        .send({
          title: testTitle,
        })
        .expect(400);
    });

    it('should return 400 and errors array with path "title" if title is not provided', async () => {
      const email = randomEmail();
      const password = randomStr();

      await createUser({ email, password });

      const { token } = await authService.signIn({ email, password });

      return request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${token.access_token.toString()}`)
        .send({
          text: testText,
        })
        .expect(400)
        .then((res) => {
          const errorPath = res.body.errors[0].path[0];

          expect(res.body.errors).toHaveLength(1);

          expect(errorPath).toEqual('title');

          expect(res.body.message).toEqual(expect.any(String));
          expect(res.body.errors).toEqual(expect.any(Array));
        });
    });

    it('should return 400 and errors array with path "text" if text is not provided', async () => {
      const email = randomEmail();
      const password = randomStr();

      await createUser({ email, password });

      const { token } = await authService.signIn({ email, password });

      return request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${token.access_token.toString()}`)
        .send({
          title: testTitle,
        })
        .expect(400)
        .then((res) => {
          const errorPath = res.body.errors[0].path[0];

          expect(res.body.errors).toHaveLength(1);

          expect(errorPath).toEqual('text');

          expect(res.body.message).toEqual(expect.any(String));
          expect(res.body.errors).toEqual(expect.any(Array));
        });
    });

    describe('Fetches all todos GET /todos', () => {
      it('should return 200 if todos are created', async () => {
        await connection.nativeInsert(TodoEntity, {
          title: testTitle,
          text: testText,
        });

        return request(app.getHttpServer())
          .get('/todos')
          .expect(200)
          .then((res) => {
            expect(res.body.find((todo) => todo.id === 1)).toEqual(
              expect.objectContaining({
                id: 1,
                title: testTitle,
                text: testText,
              }),
            );
          });
      });
    });

    describe('Fetches a specific todo GET /todos/:id', () => {
      it('should return 200 and a todo corresponding to passed id', async () => {
        const todo = await connection.nativeInsert(TodoEntity, {
          title: testTitle,
          text: testText,
        });

        return request(app.getHttpServer())
          .get(`/todos/${todo}`)
          .expect(200)
          .then((res) => {
            const id = res.body.id;

            expect(id).toEqual(3);
          });
      });
    });

    describe('Updates a todo corresponding to passed id PATCH /todos/:id', () => {
      it('should return 200 and edit title of a todo corresponding to id', async () => {
        const email = randomEmail();
        const password = randomStr();
        const title = randomStr();
        const text = randomStr();
        const id = 3;

        await createUser({ email, password });

        const { token } = await authService.signIn({ email, password });

        return request(app.getHttpServer())
          .patch(`/todos/${id}`)
          .set('Authorization', `Bearer ${token.access_token.toString()}`)
          .send({ title, text })
          .expect(200)
          .then(async () => {
            expect(await connection.findOne(TodoEntity, { id })).toEqual(
              expect.objectContaining({
                id,
                text,
                title,
              }),
            );
          });
      });

      it('should return 400 and an array of errors if update body is empty', async () => {
        const email = randomEmail();
        const password = randomStr();
        const id = 3;

        await createUser({ email, password });

        const { token } = await authService.signIn({ email, password });

        return request(app.getHttpServer())
          .patch(`/todos/${id}`)
          .set('Authorization', `Bearer ${token.access_token.toString()}`)
          .send({})
          .expect(400)
          .then((res) => {
            const errorPath = res.body.errors[0].path[0];

            expect(res.body.errors).toHaveLength(1);

            expect(errorPath).toEqual('text');

            expect(res.body.message).toEqual(expect.any(String));
            expect(res.body.errors).toEqual(expect.any(Array));
          });
      });
    });

    describe('Removes a todo DELETE /todos/:id', () => {
      it('should return 200 and remove a todo corresponding to the id', async () => {
        const email = randomEmail();
        const password = randomStr();
        const id = 3;

        await createUser({ email, password });

        const { token } = await authService.signIn({ email, password });

        return request(app.getHttpServer())
          .delete(`/todos/${id}`)
          .set('Authorization', `Bearer ${token.access_token.toString()}`)
          .expect(200)
          .then(async () => {
            expect(await connection.findOne(TodoEntity, { id })).toThrowError;
          });
      });
    });
  });
});
