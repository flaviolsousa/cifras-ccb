import React from "react";
import { StyleSheet } from "react-native";
import { useTheme, FAB } from "react-native-paper";
import { transpose } from "chord-transposer";
import themes from "../config/Theme/theme";

interface ToneNavigateProps {
  visible: boolean;
  onClose: () => void;
  onToneChange: (newTone: string) => void;
  currentTone: string;
}

const ToneNavigate = ({ visible, onClose, onToneChange, currentTone }: ToneNavigateProps) => {
  const theme = useTheme();

  // const styles = StyleSheet.create({});

  const handleToneUp = () => {
    try {
      const newTone = transpose(currentTone).up(1).toString();
      onToneChange(newTone);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToneDown = () => {
    try {
      const newTone = transpose(currentTone).down(1).toString();
      onToneChange(newTone);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <FAB.Group
      open={visible}
      visible={visible}
      icon="close"
      backdropColor="rgba(255,255,255,0.2)"
      actions={[
        {
          icon: "plus",
          onPress: handleToneUp,
        },
        {
          icon: "minus",
          onPress: handleToneDown,
        },
      ]}
      onStateChange={({ open }) => {}}
      onPress={() => {
        if (visible) onClose();
      }}
    />
  );
};

export default ToneNavigate;
