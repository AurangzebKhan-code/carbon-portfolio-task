import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [requestedVolume, setRequestedVolume] = useState('');
  const [portfolio, setPortfolio] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then(response => setProjects(response.data))
      .catch(err => setError('Failed to load projects'));
  }, []);

  const generatePortfolio = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/generate-portfolio', {
        volume: parseInt(requestedVolume)
      });
      setPortfolio(response.data);
    } catch (err) {
      setError('Failed to generate portfolio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Carbon Credits Portfolio Generator</h1>

      <form onSubmit={generatePortfolio} className="form-section">
        <input
          type="number"
          value={requestedVolume}
          onChange={(e) => setRequestedVolume(e.target.value)}
          placeholder="Enter volume in tons"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Portfolio'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {portfolio && (
        <div className="portfolio-section">
          <h2>Generated Portfolio</h2>
          <div className="portfolio-summary">
            <p>Requested Volume: {portfolio.requested_volume} tons</p>
            <p>Total Allocated: {portfolio.total_volume} tons</p>
          </div>
          
          <div className="portfolio-items">
            {portfolio.items.map((item) => (
              <div key={item.project_id} className="portfolio-item">
                <h3>{item.name}</h3>
                <div className="item-details">
                  <p>Allocated Volume: {item.allocated_volume} tons</p>
                  <p>Price per Ton: €{item.price_per_ton}</p>
                  <p>Total Cost: €{(item.allocated_volume * item.price_per_ton).toFixed(2)}</p>
                  <p>Country: {item.country}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="portfolio-total">
            <p>Total Portfolio Cost: €
              {portfolio.items.reduce((sum, item) => 
                sum + (item.allocated_volume * item.price_per_ton), 0).toFixed(2)}
            </p>
          </div>
        </div>
      )}

      <div className="projects-section">
        <h2>Available Projects</h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <h3>{project.name}</h3>
              <div className="project-details">
                <p>Available Volume: {project.offered_volume} tons</p>
                <p>Price per Ton: €{project.price_per_ton}</p>
                <p>Weight: {(project.distribution_weight * 100).toFixed(0)}%</p>
                <p>Country: {project.country}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;