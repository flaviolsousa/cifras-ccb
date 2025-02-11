// src/screens/Preferences.tsx
import React, { useState, useContext } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { useTheme, Appbar, List, Button, SegmentedButtons } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import _ from "lodash";

import { HYMN_MAX_FONT_SIZE, HYMN_MIN_FONT_SIZE } from "../config/values";
import { ThemeContext } from "../config/Theme/Context";

const Preferences = () => {
  const theme = useTheme();
  const { themeName, setThemeName } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [fontSize, setFontSize] = useState(16);
  //const [themeSelection, setThemeSelection] = useState(themeContext.theme);

  const handleFontSizeChange = _.debounce((value: number) => {
    setFontSize(value);
  }, 150);

  const savePreferences = () => {
    // Save preferences logic here
    navigation.goBack();
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
            <Text style={{ color: theme.colors.secondary }}>Selected Font Size: {fontSize}</Text>
            <Text style={{ fontSize, color: theme.colors.secondary }}>Ó caro salvador, a Tua voz de amor</Text>
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
