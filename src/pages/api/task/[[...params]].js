import {
  createHandler,
  Get,
  Param,
  Put,
  Post,
  Delete,
  Body,
  Query,
} from "next-api-decorators";
import JwtAuthGuard from "../../../server/jwtAuthGuard";
import mongo from "../../../server/mongo";
import TaskService from "../../../server/taskService";

class TaskRouter {
  constructor() {
    this.taskService = new TaskService(mongo);
  }

  @Get()
  @JwtAuthGuard()
  async listAllTasks(@Query("projectId") projectId, @Query("plans") plans) {
    plans = plans ? JSON.parse(plans) : null;
    plans = plans && plans.length > 0 ? plans : null;
    return await this.taskService.listTasks(projectId, plans);
  }

  @Get("/:key")
  @JwtAuthGuard()
  async getTaskByKey(@Param("key") key) {
    return await this.taskService.getTaskByKey(key);
  }

  @Post()
  @JwtAuthGuard()
  async createTask(@Body() body) {
    return await this.taskService.createTask(body);
  }

  @Put("/:key")
  @JwtAuthGuard()
  async updateTask(@Param("key") key, @Body() body) {
    return await this.taskService.updateTask(key, body);
  }

  @Put("/:key/status")
  @JwtAuthGuard()
  async updateTaskStatus(@Param("key") key, @Body() body) {
    return await this.taskService.changeTaskStatus(key, body.status);
  }

  @Delete("/:key")
  @JwtAuthGuard()
  async deleteTask(@Param("key") key) {
    return await this.taskService.deleteTask(key);
  }
}

export default createHandler(TaskRouter);
