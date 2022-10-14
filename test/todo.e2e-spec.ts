import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { TodoService } from '../src/todo.service';

describe('Todo', () => {
  let app: INestApplication;
  let todoService: TodoService;

  const testTitle = 'test title';
  const testText = 'test text';
  const trackId = [];

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    todoService = await app.resolve(TodoService);
  });

  describe('Create new todos POST /todos', () => {
    it('should return 201 and create new todo', () => {
      const spy = jest.spyOn(todoService, 'addTodo');

      return request(app.getHttpServer())
        .post('/todos')
        .send({
          title: testTitle,
          text: testText,
        })
        .expect(201)
        .then((res) => {
          const id = res.body.id;

          expect(id).toEqual(expect.any(String));

          expect(
            todoService.todos.find((todo) => todo.id === id),
          ).toBeDefined();
          trackId.push(id);

          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toBeCalledWith(testTitle, testText);
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
      todoService.todos.push({ id: '1', title: 'new title', text: 'new text' });
      const spy = jest.spyOn(todoService, 'getTodos');

      return request(app.getHttpServer())
        .get('/todos')
        .expect(200)
        .then((res) => {
          expect(res.body[1]).toEqual(todoService.todos[1]);

          expect(spy).toHaveBeenCalledTimes(1);
        });
    });
  });

  describe('Fetches a specific todo GET /todos/:id', () => {
    it('should return 200 and a todo corresponding to passed id', () => {
      todoService.todos.push({ id: '2', title: 'new title', text: 'new text' });
      const spy = jest.spyOn(todoService, 'getATodo');

      return request(app.getHttpServer())
        .get(`/todos/${todoService.todos[2].id}`)
        .expect(200)
        .then((res) => {
          const id = res.body.id;

          expect(todoService.getATodo(id)).toEqual(
            todoService.todos.find((todo) => todo.id === id),
          );

          expect(spy).toHaveBeenCalledTimes(2);
          expect(spy).toBeCalledWith(id);
        });
    });
  });

  describe('Updates a todo corresponding to passed id PATCH /todos/:id', () => {
    it('should return 200 and edit title of a todo corresponding to id', () => {
      todoService.todos.push({ id: '3', title: 'new title', text: 'new text' });
      const spy = jest.spyOn(todoService, 'updateTodo');

      return request(app.getHttpServer())
        .patch(`/todos/${todoService.todos[3].id}`)
        .send({ title: 'update', text: 'update text' })
        .expect(200)
        .then((res) => {
          const text = res.body.text;
          const title = res.body.title;

          expect(
            todoService.updateTodo(todoService.todos[2].id, title, text),
          ).toBeDefined();

          expect(
            todoService.updateTodo(todoService.todos[2].id, title, text),
          ).toEqual(todoService.todos.find((todo) => todo.title === title));

          expect(spy).toHaveBeenCalledTimes(3);
          expect(spy).toHaveBeenCalledWith(
            todoService.todos[2].id,
            title,
            text,
          );
        });
    });
  });

  describe('Removes a todo DELETE /todos/:id', () => {
    it('should return 200 and remove a todo corresponding to the id', async () => {
      todoService.todos.push({ id: '4', title: 'new title', text: 'new text' });
      const spy = jest.spyOn(todoService, 'removeTodo');

      return request(app.getHttpServer())
        .delete(`/todos/${todoService.todos[4].id}`)
        .expect(200)
        .then(() => {
          expect(todoService.getTodos().find((todo) => todo.id !== '4'));

          expect(spy).toBeCalledTimes(1);
        });
    });
  });
});
