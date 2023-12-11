import { connection } from '../config/db';
import { MysqlError } from 'mysql';
import { Request, Response } from 'express';
import { Socket } from 'socket.io'; 

export const FaqQuestion = async (req: Request, res: Response): Promise<void> => {

    const query = `SELECT question FROM chatFaq;`;

    connection.query(query, (err: Error, result: FaqQuestion[]) => {
        if (err) {
            console.error("Database error:", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.json({ questions: result });
    });
};

export const getFaqAnswer = async (question: string, socket: Socket): Promise<void> => {
    // 질문에 대한 답변과 이미지를 함께 조회하는 쿼리
    const query = `
        SELECT answer, image_1, image_2 
        FROM chatFaq 
        WHERE question = ?;
    `;

    connection.query(query, [question], (err: MysqlError | null, result: FaqAnswer[]) => {
        if (err) {
            console.error('에러 발생:', err);
            socket.emit('error', { error: 'An error occurred while retrieving the answer.' });
            return;
        }

        if (result.length > 0) {
            const response = {
                answer: result[0].answer,
                images: [] as string[]
            };
        
            if (result[0].image_1) {
                response.images.push(result[0].image_1);
            }
            if (result[0].image_2) {
                response.images.push(result[0].image_2);
            }

            console.log(result)

            socket.emit('faq-answer', response);
        } else {
            socket.emit('error', { error: 'No answer found for the given question.' });
        }
    });
};