// import Configuration from 'openai';
// import OpenAIApi, { APIError } from 'openai'; // APIError import 추가
// import dotenv from 'dotenv';

// dotenv.config();

// const configuration = new Configuration({
//   // organization: "org-8Pk1U1HkXMeXWqxaOCjIObsn",
//   apiKey: process.env.API_KEY,
// });

// const openai = new OpenAIApi(configuration as any);

// async function getChatCompletion(message: string) {
//     try {
//         const response = await openai.chat.completions.create({
//             messages: [{ role: "user", content: message }],
//             model: "gpt-4",
//         });
//         return response.choices[0]?.message?.content;
//     } catch (err) {
//         if (err instanceof APIError) {
//             console.log(err.status); // e.g. 400
//             console.log(err.name);   // e.g. BadRequestError
//             console.log(err.headers); // e.g. {server: 'nginx', ...}
//         } else {
//             throw err;  // 다른 유형의 에러가 발생하면 외부로 에러를 던진다.
//         }
//     }
// }

// export { getChatCompletion };


// import Configuration from 'openai';
// import OpenAIApi, { APIError } from 'openai'; // APIError import 추가
// import { Stream } from 'openai-streams'; // openai-streams 패키지에서 Stream 가져오기
// import dotenv from 'dotenv';

// dotenv.config();

// const configuration = new Configuration({
//   apiKey: process.env.API_KEY,
// });

// const openai = new OpenAIApi(configuration as any);

// async function getChatCompletionWithStreaming(message: string) {
//     try {
//         const response = await openai.chat.completions.create({
//             messages: [{ role: "user", content: message }],
//             model: "gpt-4",
//             stream: true, // 스트리밍 활성화
//         });

//         const stream = new Stream(response); // openai-streams에서 제공하는 Stream 사용
//         let finalResponse = '';

//         for await (const part of stream) {
//             finalResponse += part.choices[0]?.message?.content || '';
//         }

//         return finalResponse;

//     } catch (err) {
//         console.error(err);
//         throw err;
//     }
// }

// export { getChatCompletionWithStreaming }

// import { OpenAI } from 'openai-streams'; 
// import dotenv from 'dotenv';

// dotenv.config();

// async function getChatCompletionWithStreaming(message: string) {
//     try {
//         const stream = await OpenAI(
//             "chat",
//             {
//                 model: "gpt-4",
//                 messages: [{ role: "user", content: message }],
//             },
//             {
//                 apiKey: process.env.API_KEY, 
//                 mode: "raw" // raw 이벤트에 접근하려면 사용합니다.
//             }
//         );

//         let finalResponse = '';
//         for await (const part of stream) {
//             finalResponse += part.choices[0]?.message?.content || '';
//         }

//         return finalResponse;

//     } catch (err) {
//         console.error(err);
//         throw err;
//     }
// }

// export { getChatCompletionWithStreaming }

// import fetch from 'node-fetch';
// import { Readable } from 'stream';
// import { OpenAI } from 'openai-streams';
// import dotenv from 'dotenv';

// dotenv.config();

// // ReadableStream to Node.js Readable
// function readableStreamToNodeReadable(rs: ReadableStream): Readable {
//   const reader = rs.getReader();
//   return new Readable({
//     async read() {
//       const { done, value } = await reader.read();
//       if (done) {
//         this.push(null);
//       } else {
//         this.push(value);
//       }
//     }
//   });
// }

// async function getChatCompletionWithStreaming(message: string) {
//     try {
//         const webStream = await OpenAI(
//             "chat",
//             {
//                 model: "gpt-4",
//                 messages: [{ role: "user", content: message }],
//             },
//             {
//                 apiKey: process.env.API_KEY, 
//                 mode: "raw"
//             }
//         );

//         const nodeStream = readableStreamToNodeReadable(webStream);

//         let finalResponse = '';
//         for await (const part of nodeStream) {
//             // Process the part here
//             // ... 
//             finalResponse += part; // Adjust this as needed
//         }

//         return finalResponse;

//     } catch (err) {
//         console.error(err);
//         throw err;
//     }
// }

// export { getChatCompletionWithStreaming }

import OpenAI from 'openai';

// gets API Key from environment variable OPENAI_API_KEY
const openai = new OpenAI();

async function main() {
  // Non-streaming:
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: 'Say this is a test' }],
  });
  console.log(completion.choices[0]?.message?.content);

  // Streaming:
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: 'Say this is a test' }],
    stream: true,
  });
  for await (const part of stream) {
    process.stdout.write(part.choices[0]?.delta?.content || '');
  }
  process.stdout.write('\n');
}

main();