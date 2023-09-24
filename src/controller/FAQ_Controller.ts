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

export const FaqAnswer = async (req: Request, res: Response): Promise<void> => {

    const question = req.body.message;

    const query = `SELECT answer FROM chatFaq WHERE question = ?;`;

    connection.query(query, [question], (err: MysqlError | null, result: any) => {
        if (result.length > 0) {
            res.status(200).json({ answer: result[0].answer });
        } else {
            res.status(404).send('No answer found for the given question.');
        }
    });
};