import express from "express";
import url, { fileURLToPath } from "url";
import path, { dirname } from "path";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.join(dirname(__filename), '..', '..');

app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.json());

export default app;