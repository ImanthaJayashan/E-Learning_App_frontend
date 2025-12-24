import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import EyeProblemDetector from "./pages/EyeProblemDetector";

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/eye-problem-detector" element={<EyeProblemDetector />} />
  </Routes>
);

export default App;
