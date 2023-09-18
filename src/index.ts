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

//redis에 dataSet 저장 후 redis 정보를 가져와서 prompt 작성.

import Configuration from 'openai';
import OpenAIApi from 'openai';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createDataSet } from './config/db';
import  { redis }  from './config/redis';
import './config/redis';  // redis.ts 파일을 import

// import data from './dataSet.json';

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

// createDataSet().catch(error => {
//   console.error('Error creating dataset:', error);
// });

// 데이터셋을 Redis에 저장하고 주기적으로 갱신하는 함수
// async function refreshDataSetPeriodically() {
//   try {
//     const dataSet = await createDataSet();
//     await redis.set('myDataSet', JSON.stringify(dataSet));

//     // 1시간 후에 만료되도록 설정 (선택적)
//     await redis.expire('myDataSet', 3600);
//   } catch (error) {
//     console.error('Error creating dataset:', error);
//   }
// }

// // 1시간마다 데이터셋 갱신
// setInterval(refreshDataSetPeriodically, 3600 * 1000);

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
      const data = await redis.get('myDataSet');
      // console.log(data)
      if (!data) {
        res.write('data: No dataset available from Redis\n\n');
        return res.end();
      }

      if (!latestMessage) {
        res.write('data: No message available\n\n');
        return res.end();
      }

      const dataString = JSON.stringify(data, null, 2);
      const mentality = '당신은 쇼핑몰 챗봇임을 인지하고, 질문한 사람이 알아듣기 좋게 가독성을 지켜 질문에 대답해주세요.'
      const prompt = `${dataString}\n\n${mentality}\n\n${latestMessage}`;

      const stream = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        temperature: 0,
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