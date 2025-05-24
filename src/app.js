import dotenv from 'dotenv'
import express from 'express';
import cors from "cors";
import fs from 'fs';
import path from 'path';

dotenv.config()

import './models/association.js';
import router from './routes/router.js';

const app = express();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log(`Pasta "uploads" criada em ${uploadDir}`);
}

app.use(cors())

app.use(express.json());
app.use(router);

app.listen(3000, () => {
  console.log('O servidor está escutando na porta 3000.');
})