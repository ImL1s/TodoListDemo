import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from './todos/todos.module';
import { Todo } from './todos/todo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'todos.db',
      entities: [Todo],
      synchronize: true,
      logging: false,
    }),
    TodosModule,
  ],
})
export class AppModule {}
