import React from "react";
import { useTheme, FAB } from "react-native-paper";
import { transpose } from "chord-transposer";
import { HymnModel } from "../domain/HymnModel";
import HymnService from "../services/Hymn/HymnService";

interface ToneNavigateProps {
  hymn: HymnModel;
  visible: boolean;
  onClose: () => void;
  onToneChange: (transposedHymn: HymnModel) => void;
  currentTone: string;
}

const ToneNavigate = ({ hymn, visible, onClose, onToneChange, currentTone }: ToneNavigateProps) => {
  const theme = useTheme();

  // const styles = StyleSheet.create({});

  const handleToneUp = () => {
    try {
      const newTone = transpose(currentTone).up(1).toString();
      const transposedHymn = HymnService.transposeHymn(hymn, newTone);
      onToneChange(transposedHymn);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToneDown = () => {
    try {
      const newTone = transpose(currentTone).down(1).toString();
      const transposedHymn = HymnService.transposeHymn(hymn, newTone);
      onToneChange(transposedHymn);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <FAB.Group
      open={visible}
      visible={visible}
      icon="close"
      backdropColor="rgba(255,255,255,0.35)"
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
