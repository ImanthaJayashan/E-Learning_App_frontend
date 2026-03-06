import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PrimaryButton from "../components/PrimaryButton";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("parentEmail") || "";
    if (saved) {
      setEmail(saved);
      setIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(saved));
    }
  }, []);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setEmail(v);
    setIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
    if (!touched) setTouched(true);
  }

  function handleNext() {
    if (!isValid) return;
    localStorage.setItem("parentEmail", email.trim());
    nav("/quiz");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kidblue via-kidteal to-peach">
      <Navbar />
      <main className="max-w-6xl mx-auto p-8">
        <section className="bg-white/80 backdrop-blur-xl rounded-big p-10 shadow-glow ring-4 ring-kidpurple/20">
          <h1 className="text-5xl font-extrabold text-kidpurple text-center">
            Pick the Letter
          </h1>
          <p className="mt-4 text-center text-lg text-gray-600">
            Short, big letters — perfect for tiny hands. Play tutorial or try
            the quiz.
          </p>
          {/* <div className="mt-8 flex items-center justify-center gap-6">
            <PrimaryButton onClick={() => nav("/quiz")}>
              Start Quiz
            </PrimaryButton>
            <button
              onClick={() =>
                alert("Tutorial coming — play videos & practice writing!")
              }
              className="px-6 py-3 rounded-full bg-kidpink text-white font-bold"
            >
              Tutorial
            </button>
          </div> */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-kidblue/20 p-6 rounded-xl text-center">
              <h3 className="font-bold text-2xl text-kidblue">For kids 4–7</h3>
              <p className="mt-2 text-sm text-gray-600">
                Big letters, simple choices, fun colors.
              </p>
            </div>
            <div className="bg-kidteal/20 p-6 rounded-xl text-center">
              <h3 className="font-bold text-2xl text-kidteal">
                10-question quiz
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Each question has 3 choices and a big board to write the missing
                letter.
              </p>
            </div>
            <div className="bg-kidpurple/20 p-6 rounded-xl text-center">
              <h3 className="font-bold text-2xl text-kidpurple">Reports</h3>
              <p className="mt-2 text-sm text-gray-600">
                Simple progress tracking for parents & teachers.
              </p>
            </div>
          </div>
          <aside className="bg-kidpurple/5 p-4 mt-4 rounded-xl">
            <h3 className="font-bold text-2xl text-kidpurple">
              Why add an email?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Parents get an easy-to-read summary with a helpful heatmap and
              suggestions to support practice.
            </p>
          </aside>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Parent / Guardian Email
            </label>
            <div className="mt-2 flex gap-3">
              <input
                aria-label="parent-email"
                value={email}
                onChange={onChange}
                onBlur={() => setTouched(true)}
                placeholder="parent@example.com"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-kidpurple"
                type="email"
              />
              {isValid ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md"
                >
                  Next
                </button>
              ) : (
                <div className="px-6 py-3 rounded-full bg-gray-200 text-gray-500 flex items-center">
                  <span className="text-sm">Enter email to continue</span>
                </div>
              )}
            </div>
            {touched && !isValid && email.length > 0 && (
              <p className="mt-2 text-sm text-red-500">
                Please enter a valid email address.
              </p>
            )}
          </div>{" "}
        </section>
      </main>
    </div>
  );
}
