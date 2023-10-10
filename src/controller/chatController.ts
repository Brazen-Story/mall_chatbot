// import { Request, Response } from 'express';
// import { OpenAI } from "langchain/llms/openai";
// import { SqlDatabase } from "langchain/sql_db";
// import { DataSource } from "typeorm";
// import { OPENAI_CONFIG } from "../config/openai";
// import { createSqlAgent, SqlToolkit } from "langchain/agents/toolkits/sql";
// import {
//   ChatPromptTemplate,
//   SystemMessagePromptTemplate,
//   HumanMessagePromptTemplate
// } from "langchain/prompts";
// import { ChatOpenAI } from "langchain/chat_models/openai";
// import { LLMChain } from "langchain/chains";

// export const message = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const message = req.body.message;

//     const datasource = new DataSource({
//       type: "mysql",
//       host: process.env.DB_HOST,
//       port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
//       username: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_DATABASE,
//       multipleStatements: true,
//       synchronize: true,
//     });

//     const db = await SqlDatabase.fromDataSourceParams({
//       appDataSource: datasource,
//       ignoreTables: ["user", "token"],
//     });

//     const model = new OpenAI(OPENAI_CONFIG);
//     const toolkit = new SqlToolkit(db, model);
//     const executor = createSqlAgent(model, toolkit);

//     const sqlResult = await executor.call({ input: message });
//     console.log(sqlResult)
//     await datasource.destroy();

//     const template = `
//     It's a "mall bar" chatbot, a shopping mall used by everyone.
//     {text} is already a result derived from a user question.
//     Write one sentence according to the question.
//     It avoids professional languages and makes it easy to read in Korea, so it can be easily read by all users.
//     `;

//     const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(template);
//     const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(message);

//     const chatPrompt = ChatPromptTemplate.fromMessages([systemMessagePrompt, humanMessagePrompt]);
//     const chat = new ChatOpenAI(OPENAI_CONFIG);

//     const chain = new LLMChain({
//       llm: chat,
//       prompt: chatPrompt,
//     });

//     const result = await chain.call({
//       output_language: "Korean",
//       text: sqlResult.output
//     });
//     console.log(result)

//     res.json({ response: result });

//   } catch (error) {
//     console.error(error);
//     if (error) {
//       res.status(400).json({ error: '뭐 이 자식아' });
//     } else {
//       res.status(401).json({ error: '뭐 이 자식아' });
//     }
//   }
// };

// import { Request, Response } from 'express';
// import { OpenAI } from "langchain/llms/openai";
// import { SqlDatabase } from "langchain/sql_db";
// import { DataSource } from "typeorm";
// import { OPENAI_CONFIG } from "../config/openai";
// import { createSqlAgent, SqlToolkit } from "langchain/agents/toolkits/sql";
// import {
//   ChatPromptTemplate,
//   SystemMessagePromptTemplate,
//   HumanMessagePromptTemplate
// } from "langchain/prompts";
// import { ChatOpenAI } from "langchain/chat_models/openai";
// import { LLMChain } from "langchain/chains";

// export const message = async (message: string, socket: any): Promise<void> => {
//   try {

//     const datasource = new DataSource({
//       type: "mysql",
//       host: process.env.DB_HOST,
//       port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
//       username: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_DATABASE,
//       multipleStatements: true,
//       synchronize: true,
//     });

//     const db = await SqlDatabase.fromDataSourceParams({
//       appDataSource: datasource,
//       ignoreTables: ["user", "token", "address", "chat", "chatFaq", "orderDetail", "orders"],
//     });

//     const model = new OpenAI(OPENAI_CONFIG);
//     const toolkit = new SqlToolkit(db, model);
//     const executor = createSqlAgent(model, toolkit);

//     const sqlResult = await executor.call({ input: message });
//     console.log(sqlResult)
//     await datasource.destroy();

//     const template = `
//     It's a shopping mall "Mall, Bar" chatbot that everyone uses.
//     Avoid questions that are not related to shopping mall chatbots.
//     We are here to provide information and assistance regarding our products.
//     {text} is already a result derived from a user question. Write one sentence according to the user question.
//     It avoids professional languages and makes it easy for all users in Korea to read them.
//     If you don't know the answer, just say you don't know it, and don't try to make up the answer.
//     Respectfully answer that if the question is not context-related, it is adjusted to answer only context-related questions.
//     We aim to provide clear and concise information to all customers in {output_language}
//     `;

//     const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(template);
//     const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(`Question: ${message}\nAnswer: ${sqlResult.output}`);

//     const chatPrompt = ChatPromptTemplate.fromMessages([systemMessagePrompt, humanMessagePrompt]);
//     const chat = new ChatOpenAI(OPENAI_CONFIG);

//     const chain = new LLMChain({
//       llm: chat,
//       prompt: chatPrompt,
//     });

//     const result = await chain.call({
//       output_language: "Korean",
//       text: sqlResult.output
//     });

//     console.log(result)

//     socket.emit('response', { response: result });

//   } catch (error) {
//     console.error(error);
//     socket.emit('error', { error: '뭐 이 자식아' });
//   }
// };


import { DataSource } from "typeorm";
import { SqlDatabase } from "langchain/sql_db";
import { RunnableSequence } from "langchain/schema/runnable";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OPENAI_CONFIG } from "../config/openai";

export const message = async (question: string, socket: any): Promise<void> => {
  try {

    const datasource = new DataSource({
      type: "mysql",
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      multipleStatements: true,
      synchronize: true,
    });

    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: datasource,
      ignoreTables: ["user", "token", "address", "chat", "chatFaq", "orderDetail", "orders"],
    });

    const prompt =
      PromptTemplate.fromTemplate(`Based on the table schema below, write a SQL query that would answer the user's question:
      {schema}

      Question: {question}
      SQL Query:`);

    const model = new ChatOpenAI(OPENAI_CONFIG);

    const sqlQueryGeneratorChain = RunnableSequence.from([
      {
        schema: async () => db.getTableInfo(),
        question: (input: { question: string }) => input.question,
      },
      prompt,
      model.bind({ stop: ["\nSQLResult:"] }),
      new StringOutputParser(),
    ]);
    
    const finalResponsePrompt =
    PromptTemplate.fromTemplate(`
      It's a shopping mall "Mall, Bar" chatbot that everyone uses.
      Avoid questions that are not related to shopping mall chatbots.
      We are here to provide information and assistance regarding our products.
      Based on the table schema below, question, sql query, and sql response, write a natural language response:
      {schema}
      Question: {question}
      SQL Query: {query}
      SQL Response: {response}
      {text} is already a result derived from a user question. Write one sentence according to the user question.
      It avoids professional languages and makes it easy for all users in Korea to read them.
      If you don't know the answer, just say you don't know it, and don't try to make up the answer.
      Respectfully answer that if the question is not context-related, it is adjusted to answer only context-related questions.
      We aim to provide clear and concise information to all customers in Korean.`);
  
  
      const fullChain = RunnableSequence.from([
        {
            question: (input) => input.question,
            query: sqlQueryGeneratorChain,
        },
        {
            schema: async () => db.getTableInfo(),
            question: (input) => input.question,
            query: (input) => input.query,
            response: (input) => db.run(input.query),
            text: (input) => input.response, // 이 부분을 추가하거나 수정하여 `text` 변수에 값을 할당
        },
        finalResponsePrompt,
        model,
    ]);
    
  
  const finalResponse = await fullChain.invoke({
    question: question,
  });
  
  console.log(finalResponse);

    socket.emit('response', { response: finalResponse });

  } catch (error) {
    console.error(error);
    socket.emit('error', { error: '뭐 이 자식아' });
  }
};
