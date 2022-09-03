import { createHandler, Get, Put } from "next-api-decorators";
import JwtAuthGuard from "../../../server/jwtAuthGuard";
import mongo from "../../../server/mongo";

class PlanRouter {
  constructor() {
    this.planService = new PlanService(mongo);
  }

  @Get()
  @JwtAuthGuard()
  async listAllPlans() {
    return await this.planService.listPlans();
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

  @Put()
  @JwtAuthGuard()
  async updatePlan(@Param("id") id, @Body() body) {
    return await this.planService.updatePlan(id, body);
  }

  @Delete()
  @JwtAuthGuard()
  async deletePlan(@Param("id") id) {
    return await this.planService.deletePlan(id);
  }
}

export default createHandler(PlanRouter);
