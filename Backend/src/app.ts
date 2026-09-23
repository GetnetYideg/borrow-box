import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import itemRouter from './routes/item.routes.js';
import borrowerRouter from './routes/borrower.routes.js';
import lendingRouter from './routes/lending.routes.js';
import reminderRouter from './routes/reminder.routes.js';
import messageRouter from './routes/message.routes.js';

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : [])
  ],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/item', itemRouter);
app.use('/api/borrower', borrowerRouter);
app.use('/api/lend/', lendingRouter);
app.use('/api/remind/', reminderRouter);
app.use('/api/message/', messageRouter);

export default app;