import Configuration from 'openai';
import OpenAIApi from 'openai';
import dotenv from 'dotenv';
import express, { response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connection } from './config/db';
import extractJWT from './middleware/extractJWT';

dotenv.config();

const app = express();

const configuration = new Configuration({
  // organization: "org-8Pk1U1HkXMeXWqxaOCjIObsn",
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration as any);

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(cookieParser() as express.RequestHandler); // Specify type as express.RequestHandler

app.post('/chat',extractJWT, async  (req, res) => {
  const message = req.body.message;
  const response = await openai.chat.completions.create({
    messages: [{ role: "user", content: message }],
    model: "gpt-4",
  })

  if(response.choices[0].message.content){
    res.send(response.choices[0].message.content)
  }
})

const chat = 'SELECT * FROM chat';

connection.query(chat, function (error: Error, userResults: string) {
  if (error) throw error;
});


app.listen(process.env.PORT, () => {
  console.log('server running..')
})
