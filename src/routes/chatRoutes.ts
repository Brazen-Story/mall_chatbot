import { Router } from 'express';

import { message } from '../controller/chatController';

export const chatRoutes: Router = Router();

chatRoutes.post('/message', message);
