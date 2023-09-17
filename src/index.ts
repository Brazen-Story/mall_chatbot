// app.use(bodyParser.json());
// // app.use(cors({
// //   origin: '*',
// //   credentials: true,
// //   methods: ['GET', 'POST'],
// //   allowedHeaders: ['Content-Type', 'Authorization']
// // }));

// app.use((err: any, req: any, res: any, next: any) => {
//   console.error('Error occurred:', err);
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.write('data: An error occurred\n\n');
//   res.end();
// });


import Configuration from 'openai';
import OpenAIApi from 'openai';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createDataSet } from './config/db';

import data from './dataSet.json';

dotenv.config();

const app = express();

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration as any);

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

createDataSet().catch(error => {
  console.error('Error creating dataset:', error);
});

let latestMessage = '';

app.post('/message', async (req, res) => {
  console.log('POST /message endpoint hit with body:', req.body);

  const predefinedAnswers: { [key: string]: string } = {
    '김동건는 얼마인가요?': '1똥꼬야.',
    '이대준는 얼마인가요?': '2똥꼬야.',
    '이병선는 얼마인가요?': '3똥꼬야.',
  };

  if (predefinedAnswers[req.body.message]) {
    console.log('Sending predefined answer:', predefinedAnswers[req.body.message]);
    return res.json({ message: predefinedAnswers[req.body.message] });
  }

  try {
    latestMessage = req.body.message;
    res.status(200).send('Message received');
  } catch (err) {
    console.error('Error in POST /message:', err);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/getchat', async (req, res) => {
  console.log('GET /getchat endpoint accessed');

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      if (!latestMessage) {
        res.write('data: No message available\n\n');
        return res.end();
      }

      const dataString = JSON.stringify(data, null, 2);
      const prompt = `${dataString}\n\n${latestMessage}`;

      const stream = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
      });

      for await (const part of stream) {
        const content = part.choices[0]?.delta?.content || '';
        res.write(`data: ${content}\n\n`);
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (err) {
      console.error('Error in /getchat:', err);
      res.write('data: An error occurred while fetching data from OpenAI.\n\n');
      return res.end();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});