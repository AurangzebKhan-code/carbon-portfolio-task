import supertest, { SuperTest, Test } from 'supertest';
import app from '../src/server';
import { expect, test, describe, beforeAll } from '@jest/globals';
import mysql, { RowDataPacket } from 'mysql2/promise';
import dotenv from 'dotenv';

interface CountResult extends RowDataPacket {
    count: number;
}

dotenv.config();

const request: SuperTest<Test> = supertest(app);

beforeAll(async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        const [rows] = await connection.execute<CountResult[]>('SELECT COUNT(*) as count FROM projects');
        console.log('Projects in database:', rows[0]?.count || 0);
    } finally {
        await connection.end();
    }
});

describe('Portfolio Generation API', () => {
    test('POST /api/generate-portfolio with valid volume', async () => {
        const res = await request
            .post('/api/generate-portfolio')
            .send({ volume: 100 });
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('items');
        expect(Array.isArray(res.body.items)).toBeTruthy();
    });

    test('POST /api/generate-portfolio with invalid volume', async () => {
        const res = await request
            .post('/api/generate-portfolio')
            .send({ volume: -1 });
        
        expect(res.statusCode).toBe(400);
    });

    test('GET /api/projects should return all projects', async () => {
        const res = await request.get('/api/projects');
        
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('name');
    });
});