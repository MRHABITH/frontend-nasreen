import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CheckPage from './pages/CheckPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <Router>
      <div className="antialiased text-gray-900">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/check" element={<CheckPage />} />
          <Route path="/results/:taskId" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
