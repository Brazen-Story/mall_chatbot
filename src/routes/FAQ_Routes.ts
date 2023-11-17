import { Router } from 'express';

import { FaqQuestion } from '../controller/FAQ_Controller';

export const faqRoutes: Router = Router();

/**
 * @swagger
 * /faq/question:
 *  get:
 *    summary: Retrieve FAQ Questions
 *    tags:
 *      - FAQ
 *    description: Fetches a list of FAQ questions.
 *    responses:
 *      200:
 *        description: A successful response containing an array of FAQ questions.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                questions:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      question:
 *                        type: string
 *                        description: The FAQ question text.
 *                  example:
 *                    - question: '카테고리는 어디에 있나요?'
 *                    - question: '로그인은 어디서 하나요?'
 *                    - question: '상품을 정렬하여 볼 수 있나요?'
 *                    - question: '당일 출고는 몇시까지 인가요?'
 *                    - question: '주문금액과 다른금액을 입금했어요.'
 *        headers:
 *          content-type:
 *            type: string
 *            example: 'application/json; charset=utf-8'
 *          content-length:
 *            type: string
 *            example: '294'
 *        status:
 *          type: integer
 *          example: 200
 *        statusText:
 *          type: string
 *          example: 'OK'
 */
faqRoutes.get('/question', FaqQuestion);
