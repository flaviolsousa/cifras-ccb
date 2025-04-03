import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import ToneSelector from "./ToneSelector";

interface ScoreDetailsProps {
  rhythm: string;
  tone: string;
  toneOriginal: string;
  capo: number;
  onToneChange?: (newTone: string) => void;
  sigN?: number;
  sigD?: number;
  time?: string;
}

const ScoreDetails = ({ rhythm, tone, toneOriginal, capo, onToneChange, sigN, sigD, time }: ScoreDetailsProps) => {
  const theme = useTheme();
  const [toneSelectorVisible, setToneSelectorVisible] = useState(false);

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      gap: 12,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 16,
    },
    detail: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    toneSelector: {
      backgroundColor: theme.colors.elevation.level2,
      padding: 8,
      borderRadius: 8,
    },
    toneSelectorPressed: {
      backgroundColor: theme.colors.elevation.level5,
    },
    toneText: {
      fontWeight: "bold",
    },
  });

  const handleToneSelect = (newTone: string) => {
    onToneChange?.(newTone);
    setToneSelectorVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.row}>
          {rhythm && (
            <View style={styles.detail}>
              <Text variant="labelMedium" style={{ color: theme.colors.secondary }}>
                Ritmo:
              </Text>
              <Text variant="bodyLarge">{rhythm}</Text>
            </View>
          )}
          {sigN && sigD && (
            <View style={styles.detail}>
              <Text variant="labelMedium" style={{ color: theme.colors.secondary }}>
                Divisão:
              </Text>
              <Text variant="bodyLarge">{`${sigN}/${sigD}`}</Text>
            </View>
          )}
          {time && (
            <View style={styles.detail}>
              <Text variant="labelMedium" style={{ color: theme.colors.secondary }}>
                Velocidade:
              </Text>
              <Text variant="bodyLarge">{time}</Text>
            </View>
          )}
        </View>

        <View style={styles.row}>
          {tone && (
            <Pressable
              style={({ pressed }) => [styles.toneSelector, pressed && styles.toneSelectorPressed]}
              onPress={() => setToneSelectorVisible(true)}
            >
              <View style={styles.detail}>
                <Text variant="labelMedium" style={{ color: theme.colors.secondary }}>
                  Tom:
                </Text>
                <Text variant="bodyLarge" style={styles.toneText}>
                  {tone}
                </Text>
              </View>
            </Pressable>
          )}
          {capo !== undefined && toneOriginal && capo > 0 && (
            <View style={styles.detail}>
              <Text variant="labelMedium" style={{ color: theme.colors.secondary }}>
                Capo:
              </Text>
              <Text variant="bodyLarge">
                {capo}ª casa ({toneOriginal || ""})
              </Text>
            </View>
          )}
        </View>
      </View>

      <ToneSelector visible={toneSelectorVisible} currentTone={tone} onSelect={handleToneSelect} onDismiss={() => setToneSelectorVisible(false)} />
    </>
  );
};

export default ScoreDetails;
