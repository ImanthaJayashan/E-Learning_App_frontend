import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ParentsDashboard: React.FC = () => {
  return (
    <div>
      <Navbar />
      
      {/* Dashboard Content */}
      <div style={{
        minHeight: "70vh",
        padding: "40px 20px",
        backgroundColor: "#f5f5f5",
        fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          {/* Main Header */}
          <div style={{
            backgroundColor: "#4f46e5",
            color: "white",
            padding: "30px",
            borderRadius: "12px",
            marginBottom: "30px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}>
            <h1 style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "10px",
              fontFamily: "'Fredoka One', 'Comic Sans MS', sans-serif"
            }}>
              PARENT DASHBOARD
            </h1>
            <p style={{
              fontSize: "1.2rem",
              opacity: "0.9"
            }}>
              Welcome! Here's a snapshot of Emma's learning journey today.
            </p>
          </div>

          {/* Two Column Layout */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "30px",
            marginTop: "20px"
          }}>
            {/* Left Column */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "30px"
            }}>
              {/* Student Profile Card */}
              <div style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px"
                }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#e0e7ff",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.8rem",
                    marginRight: "15px"
                  }}>
                    👧
                  </div>
                  <div>
                    <h2 style={{
                      fontSize: "1.8rem",
                      fontWeight: "bold",
                      color: "#333",
                      margin: "0"
                    }}>
                      Emma
                    </h2>
                    <p style={{
                      color: "#666",
                      margin: "5px 0"
                    }}>
                      Age 5 years old
                    </p>
                    <span style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      padding: "5px 15px",
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                      fontWeight: "bold"
                    }}>
                      Doing Great!
                    </span>
                  </div>
                </div>
                <div style={{
                  borderTop: "1px solid #eee",
                  paddingTop: "15px"
                }}>
                  <p style={{
                    color: "#666",
                    fontSize: "0.9rem"
                  }}>
                    Last activity: <strong>2 hours ago</strong>
                  </p>
                </div>
              </div>

              {/* Learning Progress Card */}
              <div style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}>
                <h3 style={{
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: "20px",
                  borderBottom: "2px solid #4f46e5",
                  paddingBottom: "10px"
                }}>
                  Learning Progress
                </h3>
                <p style={{
                  color: "#666",
                  marginBottom: "15px",
                  fontWeight: "500"
                }}>
                  This Week's Progress
                </p>
                
                <div style={{ marginBottom: "15px" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px"
                  }}>
                    <span style={{ color: "#333" }}>Circle Drawing Exercises</span>
                    <span style={{ color: "#f59e0b" }}>⭐⭐⭐⭐</span>
                  </div>
                  <span style={{
                    color: "#10b981",
                    fontSize: "0.85rem",
                    fontWeight: "bold"
                  }}>Excellent</span>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px"
                  }}>
                    <span style={{ color: "#333" }}>Color Learning Games</span>
                    <span style={{ color: "#f59e0b" }}>⭐⭐⭐⭐</span>
                  </div>
                  <span style={{
                    color: "#3b82f6",
                    fontSize: "0.85rem",
                    fontWeight: "bold"
                  }}>Good</span>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px"
                  }}>
                    <span style={{ color: "#333" }}>Letter Tracing</span>
                    <span style={{ color: "#f59e0b" }}>⭐⭐⭐⭐</span>
                  </div>
                  <span style={{
                    color: "#8b5cf6",
                    fontSize: "0.85rem",
                    fontWeight: "bold"
                  }}>Improving</span>
                </div>

                <div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px"
                  }}>
                    <span style={{ color: "#333" }}>Sound Matching</span>
                    <span style={{ color: "#f59e0b" }}>⭐⭐⭐⭐</span>
                  </div>
                  <span style={{
                    color: "#6b7280",
                    fontSize: "0.85rem",
                    fontWeight: "bold"
                  }}>Stable</span>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "30px"
            }}>
              {/* Two Column Grid for Right Side */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "30px"
              }}>
                {/* Writing & Motor Skills Card */}
                <div style={{
                  backgroundColor: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  height: "fit-content"
                }}>
                  <h3 style={{
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: "20px",
                    borderBottom: "2px solid #4f46e5",
                    paddingBottom: "10px"
                  }}>
                    Writing & Motor Skills
                  </h3>
                  <p style={{
                    color: "#666",
                    marginBottom: "15px",
                    fontSize: "0.9rem"
                  }}>
                    Hand coordination development
                  </p>
                  
                  <div style={{ marginBottom: "10px" }}>
                    <span style={{ color: "#333" }}>Circle tracing</span>
                    <span style={{
                      color: "#8b5cf6",
                      marginLeft: "10px",
                      fontSize: "0.85rem",
                      fontWeight: "bold"
                    }}>Improving</span>
                  </div>
                  
                  <div style={{ marginBottom: "10px" }}>
                    <span style={{ color: "#333" }}>Shape drawing</span>
                    <span style={{
                      color: "#10b981",
                      marginLeft: "10px",
                      fontSize: "0.85rem",
                      fontWeight: "bold"
                    }}>Exceeds</span>
                  </div>
                  
                  <div style={{ marginBottom: "15px" }}>
                    <span style={{ color: "#333" }}>Letter forming</span>
                    <span style={{
                      color: "#10b981",
                      marginLeft: "10px",
                      fontSize: "0.85rem",
                      fontWeight: "bold"
                    }}>Exceeds</span>
                  </div>
                  
                  <p style={{
                    color: "#666",
                    fontSize: "0.9rem",
                    fontStyle: "italic",
                    borderTop: "1px solid #eee",
                    paddingTop: "15px"
                  }}>
                    A blend control and coordination are developing steadily.
                  </p>
                </div>

                {/* Eye Health & Vision Card */}
                <div style={{
                  backgroundColor: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  height: "fit-content"
                }}>
                  <h3 style={{
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: "20px",
                    borderBottom: "2px solid #4f46e5",
                    paddingBottom: "10px"
                  }}>
                    Eye Health & Vision
                  </h3>
                  <p style={{
                    color: "#666",
                    marginBottom: "15px",
                    fontSize: "0.9rem"
                  }}>
                    Vision coordination monitoring
                  </p>
                  
                  <ul style={{
                    color: "#666",
                    paddingLeft: "20px",
                    marginBottom: "15px",
                    fontSize: "0.9rem"
                  }}>
                    <li style={{ marginBottom: "8px" }}>Eye behavior appears within a normal range</li>
                    <li style={{ marginBottom: "15px" }}>Stable over recent activities</li>
                  </ul>
                  
                  <p style={{
                    color: "#666",
                    fontSize: "0.9rem"
                  }}>
                    Regular visual activities help strengthen eye coordination
                  </p>
                </div>

                {/* Reading & Speech Card */}
                <div style={{
                  backgroundColor: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  height: "fit-content"
                }}>
                  <h3 style={{
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: "20px",
                    borderBottom: "2px solid #4f46e5",
                    paddingBottom: "10px"
                  }}>
                    Reading & Speech
                  </h3>
                  <p style={{
                    color: "#666",
                    marginBottom: "15px",
                    fontSize: "0.9rem"
                  }}>
                    Letter & sound recognition
                  </p>
                  
                  <p style={{
                    color: "#666",
                    marginBottom: "15px",
                    fontSize: "0.9rem"
                  }}>
                    Good engagement with letters and sounds
                  </p>
                  
                  <div style={{ marginBottom: "15px" }}>
                    <p style={{
                      color: "#333",
                      fontWeight: "bold",
                      marginBottom: "5px",
                      fontSize: "0.9rem"
                    }}>Letter recognition</p>
                    <ul style={{
                      color: "#666",
                      paddingLeft: "20px",
                      fontSize: "0.85rem"
                    }}>
                      <li>Phonics basics</li>
                      <li>Simple words</li>
                    </ul>
                  </div>
                  
                  <p style={{
                    color: "#333",
                    fontWeight: "bold",
                    fontSize: "0.9rem"
                  }}>
                    Story listening
                  </p>
                </div>

                {/* Gentle Reminders Card */}
                <div style={{
                  backgroundColor: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  height: "fit-content"
                }}>
                  <h3 style={{
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: "20px",
                    borderBottom: "2px solid #4f46e5",
                    paddingBottom: "10px"
                  }}>
                    Gentle Reminders
                  </h3>
                  <p style={{
                    color: "#666",
                    marginBottom: "15px",
                    fontSize: "0.9rem"
                  }}>
                    Helpful suggestions for today
                  </p>
                  
                  <ul style={{
                    color: "#666",
                    paddingLeft: "20px",
                    fontSize: "0.9rem"
                  }}>
                    <li style={{ marginBottom: "10px" }}>Eye break suggested today</li>
                    <li style={{ marginBottom: "10px" }}>One activity skipped this week - try to catch up!</li>
                    <li>New learning games available</li>
                  </ul>
                </div>
              </div>

              {/* Bottom Row - Full Width */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "30px"
              }}>
                {/* Auditory Response Card */}
                <div style={{
                  backgroundColor: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}>
                  <h3 style={{
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: "20px",
                    borderBottom: "2px solid #4f46e5",
                    paddingBottom: "10px"
                  }}>
                    Auditory Response
                  </h3>
                  <p style={{
                    color: "#666",
                    marginBottom: "15px",
                    fontSize: "0.9rem"
                  }}>
                    Listening & sound recognition
                  </p>
                  
                  <p style={{
                    color: "#666",
                    marginBottom: "15px",
                    fontSize: "0.9rem"
                  }}>
                    Responds well to sounds and instructions
                  </p>
                  
                  <p style={{
                    color: "#666",
                    fontSize: "0.9rem"
                  }}>
                    Sound repetition games may further support listening skills
                  </p>
                </div>

                {/* Tips for Parents Card */}
                <div style={{
                  backgroundColor: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}>
                  <h3 style={{
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: "20px",
                    borderBottom: "2px solid #4f46e5",
                    paddingBottom: "10px"
                  }}>
                    Tips for Parents
                  </h3>
                  <p style={{
                    color: "#666",
                    marginBottom: "15px",
                    fontSize: "0.9rem"
                  }}>
                    Helpful recommendations
                  </p>
                  
                  <ul style={{
                    color: "#666",
                    paddingLeft: "20px",
                    fontSize: "0.9rem"
                  }}>
                    <li style={{ marginBottom: "10px" }}>
                      Encourage short screen breaks every 20 minutes
                      <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                        <li>Repeat drawing games to build muscle memory</li>
                      </ul>
                    </li>
                    <li>
                      Talk and listen with your child daily
                      <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                        <li>Outdoor play helps develop motor skills</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ParentsDashboard;