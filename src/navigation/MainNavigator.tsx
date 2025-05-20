import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as ScreenOrientation from "expo-screen-orientation";
import React from "react";
import { Platform } from "react-native";
import Bookmarks from "../screens/Bookmarks";
import DrawerContent from "../screens/DrawerContent";
import Home from "../screens/Home";
import HymnDetails from "../screens/HymnDetails";
import Preferences from "../screens/Preferences";
import SplashScreen from "../screens/SplashScreen";

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
