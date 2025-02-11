import React, { useState, useMemo } from "react";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import { Provider as ReduxProvider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { store } from "./src/store";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./src/navigation/MainNavigator";

import { Provider as PaperProvider } from "react-native-paper";
import { useColorScheme } from "react-native";
import theme from "./src/config/Theme/theme";
import { ThemeContext } from "./src/config/Theme/Context";
import { THEME_DARK, THEME_SYSTEM } from "./src/config/values";

export default function App() {
  const [fontsLoaded] = useFonts({
    HackRegular: require("./assets/fonts/hack-mono/Hack-Regular.ttf"),
    UbuntuMonoRegular: require("./assets/fonts/ubuntu/UbuntuMono-R.ttf"),
    UbuntuRegular: require("./assets/fonts/ubuntu/Ubuntu-R.ttf"),
  });

  const colorScheme = useColorScheme();
  const [themeName, setThemeName] = useState(THEME_SYSTEM);
  const themePreferences = useMemo(() => ({ themeName, setThemeName }), [themeName, setThemeName]);
  const selectedTheme = themeName === THEME_SYSTEM ? colorScheme : themeName;
  const _theme = selectedTheme === THEME_DARK ? theme.dark : theme.light;

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ThemeContext.Provider value={themePreferences}>
      <ReduxProvider store={store}>
        <GestureHandlerRootView>
          <PaperProvider theme={_theme}>
            <NavigationContainer theme={_theme}>
              <MainNavigator />
            </NavigationContainer>
          </PaperProvider>
        </GestureHandlerRootView>
      </ReduxProvider>
    </ThemeContext.Provider>
  );
}
