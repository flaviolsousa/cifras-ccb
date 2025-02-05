import React from "react";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import { Provider as ReduxProvider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { store } from "./src/store";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./src/navigation/MainNavigator";

import { useTheme, Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";

export default function App() {
  const [fontsLoaded] = useFonts({
    HackRegular: require("./assets/fonts/hack-mono/Hack-Regular.ttf"),
    UbuntuMonoRegular: require("./assets/fonts/ubuntu/UbuntuMono-R.ttf"),
    UbuntuRegular: require("./assets/fonts/ubuntu/Ubuntu-R.ttf"),
  });

  const theme = useTheme();
  const colorScheme = useColorScheme();

  console.log("theme", theme);
  console.log("theme.dark", theme.dark);
  console.log("colorScheme", colorScheme);
  const navigationTheme = colorScheme == "dark" ? DarkTheme : DefaultTheme;

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ReduxProvider store={store}>
      <GestureHandlerRootView>
        <PaperProvider theme={colorScheme == "dark" ? MD3DarkTheme : MD3LightTheme}>
          <NavigationContainer theme={navigationTheme}>
            <MainNavigator />
          </NavigationContainer>
        </PaperProvider>
      </GestureHandlerRootView>
    </ReduxProvider>
  );
}
