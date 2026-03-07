import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { startEyeTracking, stopEyeTracking } from "../services/eyeTracking";

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<"child" | "parent" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<"ready" | "requesting" | "denied" | "">("");

  // Request camera and return the MediaStream (do NOT stop tracks here)
  const requestCameraAccess = async (): Promise<MediaStream | null> => {
    try {
      setCameraStatus("requesting");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStatus("ready");
      return stream;
    } catch (err) {
      console.error("Camera access denied:", err);
      setCameraStatus("denied");
      return null;
    }
  };

  const handleRoleSelect = async (role: "child" | "parent") => {
    setSelected(role);
    setIsLoading(true);

    // Map role: child -> student, parent -> parent
    const userRole = role === "child" ? "student" : "parent";

    try {
      // Update stored user with selected role
      const storedUserStr = localStorage.getItem("user");
      if (storedUserStr) {
        const storedUser = JSON.parse(storedUserStr);
        storedUser.userType = userRole;
        localStorage.setItem("user", JSON.stringify(storedUser));
      }

      localStorage.setItem("userRole", userRole);

      // Trigger eye tracking and camera access if child/student
      if (role === "child") {
        try {
          // Request camera access first and get the stream
          const stream = await requestCameraAccess();
          if (!stream) {
            alert("Camera access is required for eye tracking. Please enable camera access in your browser settings.");
            setIsLoading(false);
            setSelected(null);
            return;
          }

          // Start eye tracking with the obtained stream so camera stays active across navigation
          await startEyeTracking(stream);
        } catch (error) {
          console.error("Eye tracking error:", error);
          alert("Could not initialize eye tracking. Please ensure camera access is allowed.");
          setIsLoading(false);
          setSelected(null);
          return;
        }
      }
      // If switching to parent, ensure any running eye-tracking is stopped
      if (role === "parent") {
        try {
          stopEyeTracking();
        } catch (e) {
          console.warn("Error stopping eye tracking:", e);
        }
      }

      // Redirect based on role
      setTimeout(() => {
        setCameraStatus("");
        if (role === "child") {
          navigate("/");
        } else {
          navigate("/parents-dashboard");
        }
      }, 800);
    } catch (error) {
      console.error("Error selecting role:", error);
      alert("Failed to save role selection. Please try again.");
      setIsLoading(false);
      setSelected(null);
    }
  };

  // Auto-trigger only when coming from auth flow: `autoRoleSelection` flag is set by login/signup
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    const autoFlag = localStorage.getItem("autoRoleSelection");
    if (savedRole === "student" && autoFlag === "true") {
      // consume the flag so manual navigations don't re-trigger
      localStorage.removeItem("autoRoleSelection");
      // delay a little to allow the page to finish rendering
      const t = setTimeout(() => {
        handleRoleSelect("child");
      }, 400);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          textAlign: "center",
          maxWidth: "600px",
        }}
      >
        <h1 style={{
          color: "white",
          fontSize: "3rem",
          fontWeight: "bold",
          marginBottom: "20px",
          fontFamily: "'Fredoka One', 'Comic Sans MS', sans-serif",
        }}>
          👋 Welcome!
        </h1>

        <p style={{
          color: "rgba(255,255,255,0.9)",
          fontSize: "1.2rem",
          marginBottom: "50px",
        }}>
          Are you a Child or a Parent?
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          marginBottom: "40px",
          opacity: isLoading ? 0.5 : 1,
          pointerEvents: isLoading ? "none" : "auto",
        }}>
          {/* Child Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleRoleSelect("child")}
            disabled={isLoading}
            style={{
              padding: "40px 20px",
              borderRadius: "20px",
              border: selected === "child" ? "4px solid #fff" : "none",
              background: "rgba(255,255,255,0.95)",
              cursor: isLoading ? "wait" : "pointer",
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "#667eea",
              transition: "all 0.3s ease",
              boxShadow: selected === "child" ? "0 10px 40px rgba(0,0,0,0.3)" : "0 5px 20px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "10px" }}>👧👦</div>
            <div>I'm a Child</div>
          </motion.button>

          {/* Parent Button */}
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleRoleSelect("parent")}
            disabled={isLoading}
            style={{
              padding: "40px 20px",
              borderRadius: "20px",
              border: selected === "parent" ? "4px solid #fff" : "none",
              background: "rgba(255,255,255,0.95)",
              cursor: isLoading ? "wait" : "pointer",
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "#764ba2",
              transition: "all 0.3s ease",
              boxShadow: selected === "parent" ? "0 10px 40px rgba(0,0,0,0.3)" : "0 5px 20px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "10px" }}>👨‍👩‍👧‍👦</div>
            <div>I'm a Parent</div>
          </motion.button>
        </div>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            {selected === "child" ? (
              <>
                <div>🎥 Initializing camera...</div>
                {cameraStatus === "requesting" && <div style={{ fontSize: "0.9rem", marginTop: "8px" }}>Please allow camera access in your browser</div>}
                {cameraStatus === "ready" && <div style={{ fontSize: "0.9rem", marginTop: "8px" }}>✓ Camera ready - Starting eye check...</div>}
                {cameraStatus === "denied" && <div style={{ fontSize: "0.9rem", marginTop: "8px", color: "#ffcccc" }}>✗ Camera access denied</div>}
              </>
            ) : (
              "✓ Welcome, Parent!"
            )}
          </motion.div>
        )}

        {!isLoading && (
          <p style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.9rem",
          }}>
            {selected === "child" && "✓ Camera access required for eye tracking"}
            {selected === "parent" && "✓ No camera access needed"}
            {!selected && "📷 Camera will be requested for children | No camera needed for parents"}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default RoleSelection;
