import { createMiddlewareDecorator } from "next-api-decorators";
import mongo from "./mongo";
import UserService from "./userService";

const JwtAuthGuard = createMiddlewareDecorator((req, res, next) => {
  const authService = new UserService(mongo);
  if (authService.authenticateToken(req.headers["authorization"])) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

export default JwtAuthGuard;
