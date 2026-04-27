import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { BASEURL } from "../../config/CONFIG";

export default function Results() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [emailStatus, setEmailStatus] = useState<"sending" | "sent" | "error">(
    "sending",
  );
  const [summaryData, setSummaryData] = useState<any>(null);
  const emailSentRef = useRef(false); // Prevent duplicate sends

  const parentEmail = localStorage.getItem("parentEmail") || "";

  useEffect(() => {
    // Automatically fetch summary and send email when component mounts
    // Only send once using ref
    if (parentEmail && !emailSentRef.current) {
      emailSentRef.current = true;
      fetchSummaryAndSendEmail();
    }
  }, [parentEmail]);

  const fetchSummaryAndSendEmail = async () => {
    try {
      // First fetch the summary
      const summaryResponse = await fetch(
        `${BASEURL}/get-summary/${encodeURIComponent(parentEmail)}`,
      );

      if (summaryResponse.ok) {
        const data = await summaryResponse.json();
        setSummaryData(data);
      }

      // Then automatically send the email
      const emailResponse = await fetch(`${BASEURL}/send-summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent_email: parentEmail,
        }),
      });

      if (emailResponse.ok) {
        setEmailStatus("sent");
      } else {
        const error = await emailResponse.json();
        console.error("Email sending failed:", error);
        setEmailStatus("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setEmailStatus("error");
    }
  };

  const handleRetry = () => {
    emailSentRef.current = false; // Reset the ref to allow retry
    setEmailStatus("sending");
    fetchSummaryAndSendEmail();
  };

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        No results found 😅
      </div>
    );
  }

  const { score, total, correctLetters, weakLetters } = state;
  const accuracy = Math.round((score / total) * 100);

  // Get letter performance heatmap data
  const letterPerformance = summaryData?.letter_performance || {};
  const allLetters = [
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

  const getLetterColor = (letter: string) => {
    const perf = letterPerformance[letter];
    if (!perf) return "bg-gray-100 text-gray-400";

    const acc = perf.accuracy;
    if (acc >= 80) return "bg-green-500 text-white";
    if (acc >= 60) return "bg-yellow-400 text-white";
    return "bg-red-400 text-white";
  };

  const getLetterTooltip = (letter: string) => {
    const perf = letterPerformance[letter];
    if (!perf) return "Not attempted";

    return `${perf.accuracy.toFixed(0)}% accuracy${perf.flipped > 0 ? " (flipped)" : ""}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-yellow-200 flex items-center justify-center p-6">
      <div className="w-full max-w-7xl bg-white rounded-[3rem] shadow-2xl p-10 space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="text-6xl mb-3">🏆</div>
          <h1 className="text-5xl font-extrabold text-purple-600 mb-2">
            Quiz Complete!
          </h1>
          <p className="text-xl text-gray-600">
            Great job completing the handwriting quiz! 🎉
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Score Card */}
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl p-8 text-center shadow-lg">
            <div className="text-6xl font-extrabold text-purple-600 mb-2">
              {score}
              <span className="text-3xl text-purple-400">/{total}</span>
            </div>
            <p className="text-lg font-semibold text-purple-700">
              Letters Correct
            </p>
          </div>

          {/* Accuracy Card */}
          <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-3xl p-8 text-center shadow-lg">
            <div className="text-6xl font-extrabold text-green-600 mb-2">
              {accuracy}%
            </div>
            <p className="text-lg font-semibold text-green-700">Accuracy</p>
          </div>

          {/* Flipped Letters Card */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl p-8 text-center shadow-lg">
            <div className="text-6xl font-extrabold text-blue-600 mb-2">
              {summaryData?.flipped_attempts || 0}
            </div>
            <p className="text-lg font-semibold text-blue-700">
              Mirror Writing
            </p>
          </div>
        </div>

        {/* Letter Performance Heatmap */}
        <div className="bg-gray-50 rounded-3xl p-8 shadow-inner">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📊 Letter Performance Heatmap
          </h2>
          <div className="grid grid-cols-9 gap-3 max-w-4xl mx-auto">
            {allLetters.map((letter) => {
              const perf = letterPerformance[letter];
              return (
                <div
                  key={letter}
                  className={`relative group aspect-square rounded-xl ${getLetterColor(letter)} flex items-center justify-center text-2xl font-extrabold shadow-md transition-all hover:scale-110 cursor-pointer`}
                  title={getLetterTooltip(letter)}
                >
                  {letter}
                  {perf && perf.flipped > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      🔄
                    </span>
                  )}

                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    {getLetterTooltip(letter)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded"></div>
              <span>Strong (80%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-400 rounded"></div>
              <span>Good (60-79%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-400 rounded"></div>
              <span>Practice (&lt;60%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-100 rounded"></div>
              <span>Not attempted</span>
            </div>
          </div>
        </div>

        {/* Letter Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strong Letters */}
          <div className="bg-green-50 rounded-3xl p-6 shadow-lg border-2 border-green-200">
            <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
              💚 Strong Letters
            </h3>
            <div className="flex flex-wrap gap-3">
              {correctLetters.length > 0 ? (
                correctLetters.map((l: string) => (
                  <span
                    key={l}
                    className="w-14 h-14 flex items-center justify-center rounded-2xl bg-green-500 text-white text-2xl font-extrabold shadow-md"
                  >
                    {l}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">Keep practicing!</p>
              )}
            </div>
          </div>

          {/* Practice More */}
          <div className="bg-orange-50 rounded-3xl p-6 shadow-lg border-2 border-orange-200">
            <h3 className="text-2xl font-bold text-orange-700 mb-4 flex items-center gap-2">
              💡 Practice More
            </h3>
            <div className="flex flex-wrap gap-3">
              {weakLetters.length > 0 ? (
                weakLetters.map((l: string) => (
                  <span
                    key={l}
                    className="w-14 h-14 flex items-center justify-center rounded-2xl bg-orange-400 text-white text-2xl font-extrabold shadow-md"
                  >
                    {l}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">All perfect! 🌟</p>
              )}
            </div>
          </div>
        </div>

        {/* Email Status Section */}
        <div
          className={`rounded-3xl p-8 shadow-lg border-2 ${emailStatus === "sent"
              ? "bg-green-50 border-green-300"
              : emailStatus === "error"
                ? "bg-red-50 border-red-300"
                : "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
            }`}
        >
          {emailStatus === "sending" && (
            <>
              <div className="text-center">
                <div className="text-5xl mb-4 animate-pulse">📧</div>
                <h3 className="text-2xl font-bold text-purple-700 mb-2">
                  Sending Detailed Report...
                </h3>
                <p className="text-gray-600">
                  Generating comprehensive AI analysis and sending to:{" "}
                  <strong>{parentEmail}</strong>
                </p>
                <div className="mt-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              </div>
            </>
          )}

          {emailStatus === "sent" && (
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-green-700 mb-2">
                Email Sent Successfully!
              </h3>
              <p className="text-gray-600">
                A detailed handwriting analysis report with AI-generated
                insights and practice suggestions has been sent to{" "}
                <strong>{parentEmail}</strong>
              </p>
              <p className="text-sm text-gray-500 mt-3">
                Please check your inbox (and spam folder if needed)
              </p>
            </div>
          )}

          {emailStatus === "error" && (
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-red-700 mb-2">
                Email Sending Failed
              </h3>
              <p className="text-gray-600 mb-4">
                We couldn't send the email to <strong>{parentEmail}</strong>
              </p>
              <button
                onClick={handleRetry}
                className="px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 pt-4">
          <button
            onClick={() => navigate("/write-sense/quiz")}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-extrabold text-xl shadow-xl hover:scale-105 transition-all"
          >
            🔄 Play Again
          </button>

          <button
            onClick={() => navigate("/write-sense/landing-page")}
            className="px-10 py-4 rounded-full bg-white border-4 border-purple-400 text-purple-600 font-extrabold text-xl shadow-xl hover:scale-105 transition-all"
          >
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
}
