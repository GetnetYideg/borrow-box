import { Router } from "express";
import { reminder } from "../controllers/reminder.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const reminderRouter = Router()

reminderRouter.get('/:id', authenticateToken, reminder);

export default reminderRouter;