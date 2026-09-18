import { Router } from "express";
import { createBorrower, getAllBorrowers } from "../controllers/borrower.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";
import { createBorrowerSchema } from "../utils/borrower.validation.js";
import { validateBody } from "../middlewares/validation.middleware.js";

const borrowerRouter = Router();

borrowerRouter.post('/', authenticateToken, validateBody(createBorrowerSchema), createBorrower);
borrowerRouter.get('/', authenticateToken, getAllBorrowers);

export default borrowerRouter;