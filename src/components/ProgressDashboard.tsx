import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  latestSession,
  isOpen,
  onClose,
}) => {
  const [historicalData, setHistoricalData] = useState<HistoricalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper functions for parent-friendly labels
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
    switch (prediction) {
      case 'LOW_RISK':
      case 'LOW':
        return 'Normal';
      case 'MODERATE_RISK':
      case 'MODERATE':
        return 'Needs Attention';
      case 'HIGH_RISK':
      case 'HIGH':
        return 'Requires Support';
      default:
        return prediction;
    }
  };

  const getReactionTimeCategory = (reactionTime: number) => {
    if (reactionTime < 2000) return "Fast";
    if (reactionTime <= 4000) return "Moderate";
    return "Slow";
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistoricalData();
    }
  }, [isOpen]);

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/predict/historical-data");
      const data = await response.json();
      if (data.success) {
        setHistoricalData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch historical data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <p>Loading progress data...</p>
        </div>
      </div>
    );
  }

  if (historicalData.length === 0 && !latestSession) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Progress Dashboard</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No progress data available yet</p>
            <p className="text-gray-400 text-sm mt-2">Complete a game session to see your progress here</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = [
    ...historicalData.slice(-4).map((record, index) => ({
      session: `Session ${historicalData.length - 4 + index + 1}`,
      accuracy: record.accuracy * 100,
      reactionTime: record.averageReactionTime,
      reactionTimeCategory: getReactionTimeCategory(record.averageReactionTime),
      date: record.date,
    })),
    ...(latestSession ? [{
      session: "Latest Session",
      accuracy: latestSession.accuracy * 100,
      reactionTime: latestSession.averageReactionTime || null,
      reactionTimeCategory: latestSession.averageReactionTime ? getReactionTimeCategory(latestSession.averageReactionTime) : null,
      date: latestSession.date,
    }] : []),
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Progress Dashboard</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {latestSession ? (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Child Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{getPerformanceCategory(latestSession.accuracy * 100)}</div>
                    <div className="text-sm text-gray-600">{(latestSession.accuracy * 100).toFixed(1)}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Response Speed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {latestSession.averageReactionTime > 0 ? getResponseSpeedCategory(latestSession.averageReactionTime) : 'Not available'}
                    </div>
                    {latestSession.averageReactionTime > 0 && (
                      <div className="text-sm text-gray-600">{(latestSession.averageReactionTime / 1000).toFixed(1)}s</div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Highest Level Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Level {latestSession.levelReached}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Auditory Response Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{getAuditoryStatus(latestSession.prediction)}</div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="col-span-4">
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">No recent session data available</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Accuracy Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Progress</CardTitle>
              <CardDescription>Child's accuracy improvement across recent sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" />
                  <YAxis label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]}
                    labelFormatter={(label: string, payload: any[]) => {
                      const data = payload[0]?.payload;
                      return data ? `${label} (${data.date})` : label;
                    }}
                  />
                  <Bar dataKey="accuracy" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Reaction Time Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Response Speed Trends</CardTitle>
              <CardDescription>Response speed categories across sessions (Fast: &lt;2s, Moderate: 2-4s, Slow: &gt;4s)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.filter(d => d.reactionTime !== null)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" />
                  <YAxis 
                    type="category" 
                    dataKey="reactionTimeCategory"
                    label={{ value: 'Response Speed', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip
                    formatter={(value: string) => [value, 'Response Speed']}
                    labelFormatter={(label: string, payload: any[]) => {
                      const data = payload[0]?.payload;
                      return data ? `${label} (${data.date})` : label;
                    }}
                  />
                  <Line type="monotone" dataKey="reactionTimeCategory" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
