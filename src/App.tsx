import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { TrainerPage } from './pages/TrainerPage';
import { ResultsPage } from './pages/ResultsPage';
import { HistoryPage } from './pages/HistoryPage';
import { InputMessagePlaygroundPage } from './pages/InputMessagePlaygroundPage';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

function App(): React.ReactElement {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/trainer" element={<TrainerPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/playground/input-message" element={<InputMessagePlaygroundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
