# Carbon Portfolio Generator
A full-stack application that generates carbon credit portfolios based on user-specified volumes.

## Implementation Details
1. Portfolio Generation Algorithm
   - Distributes credits based on project weights
   - Respects maximum available volumes
   - Ensures whole number allocations

2. Error Handling
   - Input validation
   - Database connection errors
   - API error responses

## Future Improvements
1. Add user authentication
2. Implement portfolio history
3. Add more detailed project information
4. Enhance error handling and validation
5. Add frontend tests
6. Improve UI/UX

## Technologies
- Backend: Node.js with Express and TypeScript
- Frontend: React
- Database: MySQL


## Setup

### 1. Database
sql
CREATE DATABASE carbon_portfolio;

USE carbon_portfolio;

CREATE TABLE projects (
id INT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
country VARCHAR(100),
image_url TEXT,
price_per_ton DECIMAL(10,2) NOT NULL,
offered_volume INT NOT NULL,
distribution_weight DECIMAL(4,2) NOT NULL,
supplier VARCHAR(100),
earliest_delivery DATE,
description TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO projects VALUES
(1, 'EverGreen CarbonScape', 'Germany', 'Link', 650.00, 15, 0.05, 'Klom', '2023-09-01', 'The "EverGreen CarbonScape" project is dedicated to long-term sustainability.', NOW()),
(2, 'VerdeCarbon', 'India', 'Link', 200.00, 900, 0.10, 'Klom', '2022-04-01', 'A transformative carbon credit project dedicated to reforestation.', NOW()),
(3, 'SustainaForest Carbon', 'Brazil', 'Link', 50.85, 1500, 0.15, 'EcoCarbon', '2024-01-01', 'The "SustainaForest Carbon" project tackles climate change with bold actions.', NOW()),
(4, 'EcoRespire', 'India', 'Link', 25.00, 1100, 0.25, 'Pure Planet', '2023-05-15', 'A project dedicated to revitalizing our planet''s natural resources.', NOW()),
(5, 'EverGreen Carbon', 'Egypt', 'Link', 10.50, 16000, 0.45, 'Carbon Solutions', '2023-12-01', 'The "EverGreen Carbon" project is a transformational initiative for the planet.', NOW());

CREATE TABLE portfolios (
id INT PRIMARY KEY AUTO_INCREMENT,
requested_volume INT NOT NULL,
total_volume INT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE portfolio_items (
id INT PRIMARY KEY AUTO_INCREMENT,
portfolio_id INT,
project_id INT,
allocated_volume INT NOT NULL,
FOREIGN KEY (portfolio_id) REFERENCES portfolios(id),
FOREIGN KEY (project_id) REFERENCES projects(id)
);

### 2. Backend
bash
cd backend
npm install
npm run dev

### 3. Update .env with your MySQL credentials

### 4. Frontend
bash
cd frontend
npm install
npm start

### 5. API Endpoints
- GET `/api/projects` - List all projects
- POST `/api/generate-portfolio` - Generate portfolio

### 6. Testing
bash
cd backend
npm test

## Project Structure
carbon-portfolio/
├── backend/
│ ├── src/
│ │ ├── types.ts
│ │ └── server.ts
│ └── tests/
└── frontend/
└── src/
├── App.js
└── App.css