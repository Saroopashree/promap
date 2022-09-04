import { ObjectId } from "mongodb";

class PlanService {
  #client;
  constructor(mongoClient) {
    this.#client = mongoClient;
  }

  #collection() {
    return this.#client.db("promap").collection("plans");
  }

  #validatePayload(plan) {
    if (
      plan.name === undefined ||
      plan.name === "" ||
      plan.reporter === undefined ||
      plan.reporter === "" ||
      plan.projectId === undefined ||
      plan.projectId === ""
    ) {
      throw new BadRequestException();
    }

    if (plan.color === undefined || /^#[0-9A-F]{6}$/i.test(plan.color)) {
      plan.color = "#00D084";
    }
    return plan;
  }

  async createPlan(plan) {
    plan = this.#validatePayload(plan);
    const result = await this.#collection().insertOne({
      ...plan,
      nextTaskId: 1,
    });
    return this.getPlanById(result.insertedId);
  }

  async listPlans(projectId) {
    const query = projectId ? { projectId: projectId } : {};
    const results = await this.#collection().find(query).toArray();
    return results.map((plan) => {
      const id = plan._id;
      delete plan._id;
      return { id, ...plan };
    });
  }

  async getPlanById(planId) {
    const result = await this.#collection().findOne({
      _id: new ObjectId(planId),
    });
    if (result === null) return null;

    const id = result._id;
    delete result._id;
    return { id, ...result };
  }

  async updatePlan(planId, plan) {
    plan = this.#validatePayload(plan);
    await this.#collection().updateOne(
      { _id: new ObjectId(planId) },
      { $set: plan }
    );
    return this.getPlanById(planId);
  }

  async deletePlan(planId) {
    return await this.#collection().deleteOne({ _id: new ObjectId(planId) });
  }
}

export default PlanService;
