import { connection } from '../config/db';
import { MysqlError } from 'mysql';
import { Request, Response } from 'express';

export const FaqQuestion = async (req: Request, res: Response): Promise<void> => {

    const query = `SELECT question FROM chatFaq;`;

    connection.query(query, (err: Error, result: any) => {
        if (err) {
            console.error("Database error:", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.json({ questions: result });
    });
};

export const getFaqAnswer = async (question: string, socket: any): Promise<void> => {
    const query = `SELECT answer FROM chatFaq WHERE question = ?;`;

    connection.query(query, [question], (err: MysqlError | null, result: any) => {
        if (result.length > 0) {
            console.log('완료')
            socket.emit('faq-answer', { answer: result[0].answer });
        } else {
            console.log('어?')
            socket.emit('error', { error: 'No answer found for the given question.' });
        }
    });
};