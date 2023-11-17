import path from 'path';
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const apiDocsPath = path.join(__dirname, '../routes/FAQ_Routes.ts'); // 절대 경로로 변경

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'REST API DOCS Docs',
            version: '2.0.0',
            description: 'REST API with express',
        },
        host: 'localhost:3001',
        basePath: '/'
    },
    apis: [apiDocsPath], // 상대 경로 대신 절대 경로 사용
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };
