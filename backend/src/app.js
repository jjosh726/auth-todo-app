import express from "express";
import url, { fileURLToPath } from "url";
import path, { dirname } from "path";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

// serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(dirname(__filename), '..', '..');

app.use(express.static(path.join(__dirname, 'frontend')));

// parse body
app.use(express.json());
app.use(cookieParser());

// CORS controls which frontend origin can call your backend
app.use(cors({
  origin: "http://localhost:" + process.env.PORT,
  credentials: true
}))

// routers
import { errorHandler } from "./middlewares/errorHandler.js";

import userRouter from "./routes/user.route.js";
import taskRouter from "./routes/task.route.js";
import subtaskRouter from "./routes/subtask.route.js";
import listRouter from "./routes/list.route.js";

app.use('/api/v1/auth', userRouter);
app.use('/api/v1/task', taskRouter);
app.use('/api/v1/task/:taskId/subtask', subtaskRouter);
app.use('/api/v1/list', listRouter);

// error handling
app.use(errorHandler);

export default app;