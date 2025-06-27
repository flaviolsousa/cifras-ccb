import React, { useState, useEffect } from "react";
import { View, ScrollView, ToastAndroid, Platform } from "react-native";
import { Appbar, Text, SegmentedButtons, useTheme, IconButton, Card } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { transpose } from "chord-transposer";
import { HymnModel, Stanza } from "../domain/HymnModel";
import { getHymnModel } from "../services/Hymn/HymnImports";

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

const CHORD_MAP = {
  Gb: "F#",
  Bb: "A#",
};

const TONE_OPTIONS = ["A", "B", "C", "D", "E", "F", "G", "Ab", "Bb", "Db", "Eb", "Gb"];

const getDefaultSelectedTone = (hymn: HymnModel) => {
  if (!hymn.score || !hymn.score.stanzas || hymn.score.stanzas.length === 0) return "C"; // Default to C if no stanzas
  const firstStanza = hymn.score.stanzas[0];
  if (!firstStanza.text || firstStanza.text.length === 0) return "C"; // Default to C if no text in the first stanza
  const firstLine = firstStanza.text[0];
  const chordRegex = /\[([^\]|]+)/;
  const match = chordRegex.exec(firstLine);
  return match ? match[1] : "C"; // Return the first chord or default to C
};

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
  const [hymn, setHymn] = useState<HymnModel | null>(null);
  const [jsonPreview, setJsonPreview] = useState("");

  // Fetch hymn data on component mount
  useEffect(() => {
    const fetchHymn = async () => {
      const fetchedHymn = await getHymnModel(hymnCode);
      fetchedHymn.code = hymnCode;
      fetchedHymn.score.introduction = fetchedHymn.score.introduction || [];
      fetchedHymn.score.stanzas.forEach((stanza: Stanza) => {
        if (Array.isArray(stanza.text)) {
          stanza.text = stanza.text.map((line: string) => line.replace(/\s{2,}/g, " "));
        }
      });

      setHymn(fetchedHymn);
    };
    fetchHymn();
  }, [hymnCode]);

  // Update JSON preview whenever hymn changes
  useEffect(() => {
    if (hymn) {
      const formattedHymn: any = {
        code: hymnCode,
        version: hymn.version,
        title: hymn.title,
        level: !!hymn.level ? hymn.level : undefined,
        tone: {
          original: hymn.tone.original,
          selected: hymn.tone.selected ?? getDefaultSelectedTone(hymn),
        },
        rhythm: hymn.rhythm,
        score: {
          introduction: [],
          stanzas: hymn.score.stanzas,
        },
      };

      const firstStanza = formattedHymn.score.stanzas[0];
      if (firstStanza && firstStanza.text && firstStanza.text.length > 0) {
        const firstLine = firstStanza.text[0];
        const extractedChords: string[] = [];
        const chordRegex = /\[([^\]|]+)(\|[^\]]*)?\]/g;
        let match;
        while ((match = chordRegex.exec(firstLine)) !== null) {
          extractedChords.push(match[1]);
        }
        formattedHymn.score.introduction.push(...extractedChords);
      }

      formattedHymn.score.stanzas.forEach((stanza: any) => {
        if (stanza.text && Array.isArray(stanza.text)) {
          // Ensure text is an array
          stanza.text = stanza.text.map((line: string) => line.replace(/_/g, " "));
        }
      });

      setJsonPreview(JSON.stringify(formattedHymn, null, 2) + "\n");
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
    hymn.score.introduction = hymn.score.introduction
      .map((chord) => (direction === "up" ? transpose(chord).up(1).toString() : transpose(chord).down(1).toString()))
      .map((chord) => CHORD_MAP[chord] || chord);

    // Adjust tone for stanzas
    hymn.score.stanzas.forEach((stanza) => {
      if (!stanza.text) return;
      stanza.text = stanza.text.map((line) =>
        line.replace(/\[([^\]|]+)(\|[^\]]*)?\]/g, (_, chord, annotation = "") => {
          let transposedChord = direction === "up" ? transpose(chord).up(1).toString() : transpose(chord).down(1).toString();
          transposedChord = CHORD_MAP[transposedChord] || transposedChord;
          return `[${transposedChord}${annotation}]`;
        }),
      );
    });

    setHymn({ ...hymn });
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
          value={(hymn.level ?? 0).toString()}
          onValueChange={(value) => {
            hymn.level = parseInt(value);
            setHymn({ ...hymn });
          }}
          buttons={LEVEL_OPTIONS}
        />

        <Text variant="titleMedium" style={[{ marginTop: 16 }, !hymn.tone?.original && { color: "red" }]}>
          Tom Original
        </Text>
        <SegmentedButtons
          value={hymn.tone.original}
          onValueChange={(value) => {
            hymn.tone.original = value;
            setHymn({ ...hymn });
          }}
          buttons={TONE_OPTIONS.map((tone) => ({ value: tone, label: tone }))}
        />

        <Text variant="titleMedium" style={{ marginTop: 16 }}>
          Tom Atual
        </Text>
        <SegmentedButtons
          value={hymn.tone.selected ?? getDefaultSelectedTone(hymn)}
          onValueChange={(value) => {
            hymn.tone.selected = value;
            setHymn({ ...hymn });
          }}
          buttons={TONE_OPTIONS.map((tone) => ({ value: tone, label: tone }))}
        />

        <Text variant="titleMedium" style={[{ marginTop: 16 }, !hymn.rhythm && { color: "red" }]}>
          Ritmo
        </Text>
        <SegmentedButtons
          value={hymn.rhythm}
          onValueChange={(value) => {
            hymn.rhythm = value;
            setHymn({ ...hymn });
          }}
          buttons={RHYTHM_OPTIONS}
        />

        <Card style={{ marginVertical: 8 }}>
          <Card.Content>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text variant="titleMedium">Preview do JSON</Text>
              {hymn.tone?.original && hymn.rhythm && <IconButton icon="content-copy" onPress={handleCopyJson} />}
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
