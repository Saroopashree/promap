import ProjectService from "./projectService";

class TaskService {
  #client;
  #projectService;

  constructor(mongoClient) {
    this.#client = mongoClient;
    this.#projectService = new ProjectService(mongoClient);
  }

  #collection() {
    return this.#client.db("promap").collection("tasks");
  }

  async createTask(task) {
    if (
      task.name === undefined ||
      task.name === "" ||
      task.assignee === undefined ||
      task.assignee === "" ||
      task.projectId === undefined ||
      task.projectId === ""
    ) {
      throw new BadRequestException();
    }

    const taskKey = await this.#projectService.getNextTaskKey(task.projectId);
    const defaultStatus = await this.#projectService.getDefaultStatus(
      task.projectId
    );
    await this.#collection().insertOne({
      ...task,
      key: taskKey,
      status: defaultStatus,
    });
    return this.getTaskByKey(taskKey);
  }

  async listTasks(projectId, plans = null) {
    const query = { projectId };
    if (plans !== null) {
      query.plan = { $in: plans };
    }

    const results = await this.#collection().find(query).toArray();
    return results.map((task) => {
      delete task._id;
      return task;
    });
  }

  async getTaskByKey(taskKey) {
    const result = await this.#collection().findOne({ key: taskKey });
    if (result === null) return null;

    delete result._id;
    return result;
  }

  async updateTask(taskKey, task) {
    if (
      task.name === undefined ||
      task.name === "" ||
      task.assignee === undefined ||
      task.assignee === "" ||
      task.projectId === undefined ||
      task.projectId === ""
    ) {
      throw new BadRequestException();
    }

    await this.#collection().findOneAndUpdate(
      { key: taskKey },
      { $set: task },
      { returnOriginal: false }
    );
    return this.getTaskByKey(taskKey);
  }

  async changeTaskStatus(taskKey, status) {
    await this.#collection().findOneAndUpdate(
      { key: taskKey },
      { $set: { status } },
      { returnOriginal: false }
    );
    return this.getTaskByKey(taskKey);
  }

  async deleteTask(taskKey) {
    return await this.#collection().findOneAndDelete({ key: taskKey });
  }
}

export default TaskService;
