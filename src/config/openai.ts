import Configuration from 'openai';
import OpenAIApi from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
  // organization: "org-8Pk1U1HkXMeXWqxaOCjIObsn",
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration as any);

async function getChatCompletion(message: string) {
    const response = await openai.chat.completions.create({
        messages: [{ role: "user", content: message }],
        model: "gpt-4",
    });
    return response.choices[0]?.message?.content;
}

export { getChatCompletion };
