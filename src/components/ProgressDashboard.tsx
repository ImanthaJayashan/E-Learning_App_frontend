import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const HF_SPACE_URL = "https://yasithadulara-animal-sound-safari-backend.hf.space";

interface RawAttempt {
  session_id: string;
  timestamp?: string;
  is_correct: boolean;
  response_time_ms?: number;
  level?: number;
}

interface HistoricalRecord {
  date: string;
  accuracy: number;
  averageReactionTime: number;
  levelReached: number;
  weakAnimals: string[];
  sessionId: string;
  totalAttempts: number;
  prediction: string;
}

interface ProgressDashboardProps {
  latestSession: any;
  isOpen: boolean;
  onClose: () => void;
}

const getPerformanceCategory = (accuracy: number) => {
  if (accuracy >= 90) return "Excellent";
  if (accuracy >= 70) return "Good";
  return "Needs Improvement";
};

const getResponseSpeedCategory = (reactionTime: number) => {
  if (reactionTime < 2000) return "Fast";
  if (reactionTime <= 4000) return "Moderate";
  return "Slow";
};

const getAuditoryStatus = (prediction: string) => {
  switch (prediction?.toUpperCase()) {
    case "LOW_RISK":
    case "LOW":
      return "Normal";
    case "MODERATE_RISK":
    case "MODERATE":
      return "Needs Attention";
    case "HIGH_RISK":
    case "HIGH":
      return "Requires Support";
    default:
      return prediction || "N/A";
  }
};

function parseGameLogs(raw: Record<string, RawAttempt[]>): HistoricalRecord[] {
  return Object.entries(raw)
    .map(([sessionId, attempts]) => {
      if (!Array.isArray(attempts) || attempts.length === 0) return null;
      const correct = attempts.filter((a) => a.is_correct).length;
      const accuracy = correct / attempts.length;
      const timings = attempts.map((a) => a.response_time_ms ?? 0).filter((t) => t > 0);
      const averageReactionTime =
        timings.length > 0 ? timings.reduce((s, t) => s + t, 0) / timings.length : 0;
      const levelReached = Math.max(...attempts.map((a) => a.level ?? 1));
      const firstTimestamp = attempts[0]?.timestamp ?? new Date().toISOString();
      return {
        sessionId,
        date: firstTimestamp,
        accuracy,
        averageReactionTime,
        levelReached,
        weakAnimals: [],
        totalAttempts: attempts.length,
        prediction: "",
      } as HistoricalRecord;
    })
    .filter(Boolean) as HistoricalRecord[];
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ latestSession, isOpen, onClose }) => {
  const [historicalData, setHistoricalData] = useState<HistoricalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<"api" | "logs" | "none">("none");

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchHistoricalData();
    }
  }, [isOpen]);

  const fetchHistoricalData = async () => {
    // 1. Try the prediction API first
    try {
      const res = await fetch(`${HF_SPACE_URL}/api/predict/historical-data`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setHistoricalData(data.data);
          setDataSource("api");
          setLoading(false);
          return;
        }
      }
    } catch {
      // fall through
    }

    // 2. Fallback: fetch game_logs.json directly from HuggingFace Space repo
    try {
      const logsRes = await fetch(
        `https://huggingface.co/spaces/YasithaDulara/animal-sound-safari-backend/resolve/main/game_analytics/game_logs.json`,
        { cache: "no-store" }
      );
      if (logsRes.ok) {
        const raw: Record<string, RawAttempt[]> = await logsRes.json();
        const parsed = parseGameLogs(raw);
        parsed.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setHistoricalData(parsed);
        setDataSource(parsed.length > 0 ? "logs" : "none");
      }
    } catch (err) {
      console.error("Failed to fetch game_logs.json:", err);
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  const ModalWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white opacity-100 shadow-2xl rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
        <div className="flex justify-between items-center p-6 border-b bg-white sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-gray-800">Progress Dashboard</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">✕</button>
        </div>
        <div className="p-6 overflow-y-auto bg-white">{children}</div>
      </div>
    </div>
  );

  if (loading) {
    return <ModalWrapper><p className="text-center py-10">Loading progress data…</p></ModalWrapper>;
  }

  if (historicalData.length === 0 && !latestSession) {
    return (
      <ModalWrapper>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg font-medium">No progress data available yet</p>
          <p className="text-gray-400 text-sm mt-2">Complete a game session to see your progress here</p>
        </div>
      </ModalWrapper>
    );
  }

  const recentHistory = historicalData.slice(-4);

  const chartData = [
    ...recentHistory.map((record, index) => {
      const absoluteIndex = historicalData.length - recentHistory.length + index + 1;
      return {
        session: `Session ${absoluteIndex}`,
        accuracy: parseFloat((record.accuracy * 100).toFixed(1)),
        reactionTime: record.averageReactionTime > 0 ? record.averageReactionTime : null,
        date: record.date,
      };
    }),
    ...(latestSession
      ? [{
          session: "Latest",
          accuracy: parseFloat((latestSession.accuracy * 100).toFixed(1)),
          reactionTime: latestSession.averageReactionTime || null,
          date: latestSession.date,
        }]
      : []),
  ];

  return (
    <ModalWrapper>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {latestSession && (
            <>
              <Card className="bg-blue-50/50 border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-600">Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{getPerformanceCategory(latestSession.accuracy * 100)}</div>
                  <div className="text-sm text-gray-600">{(latestSession.accuracy * 100).toFixed(1)}% Accuracy</div>
                </CardContent>
              </Card>

              <Card className="bg-green-50/50 border-green-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-600">Response Speed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {latestSession.averageReactionTime > 0 ? getResponseSpeedCategory(latestSession.averageReactionTime) : "N/A"}
                  </div>
                  {latestSession.averageReactionTime > 0 && (
                    <div className="text-sm text-gray-600">{(latestSession.averageReactionTime / 1000).toFixed(1)}s avg</div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-purple-50/50 border-purple-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-purple-600">Max Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">Level {latestSession.levelReached}</div>
                  <div className="text-sm text-gray-600">Highest reached</div>
                </CardContent>
              </Card>

              <Card className="bg-orange-50/50 border-orange-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-orange-600">Auditory Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{getAuditoryStatus(latestSession.prediction)}</div>
                  <div className="text-sm text-gray-600">Risk Assessment</div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {dataSource === "logs" && (
          <p className="text-xs text-gray-400 -mt-2">* Historical data loaded from game logs</p>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Accuracy Over Time</CardTitle>
              <CardDescription>
                Percentage of correct answers — last {recentHistory.length} sessions + current
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="session" axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    formatter={(value: number) => [`${value.toFixed(1)}%`, "Accuracy"]}
                    labelFormatter={(label) => {
                      const entry = chartData.find((d) => d.session === label);
                      if (entry?.date) return `${label} · ${new Date(entry.date).toLocaleDateString()}`;
                      return label;
                    }}
                  />
                  <Bar dataKey="accuracy" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Speed Trends</CardTitle>
              <CardDescription>Average reaction time (ms)</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.filter((d) => d.reactionTime !== null)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="session" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    formatter={(value: number) => [`${(value / 1000).toFixed(2)}s`, "Reaction Time"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="reactionTime"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 6, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ProgressDashboard;