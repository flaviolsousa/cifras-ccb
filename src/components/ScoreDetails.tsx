import React, { useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import ToneSelector from "./ToneSelector";
import RhythmDisplay from "./RhythmDisplay";
import DifficultyIndicator from "./DifficultyIndicator";
import { HymnModel } from "../domain/HymnModel";
import HymnService from "../services/Hymn/HymnService";

interface ScoreDetailsProps {
  hymn: HymnModel;
  onToneChange: (transposedHymn: HymnModel) => void;
}

const ScoreDetails = ({ hymn, onToneChange }: ScoreDetailsProps) => {
  const theme = useTheme();
  const [toneSelectorVisible, setToneSelectorVisible] = useState(false);
  const [rhythmPopupVisible, setRhythmPopupVisible] = useState(false);

  const rhythm = hymn?.rhythm;
  const tone = hymn?.tone?.selected;
  const toneOriginal = hymn?.tone?.original;
  const capo = tone && toneOriginal ? HymnService.getCapoPosition(toneOriginal, tone) : 0;
  const sigN = hymn?.measures?.sigN;
  const sigD = hymn?.measures?.sigD;
  const time = hymn?.time?.text;

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
    rhythmSelector: {
      backgroundColor: theme.colors.elevation.level2,
      padding: 8,
      borderRadius: 8,
    },
    rhythmSelectorPressed: {
      backgroundColor: theme.colors.elevation.level5,
    },
  });

  const handleToneSelect = (newTone: string) => {
    const transposedHymn = HymnService.transposeHymn(hymn, newTone);

    HymnService.logTranspose(hymn.code, newTone);

    onToneChange(transposedHymn);
    setToneSelectorVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        {/* First row - Rhythm only */}
        <View style={styles.row}>
          {rhythm && (
            <Pressable
              style={({ pressed }) => [styles.rhythmSelector, pressed && styles.rhythmSelectorPressed]}
              onPress={() => setRhythmPopupVisible(true)}
            >
              <View style={styles.detail}>
                <Text variant="labelMedium" style={{ color: theme.colors.secondary }}>
                  Ritmo:
                </Text>
                <RhythmDisplay rhythmType={rhythm} showPopup={rhythmPopupVisible} onDismiss={() => setRhythmPopupVisible(false)} />
              </View>
            </Pressable>
          )}
        </View>
        {/* Second row - Division and Time */}
        <View style={styles.row}>
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
        {/* Third row - Tone and Capo */}
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

          {capo > 0 && (
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

        {/* Fourth row - Difficulty */}
        {hymn.level && (
          <View style={styles.row}>
            <Text variant="labelMedium" style={{ color: theme.colors.secondary }}>
              Dificuldade:
            </Text>
            <DifficultyIndicator level={hymn.level} />
          </View>
        )}

        {/* Fifth row - Initial Observation */}
        {hymn.score?.initialObservation && (
          <>
            <View
              style={{
                borderBottomColor: theme.colors.onSurfaceDisabled,
                borderBottomWidth: StyleSheet.hairlineWidth,
                marginVertical: 8,
              }}
            />
            <View style={styles.row}>
              <Text variant="bodyMedium" style={{ flex: 1 }}>
                {hymn.score.initialObservation}
              </Text>
            </View>
          </>
        )}
      </View>

      <ToneSelector
        visible={toneSelectorVisible}
        currentTone={tone}
        originalTone={toneOriginal}
        onSelect={handleToneSelect}
        onDismiss={() => setToneSelectorVisible(false)}
      />
    </>
  );
};

export default ScoreDetails;
