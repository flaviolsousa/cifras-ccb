import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme, Modal, Portal } from "react-native-paper";

interface RhythmPattern {
  slim: string[];
  arrows: string[];
  fingers: string[];
  arrowStyles?: ("sup" | "sub" | "normal")[];
}

const RHYTHM_PATTERNS: Record<string, RhythmPattern> = {
  Canção: {
    slim: ["↓", "↑", "↓", "↓"],
    arrows: ["↓", "↑", "↓", "↓"],
    fingers: ["p", "i", "t", "p"],
    arrowStyles: ["normal", "sub", "sub", "sup", "sup"],
  },
  Valsa: {
    slim: ["↓", "↑", "↑"],
    arrows: ["↓", "↑", "↑"],
    fingers: ["p", "i", "i"],
    arrowStyles: ["sup", "sub", "sub"],
  },
  Guarânia: {
    slim: ["↓", "↑", "↓", "↑", "↓"],
    arrows: ["↓", "↑", "↓", "↑", "↓"],
    fingers: ["p", "i", "p", "i", "t"],
    arrowStyles: ["normal", "sub", "sub", "sub", "sub"],
  },
};

interface RhythmDisplayProps {
  rhythmType: string;
  showPopup?: boolean;
  onDismiss?: () => void;
}

// Função utilitária para desenhar a seta customizada
function RenderArrow({ arrow, style, primaryColor }: { arrow: string; style: "sup" | "sub" | "normal"; primaryColor: string }) {
  const isDown = arrow === "↓";
  const baseWidth = 36;
  const partHeight = 20;
  const shaftWidth = 6;
  const triangleSize = 22;

  const Shaft = (
    <View
      style={{
        width: shaftWidth,
        height: partHeight,
        backgroundColor: primaryColor,
        alignSelf: "center",
      }}
    />
  );

  const Triangle = (
    <View
      style={{
        width: 0,
        height: 0,
        borderLeftWidth: triangleSize / 2,
        borderRightWidth: triangleSize / 2,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        ...(isDown
          ? {
              borderTopWidth: partHeight,
              borderTopColor: primaryColor,
            }
          : {
              borderBottomWidth: partHeight,
              borderBottomColor: primaryColor,
            }),
        alignSelf: "center",
      }}
    />
  );

  // Define a ordem dos elementos conforme o estilo
  let elements: React.ReactNode[] = [];
  if (style === "normal") {
    elements = isDown ? [Shaft, Shaft, Triangle] : [Triangle, Shaft, Shaft];
  } else if (style === "sup") {
    elements = isDown
      ? [Shaft, Triangle, <View key="spacer" style={{ height: partHeight }} />]
      : [Triangle, Shaft, <View key="spacer" style={{ height: partHeight }} />];
  } else if (style === "sub") {
    elements = isDown
      ? [<View key="spacer" style={{ height: partHeight }} />, Shaft, Triangle]
      : [<View key="spacer" style={{ height: partHeight }} />, Triangle, Shaft];
  }

  return (
    <View style={{ width: baseWidth, height: partHeight * 3, alignItems: "center" }}>
      {elements.map((el, idx) => React.cloneElement(el as React.ReactElement, { key: idx }))}
    </View>
  );
}

const RhythmDisplay: React.FC<RhythmDisplayProps> = ({ rhythmType, showPopup = false, onDismiss }) => {
  const theme = useTheme();
  const pattern = RHYTHM_PATTERNS[rhythmType];

  const styles = StyleSheet.create({
    compactContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    expandedContainer: {
      flexDirection: "column",
      alignItems: "center",
      gap: 24,
      padding: 24,
      minWidth: 280,
    },
    expandedArrowsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
      borderTopColor: theme.colors.elevation.level5,
      borderTopWidth: 3,
      borderBottomColor: theme.colors.elevation.level5,
      borderBottomWidth: 1,
      paddingVertical: 8,
    },
    expandedFingersContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
    },
    rhythmColumn: {
      width: 32,
      alignItems: "center",
      justifyContent: "center",
    },
    expandedFinger: {
      fontSize: 16,
      color: theme.colors.secondary,
      textTransform: "uppercase",
    },
    legends: {
      flexDirection: "column",
      textAlign: "center",
      gap: 5,
      marginTop: 16,
    },
    legend: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      marginTop: 4,
    },
    arrow: {
      fontSize: 20,
      color: theme.colors.primary,
    },
    modalContainer: {
      backgroundColor: "white",
      padding: 24,
      margin: 20,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      maxWidth: 400,
      alignSelf: "center",
    },
  });

  if (!pattern) return null;

  const renderPattern = (expanded: boolean) => {
    if (!expanded) {
      return (
        <View style={styles.compactContainer}>
          <Text variant="bodyLarge">{rhythmType}</Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.secondary }}>
            (
            {pattern.slim.map((arrow, index) => (
              <Text style={styles.arrow} key={`compact-arrow-${index}`}>
                {arrow}
              </Text>
            ))}
            )
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.expandedContainer}>
        <Text variant="headlineMedium">{rhythmType}</Text>
        <View style={styles.expandedArrowsContainer}>
          {pattern.arrows.map((arrow, index) => (
            <View key={`column-arrows-${index}`} style={styles.rhythmColumn}>
              <RenderArrow arrow={arrow} style={pattern.arrowStyles?.[index] || "normal"} primaryColor={theme.colors.primary} />
            </View>
          ))}
        </View>
        <View style={styles.expandedFingersContainer}>
          {pattern.fingers.map((finger, index) => (
            <View key={`column-fingers-${index}`} style={styles.rhythmColumn}>
              <Text style={styles.expandedFinger}>{finger}</Text>
            </View>
          ))}
        </View>
        <View style={styles.legends}>
          <Text style={styles.legend}>P = 👍 polegar</Text>
          <Text style={styles.legend}>I = 👆 indicador</Text>
          <Text style={styles.legend}>T = ✋ todos</Text>
        </View>
      </View>
    );
  };

  if (showPopup) {
    return (
      <Portal>
        <Modal visible={true} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
          {renderPattern(true)}
        </Modal>
      </Portal>
    );
  }

  return renderPattern(false);
};

export default RhythmDisplay;
