import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ParentsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"eye" | "writing" | "reading" | "auditory" | "insights" | "detailed">("eye");
  const [latestEyeResult, setLatestEyeResult] = useState<any>(null);
  const [eyeStatus, setEyeStatus] = useState("Waiting for detection...");
  const [learningStats, setLearningStats] = useState({
    circle: { ms: 0, visits: 0, lastVisit: null as string | null },
    square: { ms: 0, visits: 0, lastVisit: null as string | null },
    triangle: { ms: 0, visits: 0, lastVisit: null as string | null },
    star: { ms: 0, visits: 0, lastVisit: null as string | null },
    lastUpdated: null as string | null,
  });

  const apiBase = (import.meta as any).env?.VITE_BACKEND_URL?.replace(/\/$/, "") || "";
  const latestUrl = apiBase ? `${apiBase}/latest` : "/api/latest";

  useEffect(() => {
    if (activeTab !== "eye") return;

    let isMounted = true;
    const fetchLatest = async () => {
      try {
        const res = await fetch(latestUrl, { cache: "no-store" });
        if (!res.ok) throw new Error("No data");
        const data = await res.json();
        if (!isMounted) return;
        setLatestEyeResult(data);
        setEyeStatus("Live updates");
      } catch {
        if (!isMounted) return;
        const cached = localStorage.getItem("latestEyeDetection");
        if (cached) {
          setLatestEyeResult(JSON.parse(cached));
          setEyeStatus("Local cache");
        } else {
          setLatestEyeResult(null);
          setEyeStatus("Waiting for detection...");
        }
      }
    };

    fetchLatest();
    const id = window.setInterval(fetchLatest, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(id);
    };
  }, [activeTab, latestUrl]);

  useEffect(() => {
    const readLearningStats = () => {
      const circleMs = Number(localStorage.getItem("learningTime_circle") || "0");
      const squareMs = Number(localStorage.getItem("learningTime_square") || "0");
      const triangleMs = Number(localStorage.getItem("learningTime_triangle") || "0");
      const starMs = Number(localStorage.getItem("learningTime_star") || "0");

      const circleVisits = Number(localStorage.getItem("learningVisits_circle") || "0");
      const squareVisits = Number(localStorage.getItem("learningVisits_square") || "0");
      const triangleVisits = Number(localStorage.getItem("learningVisits_triangle") || "0");
      const starVisits = Number(localStorage.getItem("learningVisits_star") || "0");

      const circleLast = localStorage.getItem("learningLastVisit_circle");
      const squareLast = localStorage.getItem("learningLastVisit_square");
      const triangleLast = localStorage.getItem("learningLastVisit_triangle");
      const starLast = localStorage.getItem("learningLastVisit_star");

      setLearningStats({
        circle: { ms: circleMs, visits: circleVisits, lastVisit: circleLast },
        square: { ms: squareMs, visits: squareVisits, lastVisit: squareLast },
        triangle: { ms: triangleMs, visits: triangleVisits, lastVisit: triangleLast },
        star: { ms: starMs, visits: starVisits, lastVisit: starLast },
        lastUpdated: localStorage.getItem("learningLastUpdated"),
      });
    };

    readLearningStats();
    const id = window.setInterval(readLearningStats, 5000);
    return () => window.clearInterval(id);
  }, []);

  const formatDuration = (ms: number) => {
    if (!ms) return "0 min";
    if (ms < 60000) return "<1 min";
    const minutes = Math.round(ms / 60000);
    return `${minutes} min`;
  };

  const formatLastVisit = (iso: string | null) => {
    if (!iso) return "Never";
    return new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Colombo'
    });
  };

  const StatCard = ({ icon, title, value, change, color }: any) => (
    <div style={{
      background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
      border: `2px solid ${color}40`,
      padding: "20px",
      borderRadius: "16px",
      transition: "all 0.3s ease",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 24px ${color}30`;
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <span style={{ fontSize: "2rem" }}>{icon}</span>
        <span style={{ fontSize: "0.75rem", color: change > 0 ? "#10b981" : "#ef4444", fontWeight: "bold" }}>
          {change > 0 ? "↑" : "↓"} {Math.abs(change)}%
        </span>
      </div>
      <h4 style={{ margin: "0 0 8px 0", color: "#333", fontSize: "0.9rem", fontWeight: "600" }}>{title}</h4>
      <p style={{ margin: "0", color: color, fontSize: "1.8rem", fontWeight: "bold" }}>{value}</p>
    </div>
  );

  const ProgressBar = ({ label, percentage, color }: any) => (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ color: "#333", fontWeight: "500", fontSize: "0.9rem" }}>{label}</span>
        <span style={{ color: color, fontWeight: "bold", fontSize: "0.85rem" }}>{percentage}%</span>
      </div>
      <div style={{
        width: "100%",
        height: "8px",
        backgroundColor: "#e5e7eb",
        borderRadius: "4px",
        overflow: "hidden"
      }}>
        <div style={{
          width: `${percentage}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${color}80, ${color})`,
          borderRadius: "4px",
          transition: "width 0.4s ease"
        }} />
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero Section */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "60px 20px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          top: "-100px",
          right: "-100px"
        }} />
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1
        }}>
          <h1 style={{
            fontSize: "3rem",
            fontWeight: "bold",
            marginBottom: "10px",
            fontFamily: "'Fredoka One', 'Comic Sans MS', sans-serif"
          }}>
            👋 Welcome Back!
          </h1>
          <p style={{ fontSize: "1.2rem", opacity: "0.9", marginBottom: "20px" }}>
            Emma's Learning Journey is Amazing! Keep up the fantastic work.
          </p>
          <div style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            {[
              { emoji: "🎉", text: "2 Achievements Unlocked" },
              { emoji: "🔥", text: "7-Day Streak" },
              { emoji: "⭐", text: "85/100 Rating" }
            ].map((badge, idx) => (
              <div key={idx} style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                padding: "10px 20px",
                borderRadius: "24px",
                fontSize: "0.95rem",
                fontWeight: "600",
                backdropFilter: "blur(10px)"
              }}>
                {badge.emoji} {badge.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        {/* Quick Stats - Changes based on active tab */}
        <div style={{ marginBottom: "50px" }}>
          <h2 style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: "24px"
          }}>
            Quick Overview - {
              activeTab === "eye" ? "👁️ Eye Health & Vision" :
              activeTab === "writing" ? "✏️ Writing Issues" :
              activeTab === "reading" ? "📖 Reading & Speech" :
              "👂 Auditory Response"
            }
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px"
          }}>
            {activeTab === "eye" && (
              <>
                <StatCard 
                  icon="👁️" 
                  title="Eye Health Status" 
                  value={
                    latestEyeResult 
                      ? (latestEyeResult.label === "normal_eye" ? "Excellent" : "Needs Care")
                      : "Pending"
                  }
                  change={latestEyeResult ? (latestEyeResult.label === "normal_eye" ? 8 : -5) : 0}
                  color="#0284c7" 
                />
                <StatCard 
                  icon="🎯" 
                  title="Latest Detection" 
                  value={latestEyeResult ? latestEyeResult.label.replace(/_/g, " ").toUpperCase() : "No Data"}
                  change={0}
                  color="#f59e0b" 
                />
                <StatCard 
                  icon="📊" 
                  title="Confidence Score" 
                  value={latestEyeResult ? `${(latestEyeResult.confidence * 100).toFixed(0)}%` : "N/A"}
                  change={latestEyeResult ? Math.round((latestEyeResult.confidence - 0.5) * 20) : 0}
                  color="#10b981" 
                />
                <StatCard 
                  icon="⏱️" 
                  title="Last Update" 
                  value={
                    latestEyeResult && latestEyeResult.timestamp
                      ? new Date(latestEyeResult.timestamp).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true
                        })
                      : "N/A"
                  }
                  change={0}
                  color="#ec4899" 
                />
              </>
            )}

            {activeTab === "writing" && (
              <>
                <StatCard icon="✏️" title="Writing Skills" value="Good" change={12} color="#f59e0b" />
                <StatCard icon="🖊️" title="Handwriting Score" value="85%" change={10} color="#667eea" />
                <StatCard icon="📝" title="Practice Sessions" value="24" change={18} color="#ec4899" />
                <StatCard icon="⭐" title="Improvement Rate" value="9%" change={7} color="#10b981" />
              </>
            )}

            {activeTab === "reading" && (
              <>
                <StatCard icon="📖" title="Reading Level" value="Advanced" change={12} color="#0284c7" />
                <StatCard icon="🗣️" title="Speech Clarity" value="95%" change={8} color="#10b981" />
                <StatCard icon="📚" title="Books Completed" value="18" change={22} color="#667eea" />
                <StatCard icon="🎯" title="Comprehension" value="92%" change={14} color="#ec4899" />
              </>
            )}

            {activeTab === "auditory" && (
              <>
                <StatCard icon="👂" title="Hearing Assessment" value="Normal" change={0} color="#8b5cf6" />
                <StatCard icon="🔊" title="Sound Recognition" value="90%" change={11} color="#0284c7" />
                <StatCard icon="🎵" title="Listening Skills" value="Excellent" change={9} color="#10b981" />
                <StatCard icon="⚡" title="Response Time" value="Fast" change={6} color="#f59e0b" />
              </>
            )}
          </div>
        </div>

        {activeTab === "eye" && (
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "40px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            border: "1px solid #e5e7eb"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "1.3rem", color: "#1f2937" }}>📊 Real-time Eye Detection Results</h3>
              <span style={{ 
                fontSize: "0.85rem", 
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: "20px",
                background: eyeStatus === "Live updates" ? "#d1fae5" : "#fef3c7",
                color: eyeStatus === "Live updates" ? "#065f46" : "#92400e"
              }}>
                {eyeStatus}
              </span>
            </div>

            {latestEyeResult ? (
              <div style={{ display: "grid", gap: "20px" }}>
                {/* Eye Health Summary */}
                <div style={{
                  background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
                  border: "2px solid #86efac",
                  padding: "20px",
                  borderRadius: "12px"
                }}>
                  <h4 style={{ margin: "0 0 16px 0", color: "#15803d", fontSize: "1.1rem", fontWeight: 700 }}>
                    ✨ Vision Coordination Monitoring
                  </h4>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                    {/* Condition Type */}
                    <div style={{
                      background: "white",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #d1fae5"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "1.2rem" }}>✓</span>
                        <span style={{ color: "#6b7280", fontSize: "0.85rem", fontWeight: 600 }}>Condition Type</span>
                      </div>
                      <div style={{ fontSize: "1.3rem", fontWeight: 700, color: latestEyeResult.label === "normal_eye" ? "#10b981" : "#f59e0b" }}>
                        {latestEyeResult.label === "normal_eye" ? "Normal" : "Attention Needed"}
                      </div>
                    </div>

                    {/* Overall Status */}
                    <div style={{
                      background: "white",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #d1fae5"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "1.2rem" }}>💪</span>
                        <span style={{ color: "#6b7280", fontSize: "0.85rem", fontWeight: 600 }}>Overall Status</span>
                      </div>
                      <div style={{ fontSize: "1.3rem", fontWeight: 700, color: latestEyeResult.confidence > 0.8 ? "#10b981" : "#f59e0b" }}>
                        {latestEyeResult.confidence > 0.8 ? "Healthy" : "Good"}
                      </div>
                    </div>

                    {/* Development Pattern */}
                    <div style={{
                      background: "white",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #d1fae5"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "1.2rem" }}>📈</span>
                        <span style={{ color: "#6b7280", fontSize: "0.85rem", fontWeight: 600 }}>Development</span>
                      </div>
                      <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0284c7" }}>
                        Normal Pattern
                      </div>
                    </div>
                  </div>

                  {latestEyeResult.gaze_analysis && (
                    <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #d1fae5" }}>
                      <div style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "10px" }}>
                        <strong>Visual Attention:</strong>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", fontSize: "0.9rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>{latestEyeResult.gaze_analysis.looking_at_screen ? "✓" : "○"}</span>
                          <span>Looking at Screen</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>{latestEyeResult.gaze_analysis.eye_openness === "normal" ? "✓" : "○"}</span>
                          <span>Eyes Open</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>{latestEyeResult.gaze_analysis.horizontal_alignment === "centered" ? "✓" : "○"}</span>
                          <span>Aligned Properly</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Main Detection Result */}
                <div style={{
                  background: latestEyeResult.label === "normal_eye" 
                    ? "linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)" 
                    : "linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%)",
                  borderLeft: `5px solid ${latestEyeResult.label === "normal_eye" ? "#10b981" : "#ef4444"}`,
                  padding: "16px",
                  borderRadius: "8px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <div>
                      <div style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "4px" }}>Detection Result</div>
                      <div style={{ fontSize: "1.4rem", fontWeight: 700, color: latestEyeResult.label === "normal_eye" ? "#059669" : "#dc2626" }}>
                        {latestEyeResult.label === "normal_eye" ? "✓ Normal Eye" : "⚠️ Lazy Eye Detected"}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "4px" }}>Confidence</div>
                      <div style={{ fontSize: "1.3rem", fontWeight: 700 }}>
                        {(latestEyeResult.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  {latestEyeResult.is_uncertain && (
                    <div style={{ color: "#b45309", fontSize: "0.9rem", fontWeight: 600 }}>
                      ⚠️ {latestEyeResult.uncertainty_reason}
                    </div>
                  )}
                </div>

                {/* Detailed Metrics */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "12px"
                }}>
                  <div style={{ background: "#f3f4f6", padding: "12px", borderRadius: "8px" }}>
                    <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>Lazy Eye Score</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ef4444" }}>
                      {latestEyeResult.lazy_eye_confidence !== null && latestEyeResult.lazy_eye_confidence !== undefined
                        ? `${(latestEyeResult.lazy_eye_confidence * 100).toFixed(1)}%`
                        : "N/A"}
                    </div>
                  </div>
                  
                  <div style={{ background: "#f3f4f6", padding: "12px", borderRadius: "8px" }}>
                    <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>Smoothed Label</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0284c7" }}>
                      {latestEyeResult.smooth_label ? latestEyeResult.smooth_label.replace(/_/g, " ").toUpperCase() : "N/A"}
                    </div>
                  </div>

                  <div style={{ background: "#f3f4f6", padding: "12px", borderRadius: "8px" }}>
                    <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>Smooth Confidence</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f59e0b" }}>
                      {latestEyeResult.smooth_confidence !== null && latestEyeResult.smooth_confidence !== undefined
                        ? `${(latestEyeResult.smooth_confidence * 100).toFixed(1)}%`
                        : "N/A"}
                    </div>
                  </div>

                  <div style={{ background: "#f3f4f6", padding: "12px", borderRadius: "8px" }}>
                    <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>Last Updated</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>
                      {latestEyeResult.timestamp ? (
                        <>
                          <div>{new Date(latestEyeResult.timestamp).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric'
                          })}</div>
                          <div style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "4px" }}>
                            {new Date(latestEyeResult.timestamp).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit', 
                              second: '2-digit',
                              hour12: true
                            })}
                          </div>
                        </>
                      ) : "N/A"}
                    </div>
                  </div>
                </div>

                {/* Gaze Analysis if available */}
                {latestEyeResult.gaze_analysis && (
                  <div style={{
                    background: "#f0f9ff",
                    border: "1px solid #bfdbfe",
                    padding: "16px",
                    borderRadius: "8px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#1e40af", fontSize: "1rem" }}>🔍 Gaze Analysis</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", fontSize: "0.9rem" }}>
                      <div>
                        <span style={{ color: "#6b7280" }}>Looking at Screen:</span> 
                        <span style={{ fontWeight: 600, marginLeft: "8px" }}>
                          {latestEyeResult.gaze_analysis.looking_at_screen ? "✓ Yes" : "✗ No"}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: "#6b7280" }}>Gaze Direction:</span>
                        <span style={{ fontWeight: 600, marginLeft: "8px" }}>
                          {latestEyeResult.gaze_analysis.gaze_direction}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: "#6b7280" }}>Eye Openness:</span>
                        <span style={{ fontWeight: 600, marginLeft: "8px" }}>
                          {latestEyeResult.gaze_analysis.eye_openness}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: "#6b7280" }}>Alignment:</span>
                        <span style={{ fontWeight: 600, marginLeft: "8px" }}>
                          {latestEyeResult.gaze_analysis.horizontal_alignment}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ 
                background: "#fef3c7", 
                border: "1px solid #fcd34d",
                padding: "16px", 
                borderRadius: "8px",
                color: "#92400e"
              }}>
                📹 No eye detection results yet. Start eye tracking on the Eye Problem Detector page to see live data here.
              </div>
            )}
          </div>
        )}

        {/* Tabs Navigation - Assessment Categories */}
        <div style={{
          display: "flex",
          gap: "120px",
          marginBottom: "30px",
          borderBottom: "2px solid #e5e7eb",
          overflowX: "auto",
          paddingBottom: "10px"
        }}>
          {[
            { id: "eye", label: "👁️ Eye Health & Vision" },
            { id: "writing", label: "✏️ Writing Issues" },
            { id: "reading", label: "📖 Reading & Speech" },
            { id: "auditory", label: "👂 Auditory Response" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: "12px 20px",
                fontSize: "0.95rem",
                fontWeight: "600",
                color: activeTab === tab.id ? "#667eea" : "#6b7280",
                background: "none",
                border: "none",
                borderBottom: activeTab === tab.id ? "3px solid #667eea" : "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                marginBottom: "-2px",
                whiteSpace: "nowrap"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Based on Tab */}
        {activeTab === "eye" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "30px"
          }}>
            {/* Left: Profile & Summary */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}>
              {/* Profile Card */}
              <div style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "30px",
                borderRadius: "16px",
                textAlign: "center",
                boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)"
              }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.5rem",
                  margin: "0 auto 16px"
                }}>
                  👧
                </div>
                <h2 style={{ fontSize: "1.8rem", margin: "0 0 8px 0", fontFamily: "'Fredoka One', sans-serif" }}>Emma</h2>
                <p style={{ fontSize: "1rem", opacity: "0.9", margin: "0 0 16px 0" }}>Age 5 years old</p>
                <div style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  padding: "12px",
                  borderRadius: "12px",
                  fontSize: "0.9rem"
                }}>
                  📍 Grade: Pre-School | 🎯 Level: Advanced
                </div>
              </div>

              {/* Health Status */}
              <div style={{
                background: "white",
                padding: "24px",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}>
                <h3 style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#1f2937",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  💚 Health Status
                </h3>
                <div style={{
                  backgroundColor: "#f0fdf4",
                  border: "2px solid #10b981",
                  padding: "16px",
                  borderRadius: "12px",
                  marginBottom: "12px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "1.5rem" }}>✅</span>
                    <span style={{ fontSize: "1rem", fontWeight: "bold", color: "#10b981" }}>All Systems Normal</span>
                  </div>
                  <p style={{ color: "#059669", fontSize: "0.85rem", margin: "0" }}>
                    No concerning patterns detected
                  </p>
                </div>
                <p style={{ color: "#666", fontSize: "0.85rem", margin: "0" }}>
                  Last health check: 2 hours ago
                </p>
              </div>

              {/* Parent Details Card */}
              <div style={{
                background: "white",
                padding: "24px",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}>
                <h3 style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#1f2937",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  👨‍👩‍👧 Parent Details
                </h3>

                {/* Primary Parent */}
                <div style={{
                  backgroundColor: "#f3f4f6",
                  padding: "14px",
                  borderRadius: "10px",
                  marginBottom: "14px",
                  borderLeft: "4px solid #667eea"
                }}>
                  <p style={{
                    margin: "0 0 8px 0",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    color: "#667eea",
                    textTransform: "uppercase"
                  }}>
                    Primary Parent
                  </p>
                  <p style={{
                    margin: "0 0 6px 0",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "#333"
                  }}>
                    Sarah Johnson
                  </p>
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    fontSize: "0.85rem"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#666" }}>
                      <span>📧</span>
                      <a href="mailto:sarah.johnson@email.com" style={{ color: "#667eea", textDecoration: "none" }}>
                        sarah.johnson@email.com
                      </a>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#666" }}>
                      <span>📱</span>
                      <a href="tel:+94712345678" style={{ color: "#667eea", textDecoration: "none" }}>
                        +94 71 234 5678
                      </a>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#666" }}>
                      <span>🏠</span>
                      <span>123 Flower Lane, Colombo 7</span>
                    </div>
                  </div>
                </div>

                {/* Secondary Parent */}
                <div style={{
                  backgroundColor: "#f9fafb",
                  padding: "14px",
                  borderRadius: "10px",
                  borderLeft: "4px solid #10b981"
                }}>
                  <p style={{
                    margin: "0 0 8px 0",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    color: "#10b981",
                    textTransform: "uppercase"
                  }}>
                    Secondary Parent
                  </p>
                  <p style={{
                    margin: "0 0 6px 0",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "#333"
                  }}>
                    Michael Johnson
                  </p>
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    fontSize: "0.85rem"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#666" }}>
                      <span>📧</span>
                      <a href="mailto:michael.johnson@email.com" style={{ color: "#10b981", textDecoration: "none" }}>
                        michael.johnson@email.com
                      </a>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#666" }}>
                      <span>📱</span>
                      <a href="tel:+94771234567" style={{ color: "#10b981", textDecoration: "none" }}>
                        +94 77 123 4567
                      </a>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#666" }}>
                      <span>🏠</span>
                      <span>123 Flower Lane, Colombo 7</span>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div style={{
                  backgroundColor: "#fef2f2",
                  padding: "12px",
                  borderRadius: "10px",
                  marginTop: "14px",
                  border: "1px solid #fecaca"
                }}>
                  <p style={{
                    margin: "0 0 8px 0",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    color: "#991b1b",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}>
                    🚨 Emergency Contact
                  </p>
                  <p style={{
                    margin: "0 0 6px 0",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    color: "#333"
                  }}>
                    Dr. Emma Watson (Pediatrician)
                  </p>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#666",
                    fontSize: "0.85rem"
                  }}>
                    <span>📞</span>
                    <a href="tel:+94761234567" style={{ color: "#ef4444", textDecoration: "none", fontWeight: "bold" }}>
                      +94 76 123 4567
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Detailed Sections */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}>
              {/* Eye Health Section */}
              <div style={{
                background: "linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)",
                padding: "28px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(2, 132, 199, 0.12)",
                border: "2px solid #0284c7"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "24px"
                }}>
                  <h3 style={{
                    fontSize: "1.5rem",
                    fontWeight: "900",
                    color: "#0c4a6e",
                    marginBottom: "0",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                  }}>
                    <span style={{ fontSize: "2rem" }}>👁️</span> Eye Health & Vision
                  </h3>
                  <button style={{
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    color: "white",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.2)"
                  }} onMouseOver={e => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)";
                  }} onMouseOut={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(239, 68, 68, 0.2)";
                  }}>
                    📋 Schedule Check-up
                  </button>
                </div>

                <div style={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  padding: "16px",
                  borderRadius: "12px",
                  borderLeft: "5px solid #0284c7",
                  marginBottom: "20px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                }}>
                  <p style={{ margin: "0", color: "#0c4a6e", fontSize: "0.95rem", fontWeight: "500" }}>
                    ✨ Vision coordination monitoring shows <span style={{ fontWeight: "bold", color: "#10b981" }}>normal development pattern</span>
                  </p>
                </div>

                {/* Eye Checking Details with Time Periods - Enhanced */}
                <div style={{
                  background: "white",
                  padding: "18px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  border: "2px solid #e5e7eb",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
                }}>
                  <h4 style={{
                    fontSize: "1.05rem",
                    fontWeight: "900",
                    color: "#0c4a6e",
                    marginBottom: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <span style={{ fontSize: "1.2rem" }}>📋</span> Eye Checking History
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {(() => {
                      const latestTs = latestEyeResult?.timestamp ? new Date(latestEyeResult.timestamp) : null;
                      const history = [
                        {
                          check: "Last Eye Check",
                          time: latestTs
                            ? latestTs.toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })
                            : "No recent check",
                          period: latestTs ? "✓ Current" : "Waiting",
                          highlight: true,
                        },
                      ];

                      if (latestTs) {
                        const prev1 = new Date(latestTs.getTime() - 6 * 60 * 60 * 1000);
                        const prev2 = new Date(latestTs.getTime() - 24 * 60 * 60 * 1000);
                        const prev3 = new Date(latestTs.getTime() - 7 * 24 * 60 * 60 * 1000);
                        history.push(
                          {
                            check: "Previous Check",
                            time: prev1.toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            }),
                            period: "Earlier today",
                            highlight: false,
                          },
                          {
                            check: "Focus Test",
                            time: prev2.toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            }),
                            period: "1 day ago",
                            highlight: false,
                          },
                          {
                            check: "Vision Screening",
                            time: prev3.toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            }),
                            period: "1 week ago",
                            highlight: false,
                          }
                        );
                      }

                      return history.map((item, idx) => (
                        <div key={idx} style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "14px",
                          backgroundColor: item.highlight ? "#dbeafe" : "#f9fafb",
                          borderRadius: "10px",
                          borderLeft: item.highlight ? "4px solid #0284c7" : "2px solid #e5e7eb",
                          transition: "all 0.2s ease",
                          border: item.highlight ? "2px solid #0284c7" : "1px solid #e5e7eb"
                        }}>
                          <div>
                            <p style={{ margin: "0", fontSize: "0.95rem", fontWeight: "700", color: "#1f2937" }}>
                              {item.check}
                            </p>
                            <p style={{ margin: "6px 0 0 0", fontSize: "0.85rem", color: "#6b7280" }}>
                              {item.time}
                            </p>
                          </div>
                          <span style={{
                            backgroundColor: item.highlight ? "#0284c7" : "#f3f4f6",
                            color: item.highlight ? "white" : "#374151",
                            padding: "8px 14px",
                            borderRadius: "20px",
                            fontSize: "0.8rem",
                            fontWeight: "700",
                            transition: "all 0.2s ease"
                          }}>
                            {item.period}
                          </span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Vision Therapy Progress Section - Enhanced */}
                <div style={{
                  background: "linear-gradient(135deg, #fff5e6 0%, #fef3c7 100%)",
                  padding: "20px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  border: "3px solid #f59e0b",
                  boxShadow: "0 4px 12px rgba(245, 158, 11, 0.15)"
                }}>
                  <h4 style={{
                    fontSize: "1.1rem",
                    fontWeight: "900",
                    color: "#92400e",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <span style={{ fontSize: "1.3rem" }}>🎯</span> Vision Therapy Progress - Stage 1
                  </h4>

                  {/* Stage 1 Completion Progress - Enhanced */}
                  <div style={{ marginBottom: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
                      <span style={{ fontSize: "0.95rem", fontWeight: "700", color: "#333" }}>Stage 1 Completion (21 Days)</span>
                      <span style={{ 
                        fontSize: "0.9rem", 
                        fontWeight: "900", 
                        color: "#f59e0b",
                        backgroundColor: "#fff8e1",
                        padding: "4px 12px",
                        borderRadius: "20px"
                      }}>
                        9/21 Days
                      </span>
                    </div>
                    <div style={{
                      width: "100%",
                      height: "14px",
                      backgroundColor: "#fef3c7",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid #fbbf24"
                    }}>
                      <div style={{
                        width: "43%",
                        height: "100%",
                        background: "linear-gradient(90deg, #f59e0b, #fbbf24, #fcd34d)",
                        borderRadius: "8px",
                        transition: "width 0.4s ease",
                        boxShadow: "0 0 8px rgba(245, 158, 11, 0.3)"
                      }} />
                    </div>
                  </div>

                  {/* Sessions Done - Enhanced */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                    marginBottom: "16px"
                  }}>
                    <div style={{
                      backgroundColor: "rgba(255,255,255,0.8)",
                      padding: "14px",
                      borderRadius: "10px",
                      border: "2px solid #fcd34d"
                    }}>
                      <p style={{ margin: "0", fontSize: "0.85rem", color: "#92400e", fontWeight: "700", textTransform: "uppercase" }}>Total Sessions</p>
                      <p style={{ margin: "8px 0 0 0", fontSize: "1.5rem", fontWeight: "900", color: "#f59e0b" }}>9 Sessions</p>
                    </div>
                    <div style={{
                      backgroundColor: "rgba(255,255,255,0.8)",
                      padding: "14px",
                      borderRadius: "10px",
                      border: "2px solid #10b981",
                      background: "linear-gradient(135deg, #f0fdf4 0%, #dbeafe 100%)"
                    }}>
                      <p style={{ margin: "0", fontSize: "0.85rem", color: "#047857", fontWeight: "700", textTransform: "uppercase" }}>Next Session</p>
                      <p style={{ margin: "8px 0 0 0", fontSize: "1.4rem", fontWeight: "900", color: "#10b981" }}>📅 Feb 1</p>
                      <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: "#059669" }}>2:00 PM</p>
                    </div>
                  </div>

                  {/* Recent Session History - Enhanced */}
                  <div style={{
                    marginBottom: "14px",
                    borderTop: "2px solid #fbbf24",
                    paddingTop: "12px"
                  }}>
                    <p style={{ margin: "0 0 10px 0", fontSize: "0.9rem", fontWeight: "900", color: "#92400e" }}>
                      ⏱️ Last 5 Sessions:
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {[
                        { session: "Session 9", date: "Jan 31, 3:30 PM", duration: "15 min" },
                        { session: "Session 8", date: "Jan 30, 2:00 PM", duration: "15 min" },
                        { session: "Session 7", date: "Jan 29, 3:45 PM", duration: "15 min" },
                        { session: "Session 6", date: "Jan 28, 2:15 PM", duration: "15 min" },
                        { session: "Session 5", date: "Jan 27, 4:00 PM", duration: "15 min" }
                      ].map((item, idx) => (
                        <div key={idx} style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "0.9rem",
                          padding: "10px",
                          backgroundColor: "rgba(255,255,255,0.5)",
                          borderRadius: "8px",
                          transition: "all 0.2s ease",
                          border: "1px solid rgba(255,255,255,0.8)"
                        }}>
                          <div>
                            <span style={{ fontWeight: "700", color: "#333" }}>{item.session}</span>
                            <span style={{ color: "#666", marginLeft: "10px" }}>• {item.date}</span>
                          </div>
                          <span style={{ color: "#f59e0b", fontWeight: "900", fontSize: "0.95rem" }}>⏱️ {item.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Weekly Schedule - Enhanced */}
                  <div style={{
                    backgroundColor: "white",
                    border: "2px solid #0284c7",
                    padding: "16px",
                    borderRadius: "10px",
                    marginTop: "14px",
                    boxShadow: "0 2px 6px rgba(2, 132, 199, 0.1)"
                  }}>
                    <p style={{
                      margin: "0 0 12px 0",
                      fontSize: "0.95rem",
                      fontWeight: "900",
                      color: "#0c4a6e",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <span style={{ fontSize: "1.1rem" }}>📅</span> Recommended Weekly Schedule
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", marginBottom: "12px" }}>
                      {[
                        { week: "Week 1", time: "5 min", status: "Completed ✓" },
                        { week: "Week 2", time: "10 min", status: "In Progress" },
                        { week: "Week 3", time: "15 min", status: "Upcoming" },
                        { week: "Week 4", time: "20 min", status: "Upcoming" },
                        { week: "Week 5 & Beyond", time: "25 min", status: "Upcoming" }
                      ].map((item, idx) => {
                        let bgColor = "#dbeafe";
                        let textColor = "#0c4a6e";
                        let statusColor = "#0284c7";
                        let statusBg = "#e0f2fe";
                        
                        if (item.status === "Completed ✓") {
                          bgColor = "#dbeafe";
                          statusColor = "#10b981";
                          statusBg = "#dcfce7";
                        } else if (item.status === "In Progress") {
                          bgColor = "#fef3c7";
                          statusColor = "#f59e0b";
                          statusBg = "#fef3c7";
                        } else {
                          bgColor = "#f3f4f6";
                          statusColor = "#9ca3af";
                          statusBg = "#f3f4f6";
                        }
                        
                        return (
                          <div key={idx} style={{
                            backgroundColor: bgColor,
                            padding: "12px",
                            borderRadius: "10px",
                            fontSize: "0.85rem",
                            border: `2px solid ${statusColor}`,
                            transition: "all 0.3s ease"
                          }}>
                            <p style={{ margin: "0 0 6px 0", fontWeight: "900", color: "#1f2937", fontSize: "0.9rem" }}>
                              {item.week}
                            </p>
                            <p style={{ margin: "0 0 8px 0", fontSize: "0.8rem", color: "#666" }}>
                              ⏱️ <span style={{ fontWeight: "bold", color: "#0284c7" }}>{item.time}</span>
                            </p>
                            <span style={{
                              display: "inline-block",
                              backgroundColor: statusBg,
                              color: statusColor,
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontWeight: "900"
                            }}>
                              {item.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <p style={{
                      margin: "0",
                      fontSize: "0.8rem",
                      color: "#0c4a6e",
                      fontStyle: "italic",
                      backgroundColor: "#f0f9ff",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #bfdbfe"
                    }}>
                      💡 Gradually increase therapy duration by 5 minutes each week for better eye muscle adaptation
                    </p>
                  </div>

                  {/* Doctor's Advice - Enhanced */}
                  <div style={{
                    background: "linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)",
                    border: "3px solid #ef4444",
                    padding: "16px",
                    borderRadius: "10px",
                    marginTop: "14px",
                    boxShadow: "0 2px 6px rgba(239, 68, 68, 0.15)"
                  }}>
                    <p style={{
                      margin: "0 0 10px 0",
                      fontSize: "0.95rem",
                      fontWeight: "900",
                      color: "#991b1b",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <span style={{ fontSize: "1.2rem" }}>👨‍⚕️</span> Doctor's Advice Required
                    </p>
                    <p style={{
                      margin: "0",
                      fontSize: "0.85rem",
                      color: "#7f1d1d",
                      lineHeight: "1.5",
                      fontWeight: "500"
                    }}>
                      Please consult with your child's eye doctor after completing Stage 1 (21 days) to assess progress and adjust the therapy plan if needed.
                    </p>
                  </div>
                </div>

                {/* Start Vision Therapy Button */}
                <div style={{
                  marginTop: "16px"
                }}>
                  <button style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    color: "white",
                    padding: "14px 20px",
                    borderRadius: "10px",
                    border: "none",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)"
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(239, 68, 68, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)";
                    }}
                    onClick={() => window.location.href = "/vision-therapy"}
                  >
                    🎯 Start Vision Therapy
                  </button>
                </div>
              </div>

              {/* Learning Progress Section */}
              <div style={{
                background: "white",
                padding: "24px",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}>
                <h3 style={{
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  color: "#1f2937",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  📚 Learning Progress
                </h3>
                <div style={{ marginBottom: "12px", color: "#6b7280", fontSize: "0.9rem" }}>
                  Based on real time spent on shapes pages.
                  {learningStats.lastUpdated && (
                    <span> Last updated: {formatLastVisit(learningStats.lastUpdated)}</span>
                  )}
                </div>

                {(() => {
                  const items = [
                    { key: "Circle", color: "#667eea", data: learningStats.circle },
                    { key: "Square", color: "#10b981", data: learningStats.square },
                    { key: "Triangle", color: "#f59e0b", data: learningStats.triangle },
                    { key: "Star", color: "#ef4444", data: learningStats.star },
                  ];
                  const maxMs = Math.max(...items.map((i) => i.data.ms), 1);

                  return (
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "16px",
                      alignItems: "end",
                      height: "200px",
                      marginTop: "12px"
                    }}>
                      {items.map((item) => {
                        const height = Math.max(8, Math.round((item.data.ms / maxMs) * 180));
                        return (
                          <div key={item.key} style={{ textAlign: "center" }}>
                            <div style={{
                              height: `${height}px`,
                              background: `linear-gradient(180deg, ${item.color}, ${item.color}80)`,
                              borderRadius: "10px",
                              marginBottom: "10px",
                              boxShadow: `0 6px 12px ${item.color}33`
                            }} />
                            <div style={{ fontWeight: 700, color: "#1f2937" }}>{item.key}</div>
                            <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                              {formatDuration(item.data.ms)} • {item.data.visits} visits
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "4px" }}>
                              Last visit: {formatLastVisit(item.data.lastVisit)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Recommendations */}
              <div style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                color: "white",
                padding: "24px",
                borderRadius: "16px",
                boxShadow: "0 8px 24px rgba(245, 158, 11, 0.3)"
              }}>
                <h3 style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  💡 Recommended Actions
                </h3>
                <ul style={{
                  paddingLeft: "20px",
                  margin: "0",
                  fontSize: "0.95rem"
                }}>
                  <li style={{ marginBottom: "8px" }}>Schedule an eye break - 5 minute session recommended</li>
                  <li style={{ marginBottom: "8px" }}>Try the new "Shape Recognition" activity</li>
                  <li>Encourage 10 more minutes of reading practice</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "detailed" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px"
          }}>
            {[
              { title: "✍️ Writing & Motor Skills", subtitle: "Hand coordination development", items: ["Circle tracing: 95%", "Shape drawing: 98%", "Letter forming: 96%"] },
              { title: "📖 Reading & Speech", subtitle: "Letter & sound recognition", items: ["Letter recognition: 92%", "Phonics basics: 88%", "Story listening: 94%"] },
              { title: "🎵 Auditory Response", subtitle: "Listening & sound recognition", items: ["Sound matching: 90%", "Music appreciation: 87%", "Voice recognition: 91%"] },
              { title: "🧠 Cognitive Skills", subtitle: "Problem-solving abilities", items: ["Pattern recognition: 89%", "Memory games: 86%", "Logic puzzles: 84%"] }
            ].map((section, idx) => (
              <div key={idx} style={{
                background: "white",
                padding: "24px",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}>
                <h3 style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#1f2937",
                  marginBottom: "6px"
                }}>
                  {section.title}
                </h3>
                <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "16px" }}>{section.subtitle}</p>
                {section.items.map((item, i) => (
                  <div key={i} style={{
                    backgroundColor: "#f3f4f6",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "8px",
                    fontSize: "0.9rem",
                    display: "flex",
                    justifyContent: "space-between"
                  }}>
                    <span>{item.split(":")[0]}</span>
                    <span style={{ color: "#667eea", fontWeight: "bold" }}>{item.split(":")[1]}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === "insights" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px"
          }}>
            <div style={{
              background: "white",
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <h3 style={{
                fontSize: "1.3rem",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "16px"
              }}>
                📈 This Week's Trends
              </h3>
              <ul style={{ color: "#666", paddingLeft: "20px", fontSize: "0.95rem" }}>
                <li style={{ marginBottom: "12px" }}>👆 Emma's learning time increased by 25%</li>
                <li style={{ marginBottom: "12px" }}>🎯 Eye health metrics improved significantly</li>
                <li style={{ marginBottom: "12px" }}>⭐ Consistency in daily activities: 5/7 days</li>
                <li>🏃 Activity diversity: 8 different learning activities</li>
              </ul>
            </div>

            <div style={{
              background: "white",
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <h3 style={{
                fontSize: "1.3rem",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "16px"
              }}>
                🎯 Next Steps
              </h3>
              <ul style={{ color: "#666", paddingLeft: "20px", fontSize: "0.95rem" }}>
                <li style={{ marginBottom: "12px" }}>🆙 Advance to Level 2 challenges - Emma's ready!</li>
                <li style={{ marginBottom: "12px" }}>🎨 Introduce creative writing exercises</li>
                <li style={{ marginBottom: "12px" }}>👥 Join group learning sessions</li>
                <li>🏆 Work towards "Perfect Week" badge</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "writing" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "30px"
          }}>
            {/* Left Sidebar */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}>
              {/* Profile Card */}
              <div style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "30px",
                borderRadius: "16px",
                textAlign: "center",
                boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)"
              }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.5rem",
                  margin: "0 auto 16px"
                }}>
                  👧
                </div>
                <h2 style={{ fontSize: "1.8rem", margin: "0 0 8px 0", fontFamily: "'Fredoka One', sans-serif" }}>Emma</h2>
                <p style={{ fontSize: "1rem", opacity: "0.9", margin: "0 0 16px 0" }}>Age 5 years old</p>
                <div style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  padding: "12px",
                  borderRadius: "12px",
                  fontSize: "0.9rem"
                }}>
                  📍 Grade: Pre-School | 🎯 Level: Advanced
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}>
              {/* Writing Issues Section */}
              <div style={{
                background: "linear-gradient(135deg, #fff5e6 0%, #fef3c7 100%)",
                padding: "28px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(245, 158, 11, 0.12)",
                border: "2px solid #f59e0b"
              }}>
                <h3 style={{
                  fontSize: "1.5rem",
                  fontWeight: "900",
                  color: "#92400e",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <span style={{ fontSize: "2rem" }}>✏️</span> Writing Issues Assessment
                </h3>
                <p style={{
                  margin: "0",
                  color: "#92400e",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                  lineHeight: "1.6"
                }}>
                  Comprehensive evaluation of your child's writing skills and development. Track improvements in handwriting, letter formation, spelling, and creative expression.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reading" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "30px"
          }}>
            {/* Left Sidebar */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}>
              {/* Profile Card */}
              <div style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "30px",
                borderRadius: "16px",
                textAlign: "center",
                boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)"
              }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.5rem",
                  margin: "0 auto 16px"
                }}>
                  👧
                </div>
                <h2 style={{ fontSize: "1.8rem", margin: "0 0 8px 0", fontFamily: "'Fredoka One', sans-serif" }}>Emma</h2>
                <p style={{ fontSize: "1rem", opacity: "0.9", margin: "0 0 16px 0" }}>Age 5 years old</p>
                <div style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  padding: "12px",
                  borderRadius: "12px",
                  fontSize: "0.9rem"
                }}>
                  📍 Grade: Pre-School | 🎯 Level: Advanced
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}>
              {/* Reading & Speech Section */}
              <div style={{
                background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                padding: "28px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(2, 132, 199, 0.12)",
                border: "2px solid #0284c7"
              }}>
                <h3 style={{
                  fontSize: "1.5rem",
                  fontWeight: "900",
                  color: "#0c4a6e",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <span style={{ fontSize: "2rem" }}>📖</span> Reading & Speech Assessment
                </h3>
                <p style={{
                  margin: "0",
                  color: "#0c4a6e",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                  lineHeight: "1.6"
                }}>
                  Monitor your child's reading ability and speech development progress. Track phonemic awareness, decoding skills, fluency, and articulation improvements.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "auditory" && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "30px"
          }}>
            {/* Left Sidebar */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}>
              {/* Profile Card */}
              <div style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "30px",
                borderRadius: "16px",
                textAlign: "center",
                boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)"
              }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.5rem",
                  margin: "0 auto 16px"
                }}>
                  👧
                </div>
                <h2 style={{ fontSize: "1.8rem", margin: "0 0 8px 0", fontFamily: "'Fredoka One', sans-serif" }}>Emma</h2>
                <p style={{ fontSize: "1rem", opacity: "0.9", margin: "0 0 16px 0" }}>Age 5 years old</p>
                <div style={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  padding: "12px",
                  borderRadius: "12px",
                  fontSize: "0.9rem"
                }}>
                  📍 Grade: Pre-School | 🎯 Level: Advanced
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}>
              {/* Auditory Response Section */}
              <div style={{
                background: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
                padding: "28px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(139, 92, 246, 0.12)",
                border: "2px solid #8b5cf6"
              }}>
                <h3 style={{
                  fontSize: "1.5rem",
                  fontWeight: "900",
                  color: "#5b21b6",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <span style={{ fontSize: "2rem" }}>👂</span> Auditory Response Assessment
                </h3>
                <p style={{
                  margin: "0",
                  color: "#5b21b6",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                  lineHeight: "1.6"
                }}>
                  Track your child's hearing and auditory processing abilities. Monitor listening comprehension, sound discrimination, and auditory attention development.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ParentsDashboard;
