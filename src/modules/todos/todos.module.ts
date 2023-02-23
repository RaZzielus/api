import { Module } from '@nestjs/common';
import { TodosService } from "./todos.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from "./todo.entity";
import { TodosController } from "./todos.controller";

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  controllers: [TodosController],
  providers: [TodosService],
  exports: [TodosService],
})
export class TodosModule {}
