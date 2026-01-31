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
        backgroundColor: "#f5f5f5"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "20px",
            fontFamily: "'Fredoka One', 'Comic Sans MS', sans-serif"
          }}>
            Parents Dashboard
          </h1>
          
          <p style={{
            fontSize: "1.2rem",
            color: "#666",
            marginBottom: "40px"
          }}>
            Welcome to the Parents Dashboard! Monitor your child's progress and activities.
          </p>

          {/* Dashboard Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "30px"
          }}>
            <div style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>📊</div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "10px", color: "#333" }}>Progress Tracking</h3>
              <p style={{ color: "#666" }}>View your child's learning progress and achievements</p>
            </div>

            <div style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>👁️</div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "10px", color: "#333" }}>Eye Health</h3>
              <p style={{ color: "#666" }}>Monitor eye health reports and recommendations</p>
            </div>

            <div style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>⏱️</div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "10px", color: "#333" }}>Activity Time</h3>
              <p style={{ color: "#666" }}>Track daily screen time and activity duration</p>
            </div>

            <div style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🏆</div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "10px", color: "#333" }}>Achievements</h3>
              <p style={{ color: "#666" }}>View earned badges and rewards</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ParentsDashboard;
