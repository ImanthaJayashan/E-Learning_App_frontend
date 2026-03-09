import React from "react";
import Navbar from "../components/Navbar";
import { ActivityCard } from "../components/voicelearn/ActivityCard";

const VoiceLearn: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative font-sans">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://cdn.magicpatterns.com/uploads/pLkmfS7AAgukU1WtfipmSW/application_background.png")',
          backgroundPosition: "center bottom",
        }}
      >
        <div className="absolute inset-0 bg-white/10 pointer-events-none" />
      </div>

      <Navbar />

      <main className="flex-grow flex items-center justify-center relative z-10 w-full px-4 py-24 md:py-32">
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center">
          {/* Left Side */}
          <div className="hidden lg:block w-1/3 pr-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#3E2723] mb-6 leading-tight drop-shadow-sm">
              Learning is an <br />
              <span className="text-[#E53935]">Adventure!</span>
            </h1>
            <p className="text-lg text-[#5D4037] font-semibold bg-white/60 p-4 rounded-2xl backdrop-blur-sm shadow-sm">
              Join our little fox friend and learn your ABCs with the magic of your voice. Ready to start?
            </p>
          </div>

          {/* Centerpiece: Activity Card */}
          <div className="w-full md:w-auto flex justify-center">
            <ActivityCard />
          </div>

          <div className="hidden lg:block w-1/3 pl-12" />
        </div>
      </main>
    </div>
  );
};

export default VoiceLearn;
