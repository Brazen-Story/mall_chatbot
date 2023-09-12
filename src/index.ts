// import Configuration from 'openai';
// import OpenAIApi from 'openai';
// import dotenv from 'dotenv';
// import express, { response } from 'express';
// import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';

// import { connection } from './config/db';
// import extractJWT from './middleware/extractJWT';

// dotenv.config();

// const app = express();

// const configuration = new Configuration({
//   // organization: "org-8Pk1U1HkXMeXWqxaOCjIObsn",
//   apiKey: process.env.API_KEY,
// });

// const openai = new OpenAIApi(configuration as any);

// app.use(bodyParser.json());
// // app.use(cors({
// //   origin: '*',
// //   credentials: true,
// //   methods: ['GET', 'POST'],
// //   allowedHeaders: ['Content-Type', 'Authorization']
// // }));

// app.use(express.json());
// app.use(cookieParser() as express.RequestHandler); // Specify type as express.RequestHandler

// let latestMessage = ''; // Shared variable to store the latest message

// app.post('/message', async (req, res) => {
//   try {
//     latestMessage = req.body.message; // Store the incoming message
//     console.log('message')
//     res.status(200).send('Message received');
//   } catch (err) {
//     console.log(err);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.get('/getchat', async (req, res) => {
//   try {
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Access-Control-Allow-Origin', '*'); // This should be restricted in production
//     res.setHeader('Connection', 'keep-alive');
//     res.flushHeaders(); // flush the headers to establish SSE with client

//     if (!latestMessage) {
//       res.write('data: No message available\n\n');
//       return res.end();
//     }

//     const stream = await openai.chat.completions.create({
//       model: 'gpt-4',
//       messages: [{ role: 'user', content: latestMessage }],
//       stream: true,
//     });

//     for await (const part of stream) {
//       const content = part.choices[0]?.delta?.content || '';
//       process.stdout.write(content); // Print to the server console
//       res.write(`data: ${content}\n\n`); // Send data continuously to the client
//     }

//     process.stdout.write('\n');
//     res.write('data: [DONE]\n\n');
//     res.end(); // End the response
//   } catch (err) {
//     console.log(err);
//     res.status(500).send('Internal Server Error');
//   }
// });



// app.listen(process.env.PORT, () => {
//   console.log('server running..')
// })



// // app.get('/getchat', async (req, res) => {

// //   res.setHeader('Cache-Control', 'no-cache');
// //   res.setHeader('Content-Type', 'text/event-stream');
// //   res.setHeader('Access-Control-Allow-Origin', '*');
// //   res.setHeader('Connection', 'keep-alive');
// //   res.flushHeaders(); // flush the headers to establish SSE with client

// //   console.log(latestMessage)
// //   try {
// //     const stream = await openai.chat.completions.create({
// //       model: 'gpt-4',
// //       messages: [{ role: 'user', content: latestMessage }],
// //       stream: true,
// //     });

// //     // let completeMessage = '';
// //     for await (const part of stream) {
// //       const content = part.choices[0]?.delta?.content || '';
// //       // completeMessage += content;

// //       // Print to the server console
// //       process.stdout.write(content);

// //       // Send data continuously to the client
// //       res.write(`data: ${content}\n\n`);
// //     }
// //     process.stdout.write('\n');
// //     res.write('data: [DONE]\n\n');
// //     res.end(); // End the response
// //   } catch (err) {
// //     console.log(err);
// //     res.status(500).send('Internal Server Error');
// //   }
// // });


// // const chat = 'SELECT * FROM chat';

// // connection.query(chat, function (error: Error, userResults: string) {
// //   if (error) throw error;
// // });

import Configuration from 'openai';
import OpenAIApi from 'openai';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();

const app = express();

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration as any);

app.use(cors({
  origin: 'http://localhost:3000',  // 특정 origin을 허용
  methods: ['GET', 'POST', 'OPTIONS'],  // OPTIONS 메서드 추가
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

let latestMessage = '';

app.post('/message', async (req, res, next) => {
  console.log('POST /message endpoint hit'); // 로그 추가
  try {
    latestMessage = req.body.message;
    res.status(200).send('Message received');
  } catch (err) {
    next(err);
  }
});

const headers = {
  "Content-Type": "text/event-stream",
  Connection: "keep-alive",
  "Cache-Control": "no-cache",
};



app.get('/getchat', async (req, res, next) => {
  console.log('GET /getchat endpoint hit'); // 로그 추가
    try {
      res.setHeader('Content-Type', 'text/event-stream');  // 강제로 헤더 설정
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
  
      if (!latestMessage) {
        res.write('data: No message available\n\n');
        return res.end();
      }

    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: latestMessage }],
      stream: true,
    });

    for await (const part of stream) {
      const content = part.choices[0]?.delta?.content || '';
      res.write(`data: ${content}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Error in /getchat:', err); // 에러 로그 추가
    next(err);
  }
});


// Error handling middleware
// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);

  // Check if the request is an SSE request
  if (req.headers.accept === 'text/event-stream') {
    res.writeHead(500, headers); // Use the SSE headers
    res.write('data: An error occurred on the server.\n\n');
    return res.end();
  }

  res.status(500).send('Something broke!');
});


app.listen(process.env.PORT, () => {
  console.log('server running..')
});
