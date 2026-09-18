import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import itemRouter from './routes/item.routes.js';
import borrowerRouter from './routes/borrower.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/item', itemRouter);
app.use('/api/borrower', borrowerRouter);

export default app;