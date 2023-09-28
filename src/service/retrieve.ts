// import { LLMChain } from "langchain/chains";
// import { ChatOpenAI } from "langchain/chat_models/openai";
// import { ChatPromptTemplate } from "langchain/prompts";
// import { OpenAI } from "langchain/llms/openai";
// import { SqlDatabase } from "langchain/sql_db";
// import { SqlDatabaseChain } from "langchain/chains/sql_db";
// import { DataSource } from "typeorm";
// import { QueryFailedError } from 'typeorm';

// import { OPENAI_CONFIG } from "../config/openai";

// export const retrieveDbData = async (inputText: string) => {
//     try {
//     const datasource = new DataSource({
//           type: "mysql",
//           host: process.env.DB_HOST,
//           port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
//           username: process.env.DB_USER,
//           password: process.env.DB_PASSWORD,
//           database: process.env.DB_DATABASE,
//           multipleStatements: true,
//           synchronize: true,
//         });

//     const db = await SqlDatabase.fromDataSourceParams({
//         appDataSource: datasource,
//         ignoreTables: ["user", "token"],
//     });

//     const sqlChain = new SqlDatabaseChain({
//         llm: new OpenAI(OPENAI_CONFIG),
//         database: db,
//     });

//         const sqlChainResult = await sqlChain.run(inputText);
//         return sqlChainResult;
//     } catch (error) {
//         if (error instanceof QueryFailedError) {
//             console.error(`Error: The table referenced does not exist. Details: ${error.message}`);
//             throw new Error("The table referenced in the query does not exist.");
//         } else {
//             console.error("Database error:", error);
//             throw new Error("An error occurred while querying the database.");
//         }
//     }
// }    

// //잘못된 입력 됐을 때 sqlchainresult보기
//     // const chatPrompt = ChatPromptTemplate.fromMessages([
//     //     ["system", `당신은 이제 쇼핑몰 챗봇입니다. 
//     //     쇼핑몰 챗봇을 사용하는 사람은 일반인 쇼핑몰 사용자 입니다. 
//     //     사용자가 쇼핑몰과 관련 없는 말을 했다면, "죄송합니다 다시 질문해 주세요" 라고 해주세요.
//     //     DB에서 얻은 정보 {text}를 바탕으로 자연스러운 응답을 한국말로 생성해주세요.`],
//     //     ["human", inputText],
//     // ]);

//     // const chat = new ChatOpenAI(OPENAI_CONFIG);

//     // const chain = new LLMChain({
//     //     llm: chat,
//     //     prompt: chatPrompt,
//     // });

//     // const response = await chain.call({
//     //     text: sqlChainResult,
//     // });