import mysql from 'mysql';
import dotenv from 'dotenv';

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

export async function createDataSet() {
    try {
        const tables = await fetchAllTables();
        const dataset: any = {};

        for (const table of tables) {
            dataset[table] = await fetchDataFromTable(table);
        }
        console.log('hi')
        console.log('Dataset created.');
        return dataset;
    } catch (error) {
        console.error('Error creating dataset:', error);
        throw error;
    } finally {
        connection.end();
    }
}

export { connection };