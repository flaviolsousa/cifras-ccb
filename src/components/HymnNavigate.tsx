import React from "react";
import { FAB } from "react-native-paper";
import { View, StyleSheet } from "react-native";

interface HymnNavigateProps {
  visible: boolean;
  onClose: () => void;
  hymnsCode: string[];
  currentHymnCode: string;
  onNavigate: (hymnCode: string) => void;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    right: 24,
    flexDirection: "row",
    zIndex: 100,
  },
  fab: {
    marginLeft: 12,
  },
});

const HymnNavigate = ({ visible, onClose, hymnsCode, currentHymnCode, onNavigate }: HymnNavigateProps) => {
  if (!visible) return null;
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
    <View style={styles.container} pointerEvents="box-none">
      <FAB icon="chevron-left" onPress={handlePrevious} style={styles.fab} small accessibilityLabel="Anterior" disabled={currentIndex <= 0} />
      <FAB
        icon="chevron-right"
        onPress={handleNext}
        style={styles.fab}
        small
        accessibilityLabel="Próximo"
        disabled={currentIndex >= hymnsCode.length - 1}
      />
      <FAB icon="close" onPress={onClose} style={styles.fab} small accessibilityLabel="Fechar navegação" />
    </View>
  );
};

export default HymnNavigate;
