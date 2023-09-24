import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { connection } from './config/db';
import { faqRoutes } from './routes/FAQ_Routes';
import { chatRoutes } from './routes/chatRoutes';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

const faq = 'SELECT * FROM chatFaq;';

connection.query(faq, function (error: Error, userResults: string) {
  if (error) throw error;
  console.log('good User');
});

app.use('/faq', faqRoutes);
app.use('/chat', chatRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});