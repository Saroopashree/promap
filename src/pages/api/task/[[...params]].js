import {
  createHandler,
  Get,
  Param,
  Put,
  Post,
  Delete,
  Body,
  Query,
  Req,
  Header,
} from "next-api-decorators";
import hop from "../../../server/hop";
import JwtAuthGuard from "../../../server/jwtAuthGuard";
import mongo from "../../../server/mongo";
import TaskService from "../../../server/taskService";

const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

class TaskRouter {
  constructor() {
    this.taskService = new TaskService(mongo, hop);
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
  async createTask(@Header("authorization") authHeader, @Body() body) {
    const token = authHeader.split(" ")[1];
    const context = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return await this.taskService.createTask(body, context.channelId);
  }

  @Put("/:key")
  @JwtAuthGuard()
  async updateTask(@Param("key") key, @Body() body) {
    return await this.taskService.updateTask(key, body);
  }

  @Put("/:key/status")
  @JwtAuthGuard()
  async updateTaskStatus(
    @Header("authorization") authHeader,
    @Param("key") key,
    @Body() body
  ) {
    const token = authHeader.split(" ")[1];
    const context = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return await this.taskService.changeTaskStatus(
      key,
      body.status,
      context.channelId
    );
  }

  @Delete("/:key")
  @JwtAuthGuard()
  async deleteTask(@Header("authorization") authHeader, @Param("key") key) {
    const token = authHeader.split(" ")[1];
    const context = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return await this.taskService.deleteTask(key, context.channelId);
  }
}

export default createHandler(TaskRouter);
