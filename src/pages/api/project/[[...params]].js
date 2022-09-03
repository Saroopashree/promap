import {
  createHandler,
  Body,
  Delete,
  Get,
  Param,
  Post,
} from "next-api-decorators";
import JwtAuthGuard from "../../../server/jwtAuthGuard";
import mongo from "../../../server/mongo";
import ProjectService from "../../../server/projectService";

class ProjectsRouter {
  constructor() {
    this.projectService = new ProjectService(mongo);
  }

  @Get()
  @JwtAuthGuard()
  async listAllProjects() {
    return await this.projectService.listProjects();
  }

  @Get("/:id")
  @JwtAuthGuard()
  async getProjectById(@Param("id") id) {
    return await this.projectService.getProjectById(id);
  }

  @Post()
  @JwtAuthGuard()
  async createProject(@Body() body) {
    return await this.projectService.createProject(body);
  }

  @Delete()
  @JwtAuthGuard()
  async deleteProejct(@Param("id") id) {
    return await this.projectService.deleteProject(id);
  }
}

export default createHandler(ProjectsRouter);
