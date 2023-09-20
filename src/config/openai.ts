import Configuration from 'openai';
import OpenAIApi, { APIError } from 'openai'; // APIError import 추가
import dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration as any);

async function getChatCompletion(message: string) {
    try {
        const stream = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: message }],
            stream: true,
            temperature: 0,
        });

        return stream; // 스트림을 직접 반환
    } catch (err) {
        if (err instanceof APIError) {
            console.error('APIError:', err.status, err.name);
            throw new Error('An error occurred while fetching data from OpenAI.');
        } else {
            throw err;
        }
    }
}


export { getChatCompletion };