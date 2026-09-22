import { Router } from "express";
import { generateMessage } from "../controllers/message.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const messageRouter = Router();

messageRouter.get('/:id', authenticateToken, generateMessage);

export default messageRouter;