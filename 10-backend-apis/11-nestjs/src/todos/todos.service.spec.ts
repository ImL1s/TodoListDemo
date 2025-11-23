import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './todo.entity';
import { CreateTodoDto, UpdateTodoDto } from './todo.dto';

describe('TodosService', () => {
  let service: TodosService;
  let repository: Repository<Todo>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    repository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const todos: Todo[] = [
        {
          id: 1,
          text: 'Test todo',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockRepository.find.mockResolvedValue(todos);

      const result = await service.findAll();

      expect(result).toEqual(todos);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
    });

    it('should return an empty array when no todos exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single todo', async () => {
      const todo: Todo = {
        id: 1,
        text: 'Test todo',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockRepository.findOne.mockResolvedValue(todo);

      const result = await service.findOne(1);

      expect(result).toEqual(todo);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when todo not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Todo with ID 999 not found',
      );
    });
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const createTodoDto: CreateTodoDto = { text: 'New todo' };
      const todo: Todo = {
        id: 1,
        text: 'New todo',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(todo);
      mockRepository.save.mockResolvedValue(todo);

      const result = await service.create(createTodoDto);

      expect(result).toEqual(todo);
      expect(mockRepository.create).toHaveBeenCalledWith({
        text: 'New todo',
        completed: false,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(todo);
    });
  });

  describe('update', () => {
    it('should update a todo text', async () => {
      const existingTodo: Todo = {
        id: 1,
        text: 'Original',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updateTodoDto: UpdateTodoDto = { text: 'Updated' };
      const updatedTodo: Todo = { ...existingTodo, text: 'Updated' };

      mockRepository.findOne.mockResolvedValue(existingTodo);
      mockRepository.save.mockResolvedValue(updatedTodo);

      const result = await service.update(1, updateTodoDto);

      expect(result.text).toEqual('Updated');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should update a todo completed status', async () => {
      const existingTodo: Todo = {
        id: 1,
        text: 'Test',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updateTodoDto: UpdateTodoDto = { completed: true };
      const updatedTodo: Todo = { ...existingTodo, completed: true };

      mockRepository.findOne.mockResolvedValue(existingTodo);
      mockRepository.save.mockResolvedValue(updatedTodo);

      const result = await service.update(1, updateTodoDto);

      expect(result.completed).toBe(true);
    });

    it('should throw NotFoundException when updating non-existent todo', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { text: 'Updated' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      const todo: Todo = {
        id: 1,
        text: 'Test',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(todo);
      mockRepository.remove.mockResolvedValue(todo);

      await service.remove(1);

      expect(mockRepository.remove).toHaveBeenCalledWith(todo);
    });

    it('should throw NotFoundException when removing non-existent todo', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
