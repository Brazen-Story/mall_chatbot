import { Router } from 'express';
import extractJWT from '../middleware/extractJWT';

import { message } from '../controller/chatController';

export const chatRoutes: Router = Router();


// chatRoutes.post('/chat', extractJWT, message);
chatRoutes.post('/chat', message);