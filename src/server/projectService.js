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
    const result = await this.#collection().insertOne(project);
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

  async deleteProject(projectId) {
    return await this.#collection().deleteOne({ _id: new ObjectId(projectId) });
  }
}

export default ProjectService;
