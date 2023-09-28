import { Request, Response } from 'express';
import { OpenAI } from "langchain/llms/openai";
import { SqlDatabase } from "langchain/sql_db";
import { DataSource } from "typeorm";
import { OPENAI_CONFIG } from "../config/openai";
import { createSqlAgent, SqlToolkit } from "langchain/agents/toolkits/sql";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate
} from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";

export const message = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = req.body.message;

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
      ignoreTables: ["user", "token"],
    });

    const model = new OpenAI(OPENAI_CONFIG);
    const toolkit = new SqlToolkit(db, model);
    const executor = createSqlAgent(model, toolkit);

    const sqlResult = await executor.call({ input: message });
    console.log(sqlResult)
    await datasource.destroy();

    const template = `
    It's a "mall bar" chatbot, a shopping mall used by everyone.
    {text} is already a result derived from a user question.
    Write one sentence according to the question.
    It avoids professional languages and makes it easy to read in Korea, so it can be easily read by all users.
    `;

    const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate(template);
    const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate(message);

    const chatPrompt = ChatPromptTemplate.fromMessages([systemMessagePrompt, humanMessagePrompt]);
    const chat = new ChatOpenAI(OPENAI_CONFIG);

    const chain = new LLMChain({
      llm: chat,
      prompt: chatPrompt,
    });

    const result = await chain.call({
      output_language: "Korean",
      text: sqlResult.output
    });
    console.log(result)

    res.json({ response: result });

  } catch (error) {
    console.error(error);
    if (error) {
      res.status(400).json({ error: '뭐 이 자식아' });
    } else {
      res.status(401).json({ error: '뭐 이 자식아' });
    }
  }
};
