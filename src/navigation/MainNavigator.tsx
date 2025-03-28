// src/navigation/MainNavigator.tsx
import React from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import Home from "../screens/Home";
import Preferences from "../screens/Preferences";
import Bookmarks from "../screens/Bookmarks";
import HymnDetails from "../screens/HymnDetails";
import DrawerContent from "../screens/DrawerContent";
import { Platform } from "react-native";
import { HymnModel } from "../domain/HymnModel";

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Preferences: undefined;
  Bookmarks: undefined;
  HymnDetails: { hymnCode: string; hymnsCode: string[] };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

const MainNavigator = () => {
  if (Platform.OS !== "web") {
    React.useEffect(() => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }, []);
  }

  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="HomeStack" component={HomeStackNavigator} />
      <Drawer.Screen name="Preferences" component={Preferences} />
      <Drawer.Screen name="Bookmarks" component={Bookmarks} />
    </Drawer.Navigator>
  );
};

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
      screenListeners={{
        beforeRemove: () => {
          if (Platform.OS !== "web") ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="HymnDetails"
        component={HymnDetails}
        listeners={{
          focus: () => {
            if (Platform.OS !== "web") ScreenOrientation.unlockAsync();
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
