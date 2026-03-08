import React from "react";
import { useNavigate } from "react-router-dom";
import { AnimalCard } from "@/components/AnimalCard";
import dogImage from "@/assets/dog.png";
import catImage from "@/assets/cat.png";
import cowImage from "@/assets/cow.png";
import lionImage from "@/assets/lion.png";

// real animal sounds
import dogSound from "@/assets/sounds/dog.wav";
import catSound from "@/assets/sounds/cat.wav";
import cowSound from "@/assets/sounds/cow.wav";
import lionSound from "@/assets/sounds/lion.wav";
import { Button } from "@/components/ui/button";

interface Animal {
  name: string;
  image: string;
  sound: string;
}

const animals: Animal[] = [
  { name: "dog", image: dogImage, sound: dogSound },
  { name: "cat", image: catImage, sound: catSound },
  { name: "cow", image: cowImage, sound: cowSound },
  { name: "lion", image: lionImage, sound: lionSound },
];

const LearnSounds: React.FC = () => {
  const navigate = useNavigate();
  const [playing, setPlaying] = React.useState<string | null>(null);

  const playSound = (sound: string, name: string) => {
    setPlaying(name);
    const audio = new Audio(sound);
    audio.onended = () => setPlaying(null);
    audio.play().catch((e) => {
      console.error("Failed to play sound", e);
      setPlaying(null);
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Learn Animal Sounds</h1>
      <p className="text-center mb-8">
        Click on each animal to hear its sound. When you're ready, hit "Let's Play" to start the game.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {animals.map((a) => (
          <AnimalCard
            key={a.name}
            name={a.name}
            image={a.image}
            onClick={() => playSound(a.sound, a.name)}
            disabled={false}
            isCorrect={playing === a.name}
            played={playing === a.name}
          />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button onClick={() => navigate("/game")}>Let's Play!</Button>
      </div>
    </div>
  );
};

export default LearnSounds;
