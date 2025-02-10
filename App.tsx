import React from "react";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import { Provider as ReduxProvider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { store } from "./src/store";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./src/navigation/MainNavigator";

import { Provider as PaperProvider } from "react-native-paper";
import { useColorScheme } from "react-native";
import theme from "./src/constants/theme";

export default function App() {
  const [fontsLoaded] = useFonts({
    HackRegular: require("./assets/fonts/hack-mono/Hack-Regular.ttf"),
    UbuntuMonoRegular: require("./assets/fonts/ubuntu/UbuntuMono-R.ttf"),
    UbuntuRegular: require("./assets/fonts/ubuntu/Ubuntu-R.ttf"),
  });

  //const theme = useTheme();
  const colorScheme = useColorScheme();
  const _theme = colorScheme == "dark" ? theme.dark : theme.light;

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ReduxProvider store={store}>
      <GestureHandlerRootView>
        <PaperProvider theme={_theme}>
          <NavigationContainer theme={_theme}>
            <MainNavigator />
          </NavigationContainer>
        </PaperProvider>
      </GestureHandlerRootView>
    </ReduxProvider>
  );
}
