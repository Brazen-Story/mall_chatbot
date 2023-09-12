// import Configuration from 'openai';
// import OpenAIApi, { APIError } from 'openai'; // APIError import 추가
// import dotenv from 'dotenv';

// dotenv.config();

// const configuration = new Configuration({
//   // organization: "org-8Pk1U1HkXMeXWqxaOCjIObsn",
//   apiKey: process.env.API_KEY,
// });
// const openai = new OpenAIApi(configuration as any);

// // gets API Key from environment variable OPENAI_API_KEY

// async function getChatCompletion(message: string) {
//   // Streaming:
//   try {
  //   const stream = await openai.chat.completions.create({
  //     model: 'gpt-4',
  //     messages: [{ role: 'user', content: message }],
  //     stream: true,
  //   });
  //   for await (const part of stream) {
  //     return process.stdout.write(part.choices[0]?.delta?.content || '');
  //   }
  //   process.stdout.write('\n');
  // }
//   catch (err) {
//     if (err instanceof APIError) {
//       console.log(err.status); // e.g. 400
//       console.log(err.name);   // e.g. BadRequestError
//       console.log(err.headers); // e.g. {server: 'nginx', ...}
//     } else {
//       throw err;  // 다른 유형의 에러가 발생하면 외부로 에러를 던진다.
//     }
//   }
// }

// export { getChatCompletion }


