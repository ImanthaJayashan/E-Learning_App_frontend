import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ParentsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "detailed" | "insights">("overview");

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
        {/* Quick Stats */}
        <div style={{ marginBottom: "50px" }}>
          <h2 style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: "24px"
          }}>
            Quick Overview
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px"
          }}>
            <StatCard icon="📚" title="Learning Time" value="8.5h" change={12} color="#667eea" />
            <StatCard icon="👁️" title="Eye Health" value="Excellent" change={8} color="#10b981" />
            <StatCard icon="🎮" title="Games Completed" value="12" change={25} color="#f59e0b" />
            <StatCard icon="🏆" title="Total Points" value="2,450" change={18} color="#ec4899" />
          </div>
        </div>

        {/* Tabs Navigation */}
        <div style={{
          display: "flex",
          gap: "12px",
          marginBottom: "30px",
          borderBottom: "2px solid #e5e7eb"
        }}>
          {[
            { id: "overview", label: "📊 Overview" },
            { id: "detailed", label: "🔍 Detailed Report" },
            { id: "insights", label: "💡 Insights" }
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
                marginBottom: "-2px"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Based on Tab */}
        {activeTab === "overview" && (
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
            </div>

            {/* Right: Detailed Sections */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}>
              {/* Eye Health Section */}
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
                  👁️ Eye Health & Vision
                </h3>
                <div style={{
                  backgroundColor: "#f0f9ff",
                  padding: "16px",
                  borderRadius: "12px",
                  borderLeft: "4px solid #0284c7",
                  marginBottom: "16px"
                }}>
                  <p style={{ margin: "0", color: "#0c4a6e", fontSize: "0.95rem" }}>
                    Vision coordination monitoring shows normal development pattern
                  </p>
                </div>
                <ProgressBar label="Vision Sharpness" percentage={92} color="#0284c7" />
                <ProgressBar label="Eye Coordination" percentage={88} color="#0284c7" />
                <ProgressBar label="Focus Stability" percentage={90} color="#0284c7" />

                <div style={{
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: "16px",
                  marginTop: "16px"
                }}>
                  <h4 style={{
                    fontSize: "0.95rem",
                    fontWeight: "bold",
                    color: "#1f2937",
                    marginBottom: "12px"
                  }}>
                    Condition Screening
                  </h4>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px"
                  }}>
                    {[
                      { name: "Lazy Eye", status: "✓ Normal" },
                      { name: "Misalignment", status: "✓ Normal" },
                      { name: "Focus Issues", status: "✓ Normal" },
                      { name: "Color Vision", status: "✓ Normal" }
                    ].map((item, idx) => (
                      <div key={idx} style={{
                        backgroundColor: "#f0fdf4",
                        padding: "10px",
                        borderRadius: "8px",
                        fontSize: "0.85rem"
                      }}>
                        <span style={{ color: "#333", fontWeight: "500" }}>{item.name}</span>
                        <br />
                        <span style={{ color: "#10b981", fontSize: "0.75rem", fontWeight: "bold" }}>{item.status}</span>
                      </div>
                    ))}
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
                <ProgressBar label="Circle Drawing Exercises" percentage={95} color="#667eea" />
                <ProgressBar label="Color Learning Games" percentage={88} color="#667eea" />
                <ProgressBar label="Letter Tracing" percentage={92} color="#667eea" />
                <ProgressBar label="Sound Matching" percentage={85} color="#667eea" />
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
      </div>

      <Footer />
    </div>
  );
};

export default ParentsDashboard;
