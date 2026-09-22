import { Router } from "express";
import { createBorrower, deleteBorrower, getAllBorrowers, searchBorrower } from "../controllers/borrower.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";
import { createBorrowerSchema } from "../utils/borrower.validation.js";
import { validateBody } from "../middlewares/validation.middleware.js";

const borrowerRouter = Router();

borrowerRouter.post('/', authenticateToken, validateBody(createBorrowerSchema), createBorrower);
borrowerRouter.get('/', authenticateToken, getAllBorrowers);
borrowerRouter.get('/:id', authenticateToken, searchBorrower);
borrowerRouter.delete('/:id', authenticateToken, deleteBorrower);

export default borrowerRouter;