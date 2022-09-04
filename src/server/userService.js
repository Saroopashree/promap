import ChannelService from "./channelService";

const dotenv = require("dotenv");
const { scryptSync, randomBytes, timingSafeEqual } = require("crypto");
const jwt = require("jsonwebtoken");

dotenv.config();

class UserService {
  #client;
  #channelService;

  constructor(mongoClient, hop) {
    this.#client = mongoClient;
    this.#channelService = new ChannelService(mongoClient, hop);
  }

  #collection() {
    return this.#client.db("promap").collection("users");
  }

  async signup(email, username, password) {
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = scryptSync(password, salt, 64).toString("hex");

    const users = this.#collection();
    const user = { email, username, password: hashedPassword, salt };
    await users.insertOne(user);

    const domain = email.split("@")[1];
    await this.#channelService.createCommunicationChannel(domain);

    return this.login(email, password);
  }

  async login(email, password) {
    const users = this.#collection();
    const user = await users.findOne({ email });

    if (user === null) {
      return false;
    }

    const hashedPassword = scryptSync(password, user.salt, 64).toString("hex");
    if (
      timingSafeEqual(Buffer.from(hashedPassword), Buffer.from(user.password))
    ) {
      const domain = email.split("@")[1];
      const channel = await this.#channelService.getCommunicationChannel(
        domain
      );

      const userView = {
        id: user._id,
        email: user.email,
        username: user.username,
        channelId: channel?.channelId,
      };

      return {
        ...userView,
        token: this.generateAccessToken(userView),
      };
    } else {
      return null;
    }
  }

  generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30m",
    });
  }

  authenticateToken(authHeader) {
    if (!authHeader) return false;

    const [, token] = authHeader.split(" ");
    if (!token || token === "") {
      return false;
    }

    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return true;
    } catch (err) {
      return false;
    }
  }

  async listUsers(email) {
    const users = this.#collection();

    const domain = email.split("@")[1];
    const result = await users
      .find({ email: { $regex: `.*${domain}.*`, $options: "i" } })
      .toArray();

    return result.map((user) => ({
      id: user._id,
      email: user.email,
      username: user.username,
    }));
  }

  async getUserById(id) {
    const users = this.#collection();
    const result = await users.findOne({ _id: id });
    return result
      ? { id: result._id, email: result.email, username: result.username }
      : null;
  }

  async getCommunicationChannel(userId) {
    const currUser = this.getUserById(userId);
    const domain = (await currUser).email.split("@")[1];
    return await this.#channelService.getCommunicationChannel(domain);
  }
}

export default UserService;
