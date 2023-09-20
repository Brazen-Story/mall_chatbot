import { Router } from 'express';

import { handleIncomingMessage, generateChatResponse, collectionQuestions } from '../controller/chatController';

export const chatRoutes: Router = Router();

chatRoutes.post('/message', handleIncomingMessage);
chatRoutes.get('/message', generateChatResponse);
chatRoutes.get('/question', collectionQuestions);
