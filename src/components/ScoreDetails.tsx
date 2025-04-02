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
}

const ScoreDetails = ({ rhythm, tone, toneOriginal, capo, onToneChange }: ScoreDetailsProps) => {
  const theme = useTheme();
  const [toneSelectorVisible, setToneSelectorVisible] = useState(false);

  const handleToneSelect = (newTone: string) => {
    onToneChange?.(newTone);
    setToneSelectorVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        {rhythm && (
          <View style={styles.detail}>
            <Text variant="labelMedium" style={{ color: theme.colors.secondary }}>
              Ritmo:
            </Text>
            <Text variant="bodyLarge">{rhythm}</Text>
          </View>
        )}
        {tone && (
          <View style={styles.detail}>
            <Text variant="labelMedium" style={{ color: theme.colors.secondary }}>
              Tomxx:
            </Text>
            <Pressable onPress={() => setToneSelectorVisible(true)}>
              <Text variant="bodyLarge" style={{ textDecorationLine: "underline" }}>
                {tone}
              </Text>
            </Pressable>
          </View>
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

      <ToneSelector visible={toneSelectorVisible} currentTone={tone} onSelect={handleToneSelect} onDismiss={() => setToneSelectorVisible(false)} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 16,

    // borderColor: "blue",
    // borderWidth: 1,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,

    // borderColor: "red",
    // borderWidth: 1,
  },
});

export default ScoreDetails;
