import { Request, Response } from 'express';
import { getChatCompletion } from '../config/openai'; // 가져옴

let latestMessage = '';

export const message = async (req: Request, res: Response): Promise<void> => {

    console.log('POST /message endpoint hit with body:', req.body);

    const predefinedAnswers: { [key: string]: string } = {
        '김동건는 얼마인가요?': '1똥꼬야.',
        '이대준는 얼마인가요?': '2똥꼬야.',
        '이병선는 얼마인가요?': '3똥꼬야.',
    };

    if (predefinedAnswers[req.body.message]) {
        console.log('Sending predefined answer:', predefinedAnswers[req.body.message]);
        res.json({ message: predefinedAnswers[req.body.message] });
    }

    try {
        latestMessage = req.body.message;
        res.status(200).send('Message received');
    } catch (err) {
        console.error('Error in POST /message:', err);
        res.status(500).send('Internal Server Error');
    }
}


export const getchat = async (req: Request, res: Response): Promise<void> => {
    console.log('GET /getchat endpoint accessed');

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        if (!latestMessage) {
            res.write('data: No message available\n\n');
            res.end();
            return;
        }
        await getChatCompletion(latestMessage, res);
    } catch (err) {
        console.error('Error in /getchat:', err);
        res.write('data: An unexpected error occurred.\n\n');
        res.end();
    }
}