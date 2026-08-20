import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import type { Request } from 'express';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { TaskStatus } from './schemas/task.schema';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a task',
  })
  create(
    @Req() req: Request,
    @Body() dto: CreateTaskDto,
  ) {
    const user = req.user as {
      sub: string;
    };

    return this.tasksService.create(
      user.sub,
      dto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all tasks',
  })
  findAll(@Req() req: Request) {
    const user = req.user as {
      sub: string;
    };

    return this.tasksService.findAll(user.sub);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get task by ID',
  })
  findOne(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const user = req.user as {
      sub: string;
    };

    return this.tasksService.findOne(
      user.sub,
      id,
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update task',
  })
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    const user = req.user as {
      sub: string;
    };

    return this.tasksService.update(
      user.sub,
      id,
      dto,
    );
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update task status',
  })
  updateStatus(
    @Req() req: Request,
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ) {
    const user = req.user as {
      sub: string;
    };

    return this.tasksService.updateStatus(
      user.sub,
      id,
      status,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete task',
  })
  remove(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const user = req.user as {
      sub: string;
    };

    return this.tasksService.remove(
      user.sub,
      id,
    );
  }
}