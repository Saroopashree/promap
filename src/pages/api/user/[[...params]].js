import {
  Get,
  Post,
  Body,
  createHandler,
  Param,
  NotFoundException,
  Req,
  Header,
} from "next-api-decorators";
import hop from "../../../server/hop";
import JwtAuthGuard from "../../../server/jwtAuthGuard";
import mongo from "../../../server/mongo";
import UserService from "../../../server/userService";

const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

class UserRouter {
  constructor() {
    this.userService = new UserService(mongo, hop);
  }

  @Get()
  @JwtAuthGuard()
  async list(@Header("authorization") authHeader) {
    const token = authHeader.split(" ")[1];
    const context = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return await this.userService.listUsers(context.email);
  }

  @Get("/:id")
  @JwtAuthGuard()
  async getUserById(@Param("id") id) {
    return await this.userService.getUserById(id);
  }

  @Post("/login")
  async login(@Body() body) {
    const { email, password } = body;
    const user = await this.userService.login(email, password);
    if (user === false) {
      throw new NotFoundException("No such user");
    }
    return user;
  }

  @Post("/signup")
  async signup(@Body() body) {
    const { email, username, password } = body;
    return await this.userService.signup(email, username, password);
  }
}

export default createHandler(UserRouter);
