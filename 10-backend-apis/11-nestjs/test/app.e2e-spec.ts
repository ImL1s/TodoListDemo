import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from '../src/todos/todo.entity';

describe('Todos API (e2e)', () => {
  let app: INestApplication;
  let repository: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    repository = moduleFixture.get(getRepositoryToken(Todo));
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await repository.clear();
  });

  describe('/api/todos (GET)', () => {
    it('should return an empty array', () => {
      return request(app.getHttpServer())
        .get('/api/todos')
        .expect(200)
        .expect([]);
    });

    it('should return all todos', async () => {
      await repository.save([
        { text: 'First todo', completed: false },
        { text: 'Second todo', completed: true },
      ]);

      return request(app.getHttpServer())
        .get('/api/todos')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveLength(2);
          expect(response.body[0]).toHaveProperty('id');
          expect(response.body[0]).toHaveProperty('text');
          expect(response.body[0]).toHaveProperty('completed');
        });
    });
  });

  describe('/api/todos (POST)', () => {
    it('should create a new todo', () => {
      return request(app.getHttpServer())
        .post('/api/todos')
        .send({ text: 'New todo' })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.text).toBe('New todo');
          expect(response.body.completed).toBe(false);
        });
    });

    it('should return 400 for empty text', () => {
      return request(app.getHttpServer())
        .post('/api/todos')
        .send({ text: '' })
        .expect(400);
    });

    it('should return 400 for missing text', () => {
      return request(app.getHttpServer())
        .post('/api/todos')
        .send({})
        .expect(400);
    });

    it('should return 400 for text longer than 500 characters', () => {
      return request(app.getHttpServer())
        .post('/api/todos')
        .send({ text: 'a'.repeat(501) })
        .expect(400);
    });
  });

  describe('/api/todos/:id (GET)', () => {
    it('should return a specific todo', async () => {
      const todo = await repository.save({ text: 'Test todo', completed: false });

      return request(app.getHttpServer())
        .get(`/api/todos/${todo.id}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(todo.id);
          expect(response.body.text).toBe('Test todo');
        });
    });

    it('should return 404 for non-existent todo', () => {
      return request(app.getHttpServer()).get('/api/todos/999').expect(404);
    });
  });

  describe('/api/todos/:id (PUT)', () => {
    it('should update a todo', async () => {
      const todo = await repository.save({ text: 'Original', completed: false });

      return request(app.getHttpServer())
        .put(`/api/todos/${todo.id}`)
        .send({ text: 'Updated', completed: true })
        .expect(200)
        .then((response) => {
          expect(response.body.text).toBe('Updated');
          expect(response.body.completed).toBe(true);
        });
    });

    it('should partially update a todo', async () => {
      const todo = await repository.save({ text: 'Original', completed: false });

      return request(app.getHttpServer())
        .put(`/api/todos/${todo.id}`)
        .send({ completed: true })
        .expect(200)
        .then((response) => {
          expect(response.body.text).toBe('Original');
          expect(response.body.completed).toBe(true);
        });
    });

    it('should return 404 for non-existent todo', () => {
      return request(app.getHttpServer())
        .put('/api/todos/999')
        .send({ text: 'Updated' })
        .expect(404);
    });

    it('should return 400 for empty text', async () => {
      const todo = await repository.save({ text: 'Original', completed: false });

      return request(app.getHttpServer())
        .put(`/api/todos/${todo.id}`)
        .send({ text: '' })
        .expect(400);
    });
  });

  describe('/api/todos/:id (DELETE)', () => {
    it('should delete a todo', async () => {
      const todo = await repository.save({ text: 'To delete', completed: false });

      await request(app.getHttpServer())
        .delete(`/api/todos/${todo.id}`)
        .expect(204);

      const todos = await repository.find();
      expect(todos).toHaveLength(0);
    });

    it('should return 404 for non-existent todo', () => {
      return request(app.getHttpServer()).delete('/api/todos/999').expect(404);
    });
  });

  describe('Complete CRUD workflow', () => {
    it('should create, read, update, and delete a todo', async () => {
      // Create
      const createResponse = await request(app.getHttpServer())
        .post('/api/todos')
        .send({ text: 'Workflow test' })
        .expect(201);

      const todoId = createResponse.body.id;

      // Read
      await request(app.getHttpServer())
        .get(`/api/todos/${todoId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.text).toBe('Workflow test');
        });

      // Update
      await request(app.getHttpServer())
        .put(`/api/todos/${todoId}`)
        .send({ text: 'Updated workflow', completed: true })
        .expect(200)
        .then((response) => {
          expect(response.body.text).toBe('Updated workflow');
          expect(response.body.completed).toBe(true);
        });

      // Delete
      await request(app.getHttpServer())
        .delete(`/api/todos/${todoId}`)
        .expect(204);

      // Verify deletion
      await request(app.getHttpServer()).get(`/api/todos/${todoId}`).expect(404);
    });
  });
});
