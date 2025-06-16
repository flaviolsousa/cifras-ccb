// src/screens/Preferences.tsx
import React, { useState, useContext } from "react";
import { View, StyleSheet, ScrollView, Text, Platform, type LayoutChangeEvent } from "react-native";
import { useTheme, Appbar, List, Button, SegmentedButtons } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import _ from "lodash";

import { HYMN_MAX_FONT_SIZE, HYMN_MIN_FONT_SIZE } from "../config/values";
import { ThemeContext } from "../config/Theme/Context";
import StyledVerse from "../components/StyledVerse";

const Preferences = () => {
  const FONT_SIZE_INITIAL = Platform.OS === "web" ? 30 : 22;
  const theme = useTheme();
  const [verseHeight, setVerseHeight] = useState<number>(FONT_SIZE_INITIAL);
  const { themeName, setThemeName } = useContext(ThemeContext);
  const navigation = useNavigation();

  const [fontSize, setFontSize] = useState(FONT_SIZE_INITIAL);
  //const [themeSelection, setThemeSelection] = useState(themeContext.theme);

  const handleFontSizeChange = _.debounce((value: number) => {
    setFontSize(value);
  }, 150);

  const savePreferences = () => {
    // Save preferences logic here
    navigation.goBack();
  };

  const onVerseLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setVerseHeight(height);
  };

  return (
    <View style={{ ...theme, flex: 1 }}>
      <Appbar.Header elevated={true}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Preferences" />
      </Appbar.Header>
      <View style={{ ...styles.content, flex: 1 }}>
        <ScrollView>
          <List.Section>
            <List.Subheader style={styles.subHeader}>Font Size</List.Subheader>
            <Slider
              style={styles.slideFontSize}
              minimumValue={HYMN_MIN_FONT_SIZE}
              maximumValue={HYMN_MAX_FONT_SIZE}
              step={1}
              value={fontSize}
              onValueChange={handleFontSizeChange}
            />
            <StyledVerse
              line={"Oh! V[C|x1]em, Sen[G|↓↑↓]hor, c[D]om Teu Dom me conso[G]lar.[G|↓].."}
              fontSize={fontSize}
              fontSizeDouble={fontSize * 2}
              verseHeight={verseHeight}
              onChordPress={(chord) => console.log(`Chord pressed: ${chord}`)}
              selectedChord={""}
              onVerseLayout={(event) => onVerseLayout(event)}
              showNotes={true}
            />
          </List.Section>

          <List.Section>
            <List.Subheader style={styles.subHeader}>Theme</List.Subheader>
            <SegmentedButtons
              value={themeName}
              onValueChange={setThemeName}
              buttons={[
                { label: "Sistema", value: "system" },
                { label: "Dark", value: "dark" },
                { label: "Light", value: "light" },
              ]}
            />
          </List.Section>
        </ScrollView>
        <Button mode="contained" onPress={savePreferences}>
          Salvar
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  subHeader: {
    paddingLeft: 0,
  },
  slideFontSize: {
    width: "100%",
  },
});

export default Preferences;
