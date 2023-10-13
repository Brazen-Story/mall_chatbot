import { Router } from 'express';

import { FaqQuestion } from '../controller/FAQ_Controller';

export const faqRoutes: Router = Router();

faqRoutes.get('/question', FaqQuestion);
