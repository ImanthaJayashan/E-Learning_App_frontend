import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import EyeProblemDetector from "./pages/EyeProblemDetector";
import DyslexiaSpeech from "./pages/DyslexiaSpeech";

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/eye-problem-detector" element={<EyeProblemDetector />} />
    <Route path="/dyslexia-reading-speech" element={<DyslexiaSpeech />} />
  </Routes>
);

export default App;
