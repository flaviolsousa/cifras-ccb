import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import DrawerContent from './views/DrawerContent';

import HomeView from './views/HomeView';
import BookmarkView from './views/BookmarkView';
import PreferenceView from './views/PreferenceView';

const Drawer = createDrawerNavigator();

function Main() {
  const theme = useTheme();
  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
        initialRouteName="HomeView"
      >
        <Drawer.Screen name="HomeView" component={HomeView} />
        <Drawer.Screen name="PreferenceView" component={PreferenceView} />
        <Drawer.Screen name="BookmarkView" component={BookmarkView} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default Main;
