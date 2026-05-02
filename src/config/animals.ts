/**
 * 🦁 COMPREHENSIVE ANIMAL DATASET
 * 
 * All animals organized by category and difficulty level
 * Used by both Learning Module and Game Module
 * 
 * ASSET STATUS:
 * ✅ = Asset exists
 * ⚠️  = MISSING - needs manual asset addition
 */

// ============================================
// 📥 IMPORTS - EXISTING ASSETS
// ============================================
import dogImage from "@/assets/dog.png";
import catImage from "@/assets/cat.png";
import cowImage from "@/assets/cow.png";
import lionImage from "@/assets/lion.png";
import henImage from "@/assets/hen.png";
import duckImage from "@/assets/duck.png";
import horseImage from "@/assets/horse.png";
import monkeyImage from "@/assets/monkey.png";
import elephantImage from "@/assets/elephant.png";
import goatImage from "@/assets/goat.png";
import pigImage from "@/assets/pig.png";
import bearImage from "@/assets/bear.png";

import dogSound from "@/assets/sounds/dog.wav";
import catSound from "@/assets/sounds/cat.wav";
import cowSound from "@/assets/sounds/cow.wav";
import lionSound from "@/assets/sounds/lion.wav";
import henSound from "@/assets/sounds/hen.mp3";
import duckSound from "@/assets/sounds/duck.mp3";
import horseSound from "@/assets/sounds/horse.mp3";
import monkeySound from "@/assets/sounds/monkey.mp3";
import goatSound from "@/assets/sounds/goat.mp3";
import elephantSound from "@/assets/sounds/elephant.mp3";
import pigSound from "@/assets/sounds/pig.mp3";
import bearSound from "@/assets/sounds/bear.mp3";

// ============================================
// 🎯 ALL ASSETS COMPLETE! ✅
// ============================================
// All 12 animals now have complete image and sound assets.
// New animals added: Pig (semi-familiar), Bear (wild)
// All animals are ready for gameplay and learning module.

// Temporary placeholder paths - replace with actual assets
const MISSING_IMAGE = "⚠️_MISSING_IMAGE";
const MISSING_SOUND = "⚠️_MISSING_SOUND";

// ============================================
// 📋 ANIMAL INTERFACE
// ============================================
export interface Animal {
  name: string;
  emoji: string;
  image: string;
  sound: string;
  category: 'domestic' | 'semi-familiar' | 'wild';
  difficulty: 1 | 2 | 3;
  isMissingAssets?: boolean; // Flag if assets need to be added
}

// ============================================
// 🏠 DOMESTIC ANIMALS (LEVEL 1 - EASY)
// ============================================
export const domesticAnimals: Animal[] = [
  {
    name: "dog",
    emoji: "🐕",
    image: dogImage,
    sound: dogSound,
    category: "domestic",
    difficulty: 1,
  },
  {
    name: "cat",
    emoji: "🐈",
    image: catImage,
    sound: catSound,
    category: "domestic",
    difficulty: 1,
  },
  {
    name: "cow",
    emoji: "🐄",
    image: cowImage,
    sound: cowSound,
    category: "domestic",
    difficulty: 1,
  },
  {
    name: "hen",
    emoji: "🐔",
    image: henImage,
    sound: henSound,
    category: "domestic",
    difficulty: 1,
  },
];

// ============================================
// 🌳 SEMI-FAMILIAR ANIMALS (LEVEL 2 - MEDIUM)
// ============================================
export const semiFamiliarAnimals: Animal[] = [
  {
    name: "duck",
    emoji: "🦆",
    image: duckImage,
    sound: duckSound,
    category: "semi-familiar",
    difficulty: 2,
  },
  {
    name: "horse",
    emoji: "🐴",
    image: horseImage,
    sound: horseSound,
    category: "semi-familiar",
    difficulty: 2,
  },
  {
    name: "goat",
    emoji: "🐐",
    image: goatImage,
    sound: goatSound,
    category: "semi-familiar",
    difficulty: 2,
  },
  {
    name: "pig",
    emoji: "🐷",
    image: pigImage,
    sound: pigSound,
    category: "semi-familiar",
    difficulty: 2,
  },
];

// ============================================
// 🦁 WILD/JUNGLE ANIMALS (LEVEL 3 - HARD)
// ============================================
export const wildAnimals: Animal[] = [
  {
    name: "lion",
    emoji: "🦁",
    image: lionImage,
    sound: lionSound,
    category: "wild",
    difficulty: 3,
  },
  {
    name: "elephant",
    emoji: "🐘",
    image: elephantImage,
    sound: elephantSound,
    category: "wild",
    difficulty: 3,
  },
  {
    name: "monkey",
    emoji: "🐵",
    image: monkeyImage,
    sound: monkeySound,
    category: "wild",
    difficulty: 3,
  },
  {
    name: "bear",
    emoji: "🐻",
    image: bearImage,
    sound: bearSound,
    category: "wild",
    difficulty: 3,
  },
];

// ============================================
// 🎮 ANIMAL SETS BY DIFFICULTY LEVEL
// ============================================

/**
 * Level 1: Domestic animals only (Easy)
 * Includes: Dog, Cat, Cow, Hen
 */
export const level1Animals: Animal[] = domesticAnimals;

/**
 * Level 2: Domestic + Semi-Familiar animals (Medium)
 * Includes: Dog, Cat, Cow + Duck, Horse, Goat
 */
export const level2Animals: Animal[] = [
  ...domesticAnimals,
  ...semiFamiliarAnimals,
];

/**
 * Level 3: All animals including Wild (Hard)
 * Includes: All from Level 1 & 2 + Lion, Elephant, Monkey
 */
export const level3Animals: Animal[] = [
  ...domesticAnimals,
  ...semiFamiliarAnimals,
  ...wildAnimals,
];

// ============================================
// 🎯 GET ANIMALS BY DIFFICULTY
// ============================================
/**
 * Returns animal array by difficulty level
 * Level 1: Domestic only (4 animals)
 * Level 2: Domestic + Semi-Familiar (8 animals)
 * Level 3: All animals (12 animals)
 */
export const getAnimalsByLevel = (level: 1 | 2 | 3): Animal[] => {
  switch (level) {
    case 1:
      return level1Animals;
    case 2:
      return level2Animals;
    case 3:
      return level3Animals;
    default:
      return level1Animals;
  }
};

// ============================================
// 📊 ALL ANIMALS (FOR LEARNING & REFERENCE)
// ============================================
export const allAnimals: Animal[] = [
  ...domesticAnimals,
  ...semiFamiliarAnimals,
  ...wildAnimals,
];

// ============================================
// 🎓 LEARNING CATEGORIES (FOR LEARN SOUNDS PAGE)
// ============================================
/**
 * Three categories for learning module:
 * - Domestic: 4 animals (Level 1)
 * - Semi-Familiar: 3 animals (Level 2)
 * - Wild: 3 animals (Level 3)
 */
export const learningCategories = [
  {
    name: "Domestic Animals",
    emoji: "🏠",
    description: "Level 1 - Common household animals",
    animals: domesticAnimals,
  },
  {
    name: "Semi-Familiar Animals",
    emoji: "🌳",
    description: "Level 2 - Farm and less common animals",
    animals: semiFamiliarAnimals,
  },
  {
    name: "Wild/Jungle Animals",
    emoji: "🦁",
    description: "Level 3 - Jungle and wild animals",
    animals: wildAnimals,
  },
];

// ============================================
// 📄 ASSET STATUS REFERENCE
// ============================================
/**
 * ✅ ALL 12 ANIMALS HAVE COMPLETE ASSETS (100%)
 * 
 * COMPLETE ASSETS (Ready to use):
 * ✅ Images: dog.png, cat.png, cow.png, hen.png, duck.png, horse.png, goat.png, pig.png, lion.png, elephant.png, monkey.png, bear.png
 * ✅ Sounds: dog.wav, cat.wav, cow.wav, hen.mp3, duck.mp3, horse.mp3, goat.mp3, pig.mp3, lion.mp3, elephant.mp3, monkey.mp3, bear.mp3
 * 
 * STATUS SUMMARY:
 * 🟢 Level 1 (Domestic): 100% Complete - 4/4 animals (Dog, Cat, Cow, Hen)
 * 🟢 Level 2 (Semi-Familiar): 100% Complete - 4/4 animals (Duck, Horse, Goat, Pig)
 * 🟢 Level 3 (Wild/Jungle): 100% Complete - 4/4 animals (Lion, Elephant, Monkey, Bear)
 * 🟢 OVERALL: 100% COMPLETE - All 12 animals ready for gameplay! ✨
 * 
 * NEW ANIMALS ADDED:
 * 🐷 Pig - Semi-Familiar Animal (Level 2)
 * 🐻 Bear - Wild Animal (Level 3)
 * 
 * No further action needed - all animals are fully integrated and playable.
 */
