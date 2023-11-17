import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import { connection } from './config/db';
import { faqRoutes } from './routes/FAQ_Routes';
import { message as generateResponse } from './controller/chatController';  
import { getFaqAnswer } from './controller/FAQ_Controller'; 
import { swaggerUi, specs } from './utill/swagger';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());  // Apply the CORS middleware

const httpServer = http.createServer(app);  // Pass the Express app to the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: "*", // 허용할 origin을 여기에 설정
    methods: ["GET", "POST"]
  }
});

const faq = 'SELECT * FROM chatFaq;';

connection.query(faq, function (error: Error, userResults: string) {
  if (error) throw error;
  console.log('good User');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/faq', faqRoutes);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.send('안녕하세요! MALL BA 챗봇입니다. 제품에 관한 정보와 도움을 제공하기 위해 있습니다. 무엇을 도와드릴까요?');

  socket.on('message', async (msg) => {
    console.log('Received:', msg);
    await generateResponse(msg, socket);
  });

  socket.on('faq-question', async (question) => {
    console.log(question)
    await getFaqAnswer(question, socket);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {  // Make the HTTP server listen on the port
  console.log(`Server running on port ${PORT}`);
});
