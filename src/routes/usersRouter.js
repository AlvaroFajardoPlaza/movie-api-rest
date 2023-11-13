import { Router } from 'express';
import { methods as userController } from '../controllers/usersController';

const userRoutes = Router();

userRoutes.get('/', userController.getAll);
userRoutes.post('/register', userController.register);
userRoutes.post('/login', userController.login);
userRoutes.post('/me', userController.me);

export default userRoutes;
