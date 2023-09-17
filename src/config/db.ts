import mysql from 'mysql';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true,
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});


function fetchAllTables(): Promise<string[]> {
    return new Promise((resolve, reject) => {
        connection.query('SHOW TABLES', (error, results) => {
            if (error) reject(error);
            const tables: string[] = results.map((row: any) => Object.values(row)[0]);
            resolve(tables);
        });
    });
}

function fetchDataFromTable(table: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM \`${table}\``, (error, results) => { // 여기에서 백틱을 사용하였습니다.
            if (error) reject(error);
            resolve(results);
        });
    });
}

function saveToJSON(data: any, filename: string) {
    const outputPath = path.join(__dirname, filename);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
}

export async function createDataSet() {
    const tables = await fetchAllTables();
    const dataset: any = {};

    for (const table of tables) {
        dataset[table] = await fetchDataFromTable(table);
    }

    saveToJSON(dataset, 'dataSet.json');
    console.log('Data saved to dataSet.json');

    connection.end();
}

export { connection };