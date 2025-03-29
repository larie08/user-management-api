//db.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User'; 
import fs from 'fs';
import path from 'path';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'user_management_api',
    driver: require('mysql2'),
    entities: [User],
    synchronize: true, 
    logging: true,
});

export async function ensureDbExists() {
    try {
        const dbPath = path.resolve(process.env.DB_NAME || 'user_management_api');
        if (!fs.existsSync(dbPath)) {
            console.log(`Database file not found at ${dbPath}. Creating...`);
            await AppDataSource.initialize();
            console.log('Database created successfully.');
        } else {
            console.log('Database already exists.');
        }
    } catch (err) {
        console.error('Error ensuring database exists:', err);
        throw err;
    }
}

AppDataSource.initialize()
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error('Database connection failed:', err));