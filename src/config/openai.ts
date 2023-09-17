import Configuration from 'openai';
import OpenAIApi, { APIError } from 'openai'; // APIError import 추가
import dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
  // organization: "org-8Pk1U1HkXMeXWqxaOCjIObsn",
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration as any);

// gets API Key from environment variable OPENAI_API_KEY

async function getChatCompletion(message: string, res: any) {
    try {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: message }],
        stream: true,
      });
      for await (const part of stream) {
        const content = part.choices[0]?.delta?.content || '';
        res.write(`data: ${content}\n\n`);
      }
      res.write('data: [DONE]\n\n');
      res.end();
    }
    catch (err) {
      if (err instanceof APIError) {
        console.log(err.status);
        console.log(err.name);
        console.log(err.headers);
        res.write('data: An error occurred while fetching data from OpenAI.\n\n');
        res.end();
      } else {
        throw err;
      }
    }
  }
  
  export { getChatCompletion };