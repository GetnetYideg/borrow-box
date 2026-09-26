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
    "http://localhost:5173",
    "https://borrow-box-moa24.vercel.app",
    "https://borrow-box-sigma.vercel.app"
  ],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req: express.Request, res: express.Response) => {
  res.json({ status: "ok" });
});

app.use('/api/auth', authRouter);
app.use('/api/item', itemRouter);
app.use('/api/borrower', borrowerRouter);
app.use('/api/lend', lendingRouter);
app.use('/api/remind', reminderRouter);
app.use('/api/message', messageRouter);

export default app;