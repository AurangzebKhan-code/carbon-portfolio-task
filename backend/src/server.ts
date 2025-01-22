import express, { Request, Response, Router } from 'express';
import mysql, { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import { Project, Portfolio, PortfolioItem } from './types';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

interface ProjectRow extends Project, RowDataPacket {}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});


const calculatePortfolio = async (requestedVolume: number): Promise<PortfolioItem[]> => {
    const [projects] = await pool.query<ProjectRow[]>('SELECT * FROM projects');
    let portfolio: PortfolioItem[] = [];
    
    const totalWeight = projects.reduce((sum, p) => sum + parseFloat(p.distribution_weight), 0);
    
    for (let project of projects) {
        const targetVolume = Math.floor(requestedVolume * (parseFloat(project.distribution_weight) / totalWeight));
        const allocatedVolume = Math.min(targetVolume, parseFloat(project.offered_volume));
        
        if (allocatedVolume > 0) {
            portfolio.push({
                project_id: project.id,
                allocated_volume: allocatedVolume,
                name: project.name,
                price_per_ton: parseFloat(project.price_per_ton),
                country: project.country
            });
        }
    }

    return portfolio;
};

app.get('/api/projects', async (_req: Request, res: Response) => {
    try {
        const [projects] = await pool.query<ProjectRow[]>('SELECT * FROM projects');
        res.json(projects);
    } catch (error: any) {
        console.error('Database error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch projects', 
            details: error?.message || 'Unknown error'
        });
    }
});

app.post('/api/generate-portfolio', async (req: Request, res: Response): Promise<void> => {
    try {
        const { volume } = req.body;
        if (!volume || volume <= 0) {
            res.status(400).json({ error: 'Invalid volume requested' });
            return;
        }

        const portfolioItems = await calculatePortfolio(volume);
        const totalVolume = portfolioItems.reduce((sum, item) => sum + item.allocated_volume, 0);
   
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO portfolios (requested_volume, total_volume) VALUES (?, ?)',
            [volume, totalVolume]
        );

        const portfolioId = result.insertId;
        for (const item of portfolioItems) {
            await pool.query<ResultSetHeader>(
                'INSERT INTO portfolio_items (portfolio_id, project_id, allocated_volume) VALUES (?, ?, ?)',
                [portfolioId, item.project_id, item.allocated_volume]
            );
        }
       
        const [items] = await pool.query(
            `SELECT pi.*, p.name, p.price_per_ton, p.country
            FROM portfolio_items pi
            JOIN projects p ON p.id = pi.project_id
            WHERE pi.portfolio_id = ?`,
            [portfolioId]
        );

        res.json({
            portfolio_id: portfolioId,
            requested_volume: volume,
            total_volume: totalVolume,
            items
        });
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({ 
            error: 'Failed to generate portfolio',
            details: (error as Error).message 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;