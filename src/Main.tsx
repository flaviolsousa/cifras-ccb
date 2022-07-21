import React from 'react';
import { Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { Button } from 'react-native-paper';
import DrawerContent from './views/DrawerContent';

const Drawer = createDrawerNavigator();

function HomeScreen() {
  const theme = useTheme();
  return (
    <View
      style={{
        ...theme,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Home Screen</Text>
      <Button
        icon="camera"
        mode="contained"
        onPress={() => console.log('Pressed')}
      >
        Press me
      </Button>
    </View>
  );
}
function SecondScreen() {
  const theme = useTheme();
  return (
    <View
      style={{
        ...theme,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Home Screen</Text>
      <Button
        icon="camera"
        mode="contained"
        onPress={() => console.log('Pressed')}
      >
        Press me
      </Button>
    </View>
  );
}
function Main() {
  const theme = useTheme();
  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen name="Home" component={HomeScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default Main;
