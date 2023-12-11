import { DataSource } from "typeorm";
import { SqlDatabase } from "langchain/sql_db";
import { RunnableSequence } from "langchain/schema/runnable";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OPENAI_CONFIG } from "../config/openai";
import { Socket } from 'socket.io';

export const message = async (question: string, socket: Socket): Promise<void> => {
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
      PromptTemplate.fromTemplate(`creates an SQL query that answers the user's questions based on the table schema below:
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

    const result = await sqlQueryGeneratorChain.invoke({
      question: question,
    });
    
    console.log(result);
    const finalResponsePrompt = PromptTemplate.fromTemplate(`
    "MALL BA" shopping mall chatbot. Here, we only provide information and assistance related to shopping mall chatbots.
    Write a natural language response based on the table schema below, questions, SQL queries, and SQL responses.
    Schema: """
    {schema} 
    """
    Question: """ 
    {question} 
    """
    SQL query: """
    {query} 
    """
    SQL Response: """ 
    {response} 
    """
    Avoid jargon and make it easy for all Korean users to read.
    It does not mention anything related to the link.
    If you don't know the answer, answer that you don't know without making up the answer.
    Respectfully inform that if the question is context-related, you will only answer context-related questions.
    The goal is to provide clear and concise information in Korean to all customers in 1 sentence.
    `);

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
    socket.emit('error', { error: 'error' });
  }
};