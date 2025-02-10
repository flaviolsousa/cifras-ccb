// src/screens/Preferences.tsx
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { useTheme, Appbar, RadioButton, List, Button, SegmentedButtons } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import { HYMN_MAX_FONT_SIZE, HYMN_MIN_FONT_SIZE } from "../constants";

const Preferences = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [fontSize, setFontSize] = useState(16);
  const [themeSelection, setThemeSelection] = useState("system");

  const handleFontSizeChange = (value: number) => {
    setFontSize(value);
  };

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
            <Text>Selected Font Size: {fontSize}</Text>
            <Text style={[styles.exampleSizeText, { fontSize, color: theme.colors.secondary }]}>Cristo</Text>
          </List.Section>

          <List.Section>
            <List.Subheader style={styles.subHeader}>Theme</List.Subheader>
            <SegmentedButtons
              value={themeSelection}
              onValueChange={setThemeSelection}
              buttons={[
                { label: "Sistema", value: "system" },
                { label: "Dark", value: "dark" },
                { label: "Light", value: "light" },
              ]}
            />
          </List.Section>
        </ScrollView>
        <Button mode="contained" onPress={savePreferences}>
          Salvars
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
  exampleSizeText: {},
});

export default Preferences;
