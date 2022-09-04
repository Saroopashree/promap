import { ObjectId } from "mongodb";
import { BadRequestException } from "next-api-decorators";

class ProjectService {
  #client;

  constructor(mongoClient) {
    this.#client = mongoClient;
  }

  #collection() {
    return this.#client.db("promap").collection("projects");
  }

  async createProject(project) {
    if (
      project.name === undefined ||
      project.tag === "" ||
      project.lead === ""
    ) {
      throw new BadRequestException();
    }
    const result = await this.#collection().insertOne({
      definitions: [
        { name: "To Do", default: true, order: 1 },
        { name: "In Progress", order: 2 },
        { name: "Done", order: 3, final: true },
      ],
      ...project,
      nextTaskId: 1,
    });
    return this.getProjectById(result.insertedId);
  }

  async listProjects() {
    const results = await this.#collection().find({}).toArray();
    return results.map((proj) => {
      const id = proj._id;
      delete proj._id;
      return { id, ...proj };
    });
  }

  async getProjectById(projectId) {
    const result = await this.#collection().findOne({
      _id: new ObjectId(projectId),
    });
    if (result === null) return null;

    const id = result._id;
    delete result._id;
    return { id, ...result };
  }

  async getNextTaskKey(projectId) {
    const project = await this.getProjectById(projectId);
    if (project === null) return new NotFoundException("");

    await this.#collection().findOneAndUpdate(
      { _id: new ObjectId(projectId) },
      { $inc: { nextTaskId: 1 } }
    );

    return `${project.tag}-${project.nextTaskId}`;
  }

  async getDefaultStatus(projectId) {
    const project = await this.getProjectById(projectId);
    if (project === null) return new NotFoundException("");

    const cursor = await this.#collection().aggregate(
      [
        { $match: { _id: ObjectId(projectId) } },
        { $unwind: "$definitions" },
        { $match: { "definitions.default": true } },
        { $project: { _id: 0, "definitions.name": 1 } },
      ],
      { cursor: { batchSize: 1 } }
    );

    const result = await cursor.toArray();
    return result[0].definitions.name;
  }

  async deleteProject(projectId) {
    return await this.#collection().deleteOne({ _id: new ObjectId(projectId) });
  }
}

export default ProjectService;
