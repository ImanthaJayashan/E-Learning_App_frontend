import { useEffect } from "react";
import { startEyeTracking } from "../services/eyeTracking";

const EyeTrackingBoot = () => {
  useEffect(() => {
    startEyeTracking();
  }, []);

  return null;
};

export default EyeTrackingBoot;
