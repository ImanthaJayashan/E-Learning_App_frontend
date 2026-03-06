import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Tutorials from "./pages/Tutorials";
import Quiz from "./pages/Quiz";
import Results from "./pages/Result";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/tutorials" element={<Tutorials />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  );
}
