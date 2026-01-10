import express from "express";
import url, { fileURLToPath } from "url";
import path, { dirname } from "path";

const app = express();

// serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(dirname(__filename), '..', '..');

app.use(express.static(path.join(__dirname, 'frontend')));

// parse body
app.use(express.json());

// routers
import { errorHandler } from "./middlewares/errorHandler.js";

import userRouter from "./routes/user.route.js";
import taskRouter from "./routes/task.route.js";

app.use('/api/v1/auth', userRouter);
app.use('/api/v1/task', taskRouter);

// error handling
app.use(errorHandler);

export default app;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTViNTM0ZWMzOGQwZmMwMjcxMTA2NjYiLCJpYXQiOjE3NjgwNjY2OTcsImV4cCI6MTc2ODA3MDI5N30.ncshR_c_M4qDP-SFhigyAXR0IV5iH6qhCHpexj8_rC4