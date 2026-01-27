import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

const themes = {
  light: {
    ...DefaultTheme,
    ...MD3LightTheme,
    colors: {
      ...DefaultTheme.colors,
      ...MD3LightTheme.colors,
      tertiary: "#9b88bb",
    },
    fonts: {
      ...DefaultTheme.fonts,
      ...MD3LightTheme.fonts,
    },
  },
  dark: {
    ...DarkTheme,
    ...MD3DarkTheme,
    colors: {
      ...DarkTheme.colors,
      ...MD3DarkTheme.colors,
    },
    fonts: {
      ...DarkTheme.fonts,
      ...MD3DarkTheme.fonts,
    },
  },
};

export default themes;
