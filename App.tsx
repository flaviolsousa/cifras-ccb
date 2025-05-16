import React, { useState, useMemo, useCallback } from "react";
import "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./src/store";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./src/navigation/MainNavigator";
import { Provider as PaperProvider } from "react-native-paper";
import { useColorScheme, StatusBar } from "react-native";
import theme from "./src/config/Theme/theme";
import { ThemeContext } from "./src/config/Theme/Context";
import { THEME_DARK, THEME_SYSTEM } from "./src/config/values";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    HackRegular: require("./assets/fonts/hack-mono/Hack-Regular.ttf"),
    UbuntuMonoRegular: require("./assets/fonts/ubuntu/UbuntuMono-R.ttf"),
    UbuntuMonoBold: require("./assets/fonts/ubuntu/UbuntuMono-B.ttf"),
    UbuntuMonoBoldItalic: require("./assets/fonts/ubuntu/UbuntuMono-BI.ttf"),
    UbuntuRegular: require("./assets/fonts/ubuntu/Ubuntu-R.ttf"),
  });

  const colorScheme = useColorScheme();
  const [themeName, setThemeName] = useState(THEME_SYSTEM);
  const themePreferences = useMemo(() => ({ themeName, setThemeName }), [themeName, setThemeName]);
  const selectedTheme = themeName === THEME_SYSTEM ? colorScheme : themeName;
  const _theme = selectedTheme === THEME_DARK ? theme.dark : theme.light;

  useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={themePreferences}>
      <ReduxProvider store={store}>
        <PaperProvider theme={_theme}>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} edges={["left", "right", "bottom"]}>
              <StatusBar backgroundColor={_theme.colors.background} barStyle={selectedTheme === THEME_DARK ? "light-content" : "dark-content"} />
              <NavigationContainer theme={_theme}>
                <MainNavigator />
              </NavigationContainer>
            </SafeAreaView>
          </SafeAreaProvider>
        </PaperProvider>
      </ReduxProvider>
    </ThemeContext.Provider>
  );
}
