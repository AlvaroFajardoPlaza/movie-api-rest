import { Router } from "express";
import { methods as userController } from "../controllers/users.controllers";

const userRoutes = Router()

userRoutes.get("/", userController.getAll);
userRoutes.post("/register", userController.register);
userRoutes.post("/login", userController.login)

export default userRoutes;