import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus, Put, Param, Delete, Get, Query, Req, Inject,
} from '@nestjs/common';
import { TodosService } from "./todos.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { TodoInterface } from "./interfaces/todo.interface";
import { todoStatuses } from "../../common/constants";
import {Request} from "express";

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('')
  @HttpCode(HttpStatus.OK)
  async createTodo(@Body() body: CreateTodoDto, @Req() req: Request) {
    const createdTodo = await this.todosService.createTodo(body, req.user['id']);

    return new TodoInterface().init(createdTodo);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('')
  @HttpCode(HttpStatus.OK)
  async getTodos(@Query() query, @Req() req: Request) {
    return await this.todosService.getTodos(query.status, req.user['id']);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id/set-completed/')
  @HttpCode(HttpStatus.OK)
  async setTodoCompleted(@Param('id') id: number, @Req() req: Request) {
    const todo = await this.todosService.updateTodoStatus(id, req.user['id'], todoStatuses.COMPLETED);

    return new TodoInterface().init(todo);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id/set-uncompleted/')
  @HttpCode(HttpStatus.OK)
  async setTodoUncompleted(@Param('id') id: number, @Req() req: Request) {
    const todo = await this.todosService.updateTodoStatus(id, req.user['id'], todoStatuses.UNCOMPLETED);

    return new TodoInterface().init(todo);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteTodo(@Param('id') id: number, @Req() req: Request) {
    return await this.todosService.deleteToDo(id, req.user['id']);
  }
}
