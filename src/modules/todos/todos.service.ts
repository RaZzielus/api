import {BadRequestException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoEntity } from "./todo.entity";
import { Repository } from 'typeorm';
import {CreateTodoDto} from "./dto/create-todo.dto";

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(TodoEntity)
        private todoRepository: Repository<TodoEntity>,
    ) {}

    async getTodos(status: number, userId: number){
        return this.todoRepository.find({
            order: {
                id: 'DESC'
            },
            where: {
                ...(status && { status }),
                user_id: userId
            }
        });
    }

    async createTodo(body: CreateTodoDto, userId: number){
        const todoEntity = new TodoEntity();
        todoEntity.fill({...body, user_id: userId});

        return this.todoRepository.save(todoEntity);
    }

    async updateTodoStatus(id, userId, status){
        const todoEntity = await this.todoRepository.findOneBy({ id });

        if(!todoEntity){
            throw new BadRequestException('There is no todo with such id');
        }

        await this.validateCurrentUserAccess(id, userId);

        todoEntity.status = status;

        return this.todoRepository.save(todoEntity);
    }

    async deleteToDo(id, userId){
        await this.validateCurrentUserAccess(id, userId);

        return await this.todoRepository.delete({ id });
    }

    async validateCurrentUserAccess(id, userId){
        const todo = await this.todoRepository.findOneBy({
            user_id: userId,
            id
        });

        if(!todo){
            throw new BadRequestException('Access denied');
        }
    }
}
