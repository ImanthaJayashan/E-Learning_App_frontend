import React, { type JSX } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import EyeTrackingBoot from "./components/EyeTrackingBoot";

// Pages - E-Learning App
import RoleSelection from "./pages/RoleSelection";
import Home from "./pages/Home";
import EyeProblemDetector from "./pages/EyeProblemDetector";
import VisionTherapy from "./pages/VisionTherapy";
import GamesPage from "./pages/GamesPage";
import CircleShape from "./pages/CircleShape";
import SquareShape from "./pages/SquareShape";
import TriangleShape from "./pages/TriangleShape_new";
import StarShape from "./pages/StarShape";
import ShapeNinja from "./pages/ninjagame";
import AmbloCar from "./pages/AmbloCar";
import SnakeGame from "./pages/snake";
import ParentsDashboard from "./pages/ParentsDashboard";
import VoiceLearn from "./pages/VoiceLearn";
import WriteSenseLanding from "./pages/writesense/Landing";
import WriteSenseTutorials from "./pages/writesense/Tutorials";
import WriteSenseQuiz from "./pages/writesense/Quiz";
import WriteSenseResults from "./pages/writesense/Result";

// Pages - Animal Sounds module (from frontend_fixed)
import LearnSounds from "./pages/LearnSounds";
import AnimalSoundsGame from "./pages/AnimalSoundsGame";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const userRole = localStorage.getItem("userRole");
  return userRole ? element : <Navigate to="/role-selection" replace />;
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <EyeTrackingBoot />
        <Routes>
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/eye-problem-detector" element={<ProtectedRoute element={<EyeProblemDetector />} />} />
          <Route path="/vision-therapy" element={<ProtectedRoute element={<VisionTherapy />} />} />
          <Route path="/games" element={<ProtectedRoute element={<GamesPage />} />} />
          <Route path="/games/amblocar" element={<ProtectedRoute element={<AmbloCar />} />} />
          <Route path="/games/ninjagame" element={<ProtectedRoute element={<ShapeNinja />} />} />
          <Route path="/games/snakegame" element={<ProtectedRoute element={<SnakeGame />} />} />
          <Route path="/shapes/circle" element={<ProtectedRoute element={<CircleShape />} />} />
          <Route path="/shapes/square" element={<ProtectedRoute element={<SquareShape />} />} />
          <Route path="/shapes/triangle" element={<ProtectedRoute element={<TriangleShape />} />} />
          <Route path="/shapes/star" element={<ProtectedRoute element={<StarShape />} />} />
          <Route path="/parents-dashboard" element={<ProtectedRoute element={<ParentsDashboard />} />} />
          <Route path="/voice-learn" element={<ProtectedRoute element={<VoiceLearn />} />} />
          {/* Animal Sounds Learning Module */}
          <Route path="/learn" element={<ProtectedRoute element={<LearnSounds />} />} />
          <Route path="/game" element={<ProtectedRoute element={<AnimalSoundsGame />} />} />
          {/* WriteSense */}
          <Route path="/write-sense/landing-page" element={<ProtectedRoute element={<WriteSenseLanding />} />} />
          <Route path="/write-sense/tutorials" element={<ProtectedRoute element={<WriteSenseTutorials />} />} />
          <Route path="/write-sense/quiz" element={<ProtectedRoute element={<WriteSenseQuiz />} />} />
          <Route path="/write-sense/results" element={<ProtectedRoute element={<WriteSenseResults />} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
