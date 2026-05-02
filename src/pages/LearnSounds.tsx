import React from "react";
import { useNavigate } from "react-router-dom";
import { AnimalCard } from "@/components/AnimalCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProgressDashboard from "@/components/ProgressDashboard";
import { learningCategories } from "@/config/animals";
import { gameConfig, getLevelDescription } from "@/config/gameConfig";

const LearnSounds: React.FC = () => {
  const navigate = useNavigate();
  const [playing, setPlaying] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<number>(0);
  const [selectedLevel, setSelectedLevel] = React.useState<1 | 2 | 3>(gameConfig.currentLevel);
  const [showProgressDashboard, setShowProgressDashboard] = React.useState(false);
  const [latestSession, setLatestSession] = React.useState<any>(null);

  React.useEffect(() => {
    // Load latest session data from localStorage
    const stored = localStorage.getItem('latestSession');
    if (stored) {
      setLatestSession(JSON.parse(stored));
    }
  }, []);

  const currentCategory = learningCategories[selectedCategory];

  const playSound = (sound: string, name: string, isMissing: boolean = false) => {
    if (isMissing || sound.includes("MISSING")) {
      // Show toast notification for missing asset
      const toastDiv = document.createElement('div');
      toastDiv.className = 'fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-lg text-sm';
      toastDiv.textContent = `🎵 Sound for ${name} not yet available`;
      document.body.appendChild(toastDiv);
      setTimeout(() => toastDiv.remove(), 2000);
      return;
    }
    
    setPlaying(name);
    const audio = new Audio(sound);
    audio.onended = () => setPlaying(null);
    audio.play().catch((e) => {
      console.error("Failed to play sound", e);
      setPlaying(null);
    });
  };

  // Handle game start with selected level
  const handleGameStart = () => {
    // Store selected level in session storage for the game to use
    sessionStorage.setItem('selectedGameLevel', selectedLevel.toString());
    navigate("/game");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 text-blue-900">
          🎓 Learn Animal Sounds
        </h1>
        <p className="text-center text-gray-600 text-lg">
          Click on each animal to hear its sound, then select your difficulty level!
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">📚 Choose Category:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {learningCategories.map((category, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedCategory === index
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCategory(index)}
              >
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {category.emoji} {category.name}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Animals Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">🐾 Animals:</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {currentCategory.animals.map((animal) => (
              <div key={animal.name} className="flex flex-col items-center">
                <AnimalCard
                  name={animal.name}
                  image={animal.image}
                  onClick={() => playSound(animal.sound, animal.name, animal.isMissingAssets)}
                  disabled={false}
                  isCorrect={playing === animal.name}
                  played={playing === animal.name}
                  isMissingAsset={animal.isMissingAssets}
                />
                {/* ENHANCEMENT: Show animal name below card */}
                <p className="text-sm font-semibold text-gray-700 mt-2 capitalize">
                  {animal.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ENHANCEMENT: Difficulty Level Selector */}
        {gameConfig.enableDifficultyLevels && (
          <Card className="mb-8 border-2 border-purple-300 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-2xl">🎮 Select Difficulty Level</CardTitle>
              <CardDescription>
                Choose your starting level. You can change it as you play!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Level 1 */}
                <div
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedLevel === 1
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-white hover:border-green-300'
                  }`}
                  onClick={() => setSelectedLevel(1)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">🏠 Level 1</h3>
                    <Badge className="bg-green-500">Easy</Badge>
                  </div>
                  <p className="text-sm text-gray-700">Domestic Animals</p>
                  <p className="text-xs text-gray-500 mt-2">4 Animals (Dog, Cat, Cow, Hen)</p>
                </div>

                {/* Level 2 */}
                <div
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedLevel === 2
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-300 bg-white hover:border-yellow-300'
                  }`}
                  onClick={() => setSelectedLevel(2)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">🌳 Level 2</h3>
                    <Badge className="bg-yellow-500">Medium</Badge>
                  </div>
                  <p className="text-sm text-gray-700">Semi-Familiar Animals</p>
                  <p className="text-xs text-gray-500 mt-2">7 Animals (Level 1 + Duck, Horse, Goat)</p>
                </div>

                {/* Level 3 */}
                <div
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedLevel === 3
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-white hover:border-red-300'
                  }`}
                  onClick={() => setSelectedLevel(3)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">🦁 Level 3</h3>
                    <Badge className="bg-red-500">Hard</Badge>
                  </div>
                  <p className="text-sm text-gray-700">All Animals</p>
                  <p className="text-xs text-gray-500 mt-2">10 Animals (Level 2 + Lion, Elephant, Monkey)</p>
                </div>
              </div>

              {/* Current Selection Display */}
              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-300">
                <p className="text-center text-sm font-semibold text-gray-700">
                  Starting with: <span className="text-lg text-purple-600">{getLevelDescription(selectedLevel)}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="text-lg px-8 py-6"
          >
            Back
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowProgressDashboard(true)}
            className="text-lg px-8 py-6 bg-green-600 hover:bg-green-700 text-white"
          >
            📊 View Progress
          </Button>
          <Button
            onClick={handleGameStart}
            className="text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            🎮 Start Game
          </Button>
        </div>
      </div>

      {/* Progress Dashboard Modal */}
      <ProgressDashboard
        latestSession={latestSession}
        isOpen={showProgressDashboard}
        onClose={() => setShowProgressDashboard(false)}
      />
    </div>
  );
};

export default LearnSounds;

