import { useEffect } from "react";
import { startEyeTracking } from "../services/eyeTracking";

const EyeTrackingBoot = () => {
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    // Support both legacy 'child' and current 'student' values
    if (userRole === "child" || userRole === "student") {
      startEyeTracking();
    }
  }, []);

  return null;
};

export default EyeTrackingBoot;
