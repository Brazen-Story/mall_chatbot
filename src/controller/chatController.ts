import { Request, Response } from 'express';
import { getChatCompletion } from '../config/openai'; // 가져옴
import { redis } from '../config/redis';
import { connection } from '../config/db';
import { MysqlError } from 'mysql';

let latestMessage = '';

export const collectionQuestions = async (req: Request, res: Response): Promise<void> => {
    const query = `SELECT question FROM chatFaq;`;

    connection.query(query, (err: Error, result: any) => {
        if (err) {
            console.error("Database error:", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.json({ questions: result });
    });
}

export const handleIncomingMessage = async (req: Request, res: Response): Promise<void> => {
    latestMessage = req.body.message;

    // 데이터베이스에서 해당 질문에 대한 답변을 찾는 쿼리
    const query = `SELECT answer FROM chatFaq WHERE question = ?;`;

    connection.query(query, [latestMessage], (err: MysqlError | null, result: any) => {
        if (err) {
            res.status(200).send('Message received');
            return;
        }

        // 데이터베이스에서 답변을 찾았다면 해당 답변을 반환합니다.
        if (result.length > 0) {
            res.json({ answer: result[0].answer });
            return;
        }

        res.status(200).send('Message received');

        // 데이터베이스에서 답변을 찾지 못했을 경우, latestMessage 변수에 메시지를 저장합니다.

    });
}

export const generateChatResponse = async (req: Request, res: Response): Promise<void> => {

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const data = await redis.get('myDataSet');
        if (!data) {
            res.write('data: No dataset available from Redis\n\n');
            res.end();
        }

        if (!latestMessage) {
            res.write('data: No message available\n\n');
            res.end();
        }

        const dataString = JSON.stringify(data, null, 2);
        const mentality = '당신은 쇼핑몰 챗봇임을 인지하고, 질문한 사람이 알아듣기 좋게 가독성을 지켜 질문에 대답해주세요.';
        const prompt = `${dataString}\n\n${mentality}\n\n${latestMessage}`;

        const stream = await getChatCompletion(prompt); // 스트림 받기

        for await (const part of stream) {
            const content = part.choices[0]?.delta?.content || '';
            res.write(`data: ${content}\n\n`);
        }

        res.write('data: [DONE]\n\n');
        res.end();
    } catch (err) {
        console.error('Error in generateChatResponse:', err);
        res.write('data: An unexpected error occurred.\n\n');
        res.end();
    }
};
