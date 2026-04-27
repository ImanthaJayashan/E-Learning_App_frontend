import { useRef, useState, useEffect } from "react";
import { ALL_QUESTIONS, type Question } from "../../data/simpleQuestions";
import KidCanvas, {
  type KidCanvasRef,
} from "../../components/writesense/KidCanvas";
import { useNavigate } from "react-router-dom";
import { BASEURL } from "../../config/CONFIG";

const LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "J",
  "L",
  "N",
  "O",
  "P",
  "R",
  "S",
  "U",
  "V",
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Quiz() {
  const canvasRef = useRef<KidCanvasRef>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [predictionDetails, setPredictionDetails] = useState<any>(null);
  const shuffledLetters = useRef<string[]>(shuffle(LETTERS));
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [weakLetters, setWeakLetters] = useState<string[]>([]);
  const navigate = useNavigate();

  const parentemail = localStorage.getItem("parentEmail") || "";
  if (!parentemail) {
    navigate("/write-sense/landing-page");
  }

  // ALL HOOKS MUST BE AT THE TOP - before any conditional returns
  useEffect(() => {
    setQuestions(shuffle(ALL_QUESTIONS).slice(0, LETTERS.length));
  }, []);

  useEffect(() => {
    if (quizComplete) {
      navigate("/write-sense/results", {
        state: {
          score,
          total: questions.length,
          correctLetters,
          weakLetters,
        },
      });
    }
  }, [
    quizComplete,
    navigate,
    score,
    questions.length,
    correctLetters,
    weakLetters,
  ]);

  // NOW we can have conditional returns
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading…
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const wordArray = currentQuestion.word.split("");
  const correctAnswer = wordArray[currentQuestion.missingIndex];

  const handleRetry = () => {
    canvasRef.current?.clear();
  };

  const handleSubmit = async () => {
    const imageBlob = await canvasRef.current?.getImageData();
    if (!imageBlob) {
      alert("Please draw something first!");
      return;
    }

    setIsVerifying(true);

    try {
      const formData = new FormData();
      formData.append("image", imageBlob, "letter.png");
      formData.append("actual_letter", correctAnswer);
      formData.append("parent_email", parentemail);

      const response = await fetch(BASEURL + "/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        const predictedLetter = data.predicted_letter;
        const correct = predictedLetter === correctAnswer;

        setIsCorrect(correct);
        setPredictionDetails(data);
        setShowResultModal(true);

        if (correct) {
          setScore(score + 1);
          setCorrectLetters((prev) => [...prev, correctAnswer]);
        }
      } else {
        setWeakLetters((prev) => [...prev, correctAnswer]);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Prediction error:", error);
      alert(
        "Sorry, there was an error. Please make sure the Flask server is running on port 5000!",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNext = () => {
    setShowResultModal(false);
    setPredictionDetails(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      canvasRef.current?.clear();
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestart = () => {
    const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 10));
    setCurrentQuestionIndex(0);
    setShowResultModal(false);
    setScore(0);
    setQuizComplete(false);
    setPredictionDetails(null);
    canvasRef.current?.clear();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 p-6 relative">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">✏️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">WriteSense</h1>
          </div>
          <button
            onClick={handleRestart}
            className="px-6 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all font-semibold text-gray-700"
          >
            Restart Quiz
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr_400px] gap-6">
        {/* Left Panel - Word & Options */}
        <div className="flex flex-col gap-6">
          {/* Word Display */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="flex justify-center items-center gap-2 text-5xl font-black">
              {wordArray.map((letter, idx) => (
                <span key={idx}>
                  {idx === currentQuestion.missingIndex ? (
                    <span className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl text-blue-400 text-3xl border-4 border-dashed border-blue-300">
                      ?
                    </span>
                  ) : (
                    <span className="text-gray-800">{letter}</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Letter Options */}
          <div className="flex flex-col gap-4">
            {currentQuestion.options.map((letter, idx) => {
              const colors = [
                "bg-blue-400 hover:bg-blue-500",
                "bg-green-400 hover:bg-green-500",
                "bg-orange-400 hover:bg-orange-500",
              ];

              return (
                <button
                  key={letter}
                  disabled={showResultModal}
                  className={`w-full h-20 rounded-2xl ${colors[idx]} text-white text-4xl font-extrabold shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Panel - Drawing Area */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-gradient-to-br from-purple-200 to-pink-200 rounded-3xl shadow-2xl p-8 border-4 border-purple-300">
              <div className="bg-white rounded-3xl p-4 shadow-inner">
                <KidCanvas ref={canvasRef} width={500} height={400} />
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handleRetry}
                  disabled={isVerifying}
                  className="px-8 py-3 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                >
                  🔄 Retry
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isVerifying}
                  className="px-8 py-3 rounded-full bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                >
                  {isVerifying ? "⏳ Checking..." : "➡️ Next"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Info */}
        <div className="flex flex-col gap-6">
          {/* Question Info */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="text-center mb-4">
              <span className="inline-block px-5 py-2 bg-purple-100 text-purple-600 rounded-full font-bold text-sm">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <div className="text-center">
              <span className="text-xl font-bold text-gray-700">
                Score: {score}
              </span>
            </div>
          </div>

          {/* Image */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden h-64">
            <img
              src={currentQuestion.image}
              alt={currentQuestion.word}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResultModal && predictionDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
            <div className="text-center mb-6">
              <div className="text-7xl mb-4">{predictionDetails.emoji}</div>
              <h2 className="text-3xl font-bold text-purple-700">
                {predictionDetails.kid_message}
              </h2>
              <p className="mt-4 text-lg">
                AI saw:{" "}
                <span className="font-bold text-2xl">
                  {predictionDetails.predicted_letter}
                </span>
              </p>
              <p className="text-gray-600">
                Confidence: {predictionDetails.confidence}
              </p>
              {predictionDetails.confidence_level === "high" && (
                <p className="text-green-600 font-bold">
                  Confidence Level: {predictionDetails.confidence_level}
                </p>
              )}

              {predictionDetails.confidence_level === "medium" && (
                <p className="text-blue-600 font-bold">
                  Confidence Level: {predictionDetails.confidence_level}
                </p>
              )}

              {predictionDetails.confidence_level === "low" && (
                <p className="text-red-600 font-bold">
                  Confidence Level: {predictionDetails.confidence_level}
                </p>
              )}
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl hover:scale-105"
            >
              {currentQuestionIndex < questions.length - 1
                ? "Next ➡️"
                : "Finish 🎉"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
