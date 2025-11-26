import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { CreateTodoDto, UpdateTodoDto } from './todo.dto';
import { Todo } from './todo.entity';

describe('TodosController', () => {
  let controller: TodosController;
  let service: TodosService;

  const mockTodosService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: mockTodosService,
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    service = module.get<TodosService>(TodosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      mockTodosService.findAll.mockResolvedValue(todos);

      const result = await controller.findAll();

      expect(result).toEqual(todos);
      expect(mockTodosService.findAll).toHaveBeenCalled();
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
      mockTodosService.findOne.mockResolvedValue(todo);

      const result = await controller.findOne(1);

      expect(result).toEqual(todo);
      expect(mockTodosService.findOne).toHaveBeenCalledWith(1);
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
      mockTodosService.create.mockResolvedValue(todo);

      const result = await controller.create(createTodoDto);

      expect(result).toEqual(todo);
      expect(mockTodosService.create).toHaveBeenCalledWith(createTodoDto);
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updateTodoDto: UpdateTodoDto = { text: 'Updated', completed: true };
      const todo: Todo = {
        id: 1,
        text: 'Updated',
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockTodosService.update.mockResolvedValue(todo);

      const result = await controller.update(1, updateTodoDto);

      expect(result).toEqual(todo);
      expect(mockTodosService.update).toHaveBeenCalledWith(1, updateTodoDto);
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      mockTodosService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(mockTodosService.remove).toHaveBeenCalledWith(1);
    });
  });
});
