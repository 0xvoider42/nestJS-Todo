import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { TodoService } from '../src/todo/todo.service';
import { execSync } from 'child_process';

describe('Todo', () => {
  let app: INestApplication;
  let todoService: TodoService;

  const testTitle = 'test title';
  const testText = 'test text';
  const email = 'email@ee.ee';
  const password = 'qwerty123';

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    try {
      console.log('Running docker stuff');
      execSync('docker compose up -d');
      console.log('Running ORM stuff');
      execSync('npx mikro-orm migration:up');
    } catch (error) {
      console.log(error);
    }

    app = moduleRef.createNestApplication();
    await app.init();

    todoService = await app.resolve(TodoService);
  });

  afterAll(async () => {
    try {
      execSync('docker compose down');
    } catch (error) {
      console.log(error);
    }
  });

  describe('POST /authorize, authentication', () => {
    it('should return 201 and register new user', async () => {
      return request(app.getHttpServer())
        .post('/authentication/signup')
        .send({ email: email, password: password })
        .expect(201)
        .then((res) => {
          console.log(res);
        });
    });
  });

  describe('POST /todos, create new todos', () => {
    it('should return 201 and create new todo', async () => {
      const spy = jest.spyOn(todoService, 'addTodo');

      return request(app.getHttpServer())
        .post('/todos')
        .send({
          title: testTitle,
          text: testText,
        })
        .expect(201)
        .then((res) => {
          // const id = res.body.id;

          // expect(id).toEqual(expect.any(String));
          // expect(
          //   todoService.addTodo(res.body.tit).toBeDefined();

          // expect(spy).toHaveBeenCalledTimes(1);
          // expect(spy).toBeCalledWith(testTitle, testText);
          console.log(res);
        });
    });
  });

  //   it('should return 400 if text is not provided', () => {
  //     return request(app.getHttpServer())
  //       .post('/todos')
  //       .send({
  //         title: testTitle,
  //       })
  //       .expect(400);
  //   });

  //   it('should return 400 and errors array with path "title" if title is not provided', () => {
  //     const spy = jest.spyOn(todoService, 'addTodo');
  //     return request(app.getHttpServer())
  //       .post('/todos')
  //       .send({
  //         text: testText,
  //       })
  //       .expect(400)
  //       .then((res) => {
  //         const errorPath = res.body.errors[0].path[0];

  //         expect(res.body.errors).toHaveLength(1);

  //         expect(errorPath).toEqual('title');

  //         expect(res.body.message).toEqual(expect.any(String));
  //         expect(res.body.errors).toEqual(expect.any(Array));

  //         expect(spy).toHaveBeenCalledTimes(1);
  //       });
  //   });

  //   it('should return 400 and errors array with path "text" if text is not provided', () => {
  //     const spy = jest.spyOn(todoService, 'addTodo');
  //     return request(app.getHttpServer())
  //       .post('/todos')
  //       .send({
  //         title: testTitle,
  //       })
  //       .expect(400)
  //       .then((res) => {
  //         const errorPath = res.body.errors[0].path[0];

  //         expect(res.body.errors).toHaveLength(1);

  //         expect(errorPath).toEqual('text');

  //         expect(res.body.message).toEqual(expect.any(String));
  //         expect(res.body.errors).toEqual(expect.any(Array));

  //         expect(spy).toHaveBeenCalledTimes(1);
  //       });
  //   });
  // });

  // describe('Fetches all todos GET /todos', () => {
  //   it('should return 200 if todos are created', () => {
  //     const id = '1';

  //     todoService.todos.push({ id, title: 'new title', text: 'new text' });
  //     const spy = jest.spyOn(todoService, 'getTodos');

  //     return request(app.getHttpServer())
  //       .get('/todos')
  //       .expect(200)
  //       .then((res) => {
  //         expect(res.body.find((todo) => todo.id === '1')).toBeDefined();

  //         expect(spy).toHaveBeenCalledTimes(1);
  //       });
  //   });
  // });

  // describe('Fetches a specific todo GET /todos/:id', () => {
  //   it('should return 200 and a todo corresponding to passed id', () => {
  //     const id = '2';

  //     todoService.todos.push({ id, title: 'new title', text: 'new text' });
  //     const spy = jest.spyOn(todoService, 'getATodo');

  //     return request(app.getHttpServer())
  //       .get(`/todos/${id}`)
  //       .expect(200)
  //       .then((res) => {
  //         const id = res.body.id;

  //         expect(id).toEqual('2');

  //         expect(spy).toHaveBeenCalledTimes(1);
  //         expect(spy).toBeCalledWith(id);

  //         todoService.todos = [];
  //       });
  //   });
  // });

  // describe('Updates a todo corresponding to passed id PATCH /todos/:id', () => {
  //   it('should return 200 and edit title of a todo corresponding to id', async () => {
  //     const id = '2';

  //     todoService.todos.push({ id, title: 'new title', text: 'new text' });
  //     const spy = jest.spyOn(todoService, 'updateTodo');

  //     return request(app.getHttpServer())
  //       .patch(`/todos/${id}`)
  //       .send({ title: 'update', text: 'update text' })
  //       .expect(200)
  //       .then((res) => {
  //         const title = res.body.title;
  //         const text = res.body.text;

  //         expect(title).toEqual('update');
  //         expect(text).toEqual('update text');
  //         expect(todoService.todos.find((todo) => todo.id === id)).toEqual({
  //           id,
  //           text: 'update text',
  //           title: 'update',
  //         });

  //         expect(spy).toHaveBeenCalledTimes(1);
  //         expect(spy).toHaveBeenCalledWith(id, 'update', 'update text');

  //         todoService.todos = [];
  //       });
  //   });

  //   it('should return 400 and an array of errors if update body is empty', () => {
  //     const id = '4';

  //     todoService.todos.push({ id, title: 'new title', text: 'new text' });
  //     const spy = jest.spyOn(todoService, 'updateTodo');

  //     return request(app.getHttpServer())
  //       .patch(`/todos/${id}`)
  //       .send({})
  //       .expect(400)
  //       .then((res) => {
  //         const errorPath = res.body.errors[0].path[0];

  //         expect(res.body.errors).toHaveLength(1);

  //         expect(errorPath).toEqual('text');

  //         expect(res.body.message).toEqual(expect.any(String));
  //         expect(res.body.errors).toEqual(expect.any(Array));

  //         expect(spy).toHaveBeenCalledTimes(1);
  //       });
  //   });
  // });

  // describe('Removes a todo DELETE /todos/:id', () => {
  //   it('should return 200 and remove a todo corresponding to the id', async () => {
  //     const id = '3';

  //     todoService.todos.push({ id, title: 'new title', text: 'new text' });
  //     const spy = jest.spyOn(todoService, 'removeTodo');

  //     return request(app.getHttpServer())
  //       .delete(`/todos/${id}`)
  //       .expect(200)
  //       .then(() => {
  //         expect(todoService.getTodos().find((todo) => todo.id !== id));

  //         expect(spy).toBeCalledTimes(1);
  //       });
  //   });
  // });
});
