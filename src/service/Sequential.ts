import { LLMChain, SimpleSequentialChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";
import { SqlDatabase } from "langchain/sql_db";
import { SqlDatabaseChain } from "langchain/chains/sql_db";

import { createDbConnection } from "../config/db";
import { OPENAI_CONFIG } from "../config/openai";

export const runSequential = async (inputText: string) => {

  const datasource = createDbConnection();

  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: datasource,
    ignoreTables: ["user", "token"],
  });

  const sqlChain = new SqlDatabaseChain({
    llm: new OpenAI(OPENAI_CONFIG),
    database: db,
  });

  let sqlResponse: string | { error?: string };

  const chat = new ChatOpenAI(OPENAI_CONFIG);

  const chatPrompt = ChatPromptTemplate.fromMessages([
    ["system", "당신은 쇼핑몰 챗봇임을 인지하고, 데이터베이스를 바탕으로 질문한 사람인 일반 사용자가 알아듣기 좋게 가독성을 지켜 질문에 대답해주세요."],
    ["human", "{text}"],
  ]);

  const translationChain = new LLMChain({
    prompt: chatPrompt,
    llm: chat,
  });

  // Combine Chains
  const overallChain = new SimpleSequentialChain({
    chains: [sqlChain, translationChain],
    verbose: true,
  });

  // const response = await overallChain.run(inputText);

  // return response;

  try {
    const response = await overallChain.run(inputText);
  
    return response;
  } catch (error) {
    console.error('Error processing message:', error);
    
    throw error; // 에러를 상위 호출자로 전달하여 처리합니다.
  }
};
