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

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());  // Apply the CORS middleware

const httpServer = http.createServer(app);  // Pass the Express app to the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

const faq = 'SELECT * FROM chatFaq;';
connection.query(faq, function (error: Error, userResults: string) {
  if (error) throw error;
  console.log('good User');
});

app.use('/faq', faqRoutes);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

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
