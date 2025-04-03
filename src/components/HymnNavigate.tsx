import React from "react";
import { FAB } from "react-native-paper";

interface HymnNavigateProps {
  visible: boolean;
  onClose: () => void;
  hymnsCode: string[];
  currentHymnCode: string;
  onNavigate: (hymnCode: string) => void;
}

const HymnNavigate = ({ visible, onClose, hymnsCode, currentHymnCode, onNavigate }: HymnNavigateProps) => {
  const currentIndex = hymnsCode.indexOf(currentHymnCode);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onNavigate(hymnsCode[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < hymnsCode.length - 1) {
      onNavigate(hymnsCode[currentIndex + 1]);
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
          icon: "chevron-right",
          onPress: handleNext,
        },
        {
          icon: "chevron-left",
          onPress: handlePrevious,
        },
      ]}
      onStateChange={({ open }) => {}}
      onPress={() => {
        if (visible) onClose();
      }}
    />
  );
};

export default HymnNavigate;
