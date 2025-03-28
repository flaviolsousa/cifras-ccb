import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

const useOrientation = () => {
  const [isPortrait, setIsPortrait] = useState(true);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      const isPortrait = window.height > window.width;
      setIsPortrait(isPortrait);
    });

    // Set initial orientation
    setIsPortrait(Dimensions.get("window").height > Dimensions.get("window").width);

    return () => subscription.remove();
  }, []);

  return isPortrait;
};

export default useOrientation;
