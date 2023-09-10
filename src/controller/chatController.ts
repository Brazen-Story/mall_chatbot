import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mysql from 'mysql';
import { connection } from '../config/db';
import { getChatCompletion } from '../config/openai'; // 가져옴

export const message = async (req: Request, res: Response): Promise<void> => {

    const message = req.body.message;
    const chatResponse = await getChatCompletion(message);

    if (chatResponse) {
        res.send(chatResponse);
    }

}