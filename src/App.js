import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import ResultPage from './ResultPage';
import AlgorithmPage from './AlgorithmPage';
import HomePage from './Home';
import AboutUs from './AboutUs';
import EdaSummary from './EDASummary';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/eda-summary" element={<EdaSummary />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/algorithm" element={<AlgorithmPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </Router>
  );
};

export default App;
