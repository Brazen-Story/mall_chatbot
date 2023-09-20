import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import './config/redis';  // redis.ts 파일을 import
import { chatRoutes } from './routes/chatRoutes';
import { connection } from './config/db';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

const chat = 'SELECT * FROM chatFaq;';

connection.query(chat, function (error: Error, userResults: string) {
  if (error) throw error;
  console.log('good User');
});

app.use('/chat', chatRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});