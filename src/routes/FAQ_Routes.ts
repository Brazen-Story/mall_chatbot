import { Router } from 'express';

import { FaqQuestion, FaqAnswer } from '../controller/FAQ_Controller';

export const faqRoutes: Router = Router();

faqRoutes.get('/question', FaqQuestion);
faqRoutes.post('/answer', FaqAnswer);
