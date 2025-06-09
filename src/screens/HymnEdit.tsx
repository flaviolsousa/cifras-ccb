import React, { useState, useEffect } from "react";
import { View, ScrollView, ToastAndroid, Platform } from "react-native";
import { Appbar, Button, Text, TextInput, SegmentedButtons, useTheme, IconButton, Card } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import useHymnData from "../hooks/useHymnData";
import * as Clipboard from "expo-clipboard";
import { transpose } from "chord-transposer";

const RHYTHM_OPTIONS = [
  { label: "Canção", value: "Canção" },
  { label: "Valsa", value: "Valsa" },
  { label: "Guarânia", value: "Guarânia" },
];

const LEVEL_OPTIONS = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
];

const TONE_OPTIONS = ["A", "B", "C", "D", "E", "F", "G", "Ab", "Bb", "Db", "Eb", "Gb"];

const TonePanel = ({ onToneUp, onToneDown }: { onToneUp: () => void; onToneDown: () => void }) => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        elevation: 4,
        zIndex: 5,
      }}
    >
      <IconButton icon="minus" size={32} onPress={onToneDown} />
      <IconButton icon="plus" size={32} onPress={onToneUp} />
    </View>
  );
};

const HymnEdit = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { hymnCode } = route.params as { hymnCode: string };
  const { hymn, updateHymn } = useHymnData(hymnCode);
  const [jsonPreview, setJsonPreview] = useState("");

  // Update JSON preview whenever hymn changes
  useEffect(() => {
    /*{
  "version": "v3",
  "title": "Oh! Vem, sim, vem",
  "level": 3,
  "tone": {
    "original": "Bb",
    "selected": "A"
  },
  "rhythm": "Valsa",*/

    if (hymn) {
      const formattedHymn = {
        version: hymn.version,
        title: hymn.title,
        level: hymn.level,
        tone: {
          original: hymn.tone.original,
          selected: hymn.tone.selected,
        },
        rhythm: hymn.rhythm,
        score: hymn.score,
      };
      setJsonPreview(JSON.stringify(hymn, null, 2));
    }
  }, [hymn]);

  const handleCopyJson = async () => {
    await Clipboard.setStringAsync(jsonPreview);
    if (Platform.OS === "android") {
      ToastAndroid.show("JSON copiado!", ToastAndroid.SHORT);
    }
  };

  const adjustTone = (direction: "up" | "down") => {
    if (!hymn) return;

    // Adjust tone for introduction
    hymn.score.introduction = hymn.score.introduction.map((chord) =>
      direction === "up" ? transpose(chord).up(1).toString() : transpose(chord).down(1).toString(),
    );

    // Adjust tone for stanzas
    hymn.score.stanzas.forEach((stanza) => {
      if (!stanza.text) return;
      stanza.text = stanza.text.map((line) =>
        line.replace(
          /\[([^\]|]+)(\|[^\]]*)?\]/g,
          (_, chord, annotation = "") =>
            `[${direction === "up" ? transpose(chord).up(1).toString() : transpose(chord).down(1).toString()}${annotation}]`,
        ),
      );
    });

    updateHymn({ ...hymn });
  };

  if (!hymn) return null;

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Editar Hino" />
      </Appbar.Header>

      <ScrollView style={{ padding: 16 }}>
        <Text variant="titleMedium">Nível</Text>
        <SegmentedButtons
          value={hymn.level.toString()}
          onValueChange={(value) => {
            hymn.level = parseInt(value);
            updateHymn({ ...hymn });
          }}
          buttons={LEVEL_OPTIONS}
        />

        <Text variant="titleMedium" style={{ marginTop: 16 }}>
          Tom Original
        </Text>
        <SegmentedButtons
          value={hymn.tone.original}
          onValueChange={(value) => {
            hymn.tone.original = value;
            updateHymn({ ...hymn });
          }}
          buttons={TONE_OPTIONS.map((tone) => ({ value: tone, label: tone }))}
        />

        <Text variant="titleMedium" style={{ marginTop: 16 }}>
          Tom Atual
        </Text>
        <SegmentedButtons
          value={hymn.tone.selected}
          onValueChange={(value) => {
            hymn.tone.selected = value;
            updateHymn({ ...hymn });
          }}
          buttons={TONE_OPTIONS.map((tone) => ({ value: tone, label: tone }))}
        />

        <Text variant="titleMedium" style={{ marginTop: 16 }}>
          Ritmo
        </Text>
        <SegmentedButtons
          value={hymn.rhythm}
          onValueChange={(value) => {
            hymn.rhythm = value;
            updateHymn({ ...hymn });
          }}
          buttons={RHYTHM_OPTIONS}
        />

        <Card style={{ marginVertical: 8 }}>
          <Card.Content>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text variant="titleMedium">Preview do JSON</Text>
              <IconButton icon="content-copy" onPress={handleCopyJson} />
            </View>
            <Text style={{ fontFamily: "monospace" }}>{jsonPreview}</Text>
          </Card.Content>
        </Card>
      </ScrollView>

      <TonePanel onToneUp={() => adjustTone("up")} onToneDown={() => adjustTone("down")} />
    </View>
  );
};

export default HymnEdit;
