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
import userRouter from "./routes/user.route.js";

app.use('/api/v1/users', userRouter);

// error handling

export default app;