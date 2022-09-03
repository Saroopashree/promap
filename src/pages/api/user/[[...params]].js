import {
  Get,
  Post,
  Body,
  createHandler,
  Param,
  NotFoundException,
} from "next-api-decorators";
import JwtAuthGuard from "../../../server/jwtAuthGuard";
import mongo from "../../../server/mongo";
import UserService from "../../../server/userService";

class UserRouter {
  constructor() {
    this.userService = new UserService(mongo);
  }

  @Get()
  @JwtAuthGuard()
  async list() {
    return await this.userService.listUsers();
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
