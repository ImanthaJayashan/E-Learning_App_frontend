export interface Question {
  word: string;
  missingIndex: number;
  options: string[];
  image: string;
}

const img = (id: string) =>
  `https://images.unsplash.com/${id}?w=400&h=300&fit=crop`;

// Letters to cover: A, B, C, D, E, F, G, H, J, L, N, O, P, R, S, U, V
// Strategy: Create one question per letter, ensuring each letter appears exactly once

export const ALL_QUESTIONS: Question[] = [
  // ===== A ===== (Letter A)
  {
    word: "CAT",
    missingIndex: 1,
    options: ["A", "O", "E"],
    image: img("photo-1514888286974-6c03e2ca1dba"),
  },

  // ===== B ===== (Letter B)
  {
    word: "BAG",
    missingIndex: 0,
    options: ["B", "D", "P"],
    image: img("photo-1553062407-98eeb64c6a62"),
  },

  // ===== C ===== (Letter C)
  {
    word: "CAR",
    missingIndex: 0,
    options: ["C", "G", "K"],
    image: img("photo-1552519507-da3b142c6e3d"),
  },

  // ===== D ===== (Letter D)
  {
    word: "DOG",
    missingIndex: 0,
    options: ["D", "B", "P"],
    image: img("photo-1587300003388-59208cc962cb"),
  },

  // ===== E ===== (Letter E)
  {
    word: "BED",
    missingIndex: 1,
    options: ["E", "A", "O"],
    image: img("photo-1505693416388-ac5ce068fe85"),
  },

  // ===== F ===== (Letter F)
  {
    word: "FOX",
    missingIndex: 0,
    options: ["F", "P", "V"],
    image: img("photo-1474511320723-9a56873867b5"),
  },

  // ===== G ===== (Letter G)
  {
    word: "PIG",
    missingIndex: 2,
    options: ["G", "C", "D"],
    image: img("photo-1516467508483-a7212febe31a"),
  },

  // ===== H ===== (Letter H)
  {
    word: "HEN",
    missingIndex: 0,
    options: ["H", "F", "N"],
    image: img("photo-1548550023-2bdb3c5beed7"),
  },

  // ===== J ===== (Letter J)
  {
    word: "JET",
    missingIndex: 0,
    options: ["J", "G", "L"],
    image: img("photo-1540962351504-03099e0a754b"),
  },
  // ===== L ===== (Letter L)
  {
    word: "MAP",
    missingIndex: 2,
    options: ["L", "B", "J"],
    image: img("photo-1524661135-423995f22d0b"),
  },

  // ===== N ===== (Letter N)
  {
    word: "PAN",
    missingIndex: 2,
    options: ["N", "H", "V"],
    image: img("photo-1565557623262-b51c2513a641"),
  },

  // ===== O ===== (Letter O)
  {
    word: "COW",
    missingIndex: 1,
    options: ["O", "A", "U"],
    image: img("photo-1500595046743-cd271d694d30"),
  },

  // ===== P ===== (Letter P)
  {
    word: "PEN",
    missingIndex: 0,
    options: ["P", "B", "F"],
    image: img("photo-1455390582262-044cdead277a"),
  },

  // ===== R ===== (Letter R)
  {
    word: "RAT",
    missingIndex: 0,
    options: ["R", "N", "L"],
    image: img("photo-1425082661705-1834bfd09dca"),
  },

  // ===== S ===== (Letter S)
  {
    word: "SEA",
    missingIndex: 0,
    options: ["S", "C", "F"],
    image: img("photo-1505142468610-359e7d316be0"),
  },

  // ===== U ===== (Letter U)
  {
    word: "BUS",
    missingIndex: 1,
    options: ["U", "O", "A"],
    image: img("photo-1570125909232-eb263c188f7e"),
  },

  // ===== V ===== (Letter V)
  {
    word: "VAN",
    missingIndex: 0,
    options: ["V", "N", "F"],
    image: img("photo-1527786356703-4b100091cd2c"),
  },
];
