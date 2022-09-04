import {
  createHandler,
  Get,
  Param,
  Put,
  Post,
  Delete,
  Body,
} from "next-api-decorators";
import JwtAuthGuard from "../../../server/jwtAuthGuard";
import mongo from "../../../server/mongo";
import PlanService from "../../../server/planService";

class PlanRouter {
  constructor() {
    this.planService = new PlanService(mongo);
  }

  @Get()
  @JwtAuthGuard()
  async listAllPlans(@Param("projectId") projectId = null) {
    return await this.planService.listPlans(projectId);
  }

  @Get("/:id")
  @JwtAuthGuard()
  async getPlanById(@Param("id") id) {
    return await this.planService.getPlanById(id);
  }

  @Post()
  @JwtAuthGuard()
  async createPlan(@Body() body) {
    return await this.planService.createPlan(body);
  }

  @Put("/:id")
  @JwtAuthGuard()
  async updatePlan(@Param("id") id, @Body() body) {
    return await this.planService.updatePlan(id, body);
  }

  @Delete("/:id")
  @JwtAuthGuard()
  async deletePlan(@Param("id") id) {
    return await this.planService.deletePlan(id);
  }
}

export default createHandler(PlanRouter);
