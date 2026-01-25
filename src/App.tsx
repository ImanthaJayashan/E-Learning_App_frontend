import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import EyeProblemDetector from "./pages/EyeProblemDetector";
import VisionTherapy from "./pages/VisionTherapy";
import GamesPage from "./pages/GamesPage";
import AmbloCar from "./pages/AmbloCar";
import NinjaGame from "./pages/NinjaGame";
import CircleShape from "./pages/CircleShape";
import SquareShape from "./pages/SquareShape";
import TriangleShape from "./pages/TriangleShape_new";
import StarShape from "./pages/StarShape";

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/eye-problem-detector" element={<EyeProblemDetector />} />
    <Route path="/vision-therapy" element={<VisionTherapy />} />
    <Route path="/games" element={<GamesPage />} />
    <Route path="/games/amblocar" element={<AmbloCar />} />
    <Route path="/games/ninjagame" element={<NinjaGame />} />
    <Route path="/shapes/circle" element={<CircleShape />} />
    <Route path="/shapes/square" element={<SquareShape />} />
    <Route path="/shapes/triangle" element={<TriangleShape />} />
    <Route path="/shapes/star" element={<StarShape />} />
  </Routes>
);

export default App;
