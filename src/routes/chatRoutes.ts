import { Router } from 'express';
import extractJWT from '../middleware/extractJWT';

import { message, getchat } from '../controller/chatController';

export const chatRoutes: Router = Router();


// chatRoutes.post('/chat', extractJWT, message);
chatRoutes.post('/chat', message);
chatRoutes.get('/getchat', getchat);