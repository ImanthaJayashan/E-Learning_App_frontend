import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import EyeProblemDetector from "./pages/EyeProblemDetector";
import CircleShape from "./pages/CircleShape";
import SquareShape from "./pages/SquareShape";
import TriangleShape from "./pages/TriangleShape";
import StarShape from "./pages/StarShape";

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/eye-problem-detector" element={<EyeProblemDetector />} />
    <Route path="/shapes/circle" element={<CircleShape />} />
    <Route path="/shapes/square" element={<SquareShape />} />
    <Route path="/shapes/triangle" element={<TriangleShape />} />
    <Route path="/shapes/star" element={<StarShape />} />
  </Routes>
);

export default App;
