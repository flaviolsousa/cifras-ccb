import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface ScoreDetailsProps {
  rhythm: string;
  tone: string;
  toneOriginal: string;
  capo: number;
}

const ScoreDetails = ({ rhythm, tone, toneOriginal, capo }: ScoreDetailsProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {rhythm && (
        <View style={styles.detail}>
          <Text variant="labelSmall" style={{ color: theme.colors.secondary }}>
            Ritmo:
          </Text>
          <Text variant="bodyMedium">{rhythm}</Text>
        </View>
      )}
      {tone && (
        <View style={styles.detail}>
          <Text variant="labelSmall" style={{ color: theme.colors.secondary }}>
            Tom:
          </Text>
          <Text variant="bodyMedium">{tone}</Text>
        </View>
      )}
      {capo !== undefined && capo > 0 && (
        <View style={styles.detail}>
          <Text variant="labelSmall" style={{ color: theme.colors.secondary }}>
            Capo:
          </Text>
          <Text variant="bodyMedium">
            {capo}ª casa ({toneOriginal || ""})
          </Text>
        </View>
      )}
    </View>
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
