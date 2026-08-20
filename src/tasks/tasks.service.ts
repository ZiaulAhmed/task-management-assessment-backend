import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Task,
  TaskDocument,
  TaskStatus,
} from './schemas/task.schema';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
  ) {}

  async create(
    userId: string,
    dto: CreateTaskDto,
  ) {
    const task = new this.taskModel({
      ...dto,
      userId,
      dueDate: dto.dueDate
        ? new Date(dto.dueDate)
        : undefined,
    });

    return task.save();
  }

  async findAll(userId: string) {
    return this.taskModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(
    userId: string,
    taskId: string,
  ) {
    const task = await this.taskModel.findOne({
      _id: taskId,
      userId,
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(
    userId: string,
    taskId: string,
    dto: UpdateTaskDto,
  ) {
    const task = await this.taskModel.findOneAndUpdate(
      {
        _id: taskId,
        userId,
      },
      {
        ...dto,
        ...(dto.dueDate && {
          dueDate: new Date(dto.dueDate),
        }),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async remove(
    userId: string,
    taskId: string,
  ) {
    const task = await this.taskModel.findOneAndDelete({
      _id: taskId,
      userId,
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return {
      message: 'Task deleted successfully',
    };
  }

  async updateStatus(
    userId: string,
    taskId: string,
    status: TaskStatus,
  ) {
    const task = await this.taskModel.findOneAndUpdate(
      {
        _id: taskId,
        userId,
      },
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}