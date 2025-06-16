// src/screens/Preferences.tsx
import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text, Platform, type LayoutChangeEvent } from "react-native";
import { useTheme, Appbar, List, Button, SegmentedButtons } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import _ from "lodash";

import { HYMN_MAX_FONT_SIZE, HYMN_MIN_FONT_SIZE, type Theme, THEME_DARK, THEME_LIGHT, THEME_SYSTEM } from "../config/values";
import { ThemeContext } from "../config/Theme/Context";
import StyledVerse from "../components/StyledVerse";
import { usePreferences } from "../hooks/usePreferences";

const Preferences = () => {
  const { preferences, savePreferences } = usePreferences();
  const theme = useTheme();
  const { fontSize, themeName } = preferences;
  const [verseHeight, setVerseHeight] = useState<number>(preferences.fontSize);
  const { themeName: themeNameContext, setThemeName: setThemeNameContext } = useContext(ThemeContext);
  const navigation = useNavigation();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 2000);
  }, []);

  const handleFontSizeChange = _.debounce((value: number) => {
    if (!isLoaded) return;
    savePreferences({ ...preferences, fontSize: value });
  }, 150);

  const handleThemeChange = (value: Theme) => {
    setThemeNameContext(value);
    savePreferences({ ...preferences, themeName: value });
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
            <List.Subheader style={styles.subHeader}>Font Size ({fontSize})</List.Subheader>
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
              onValueChange={handleThemeChange}
              buttons={[
                { label: "Sistema", value: THEME_SYSTEM },
                { label: "Dark", value: THEME_DARK },
                { label: "Light", value: THEME_LIGHT },
              ]}
            />
          </List.Section>
        </ScrollView>
        <Button mode="contained" onPress={() => navigation.goBack()}>
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
