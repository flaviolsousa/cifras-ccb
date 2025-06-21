// src/screens/SplashScreen.tsx
import React, { useEffect } from "react";
import { Image, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/MainNavigator";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Screen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const opacity = new Animated.Value(0);

  useEffect(() => {
    const prepare = async () => {
      try {
        // Add any initialization logic here (fonts, data loading, etc)
        await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay for demo
      } catch (e) {
        console.warn(e);
      } finally {
        // Hide the native splash screen
        await SplashScreen.hideAsync();

        // Start our custom animation
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }).start(() => {
          setTimeout(() => {
            Animated.timing(opacity, {
              toValue: 0,
              duration: 800,
              useNativeDriver: false,
            }).start(() => {
              navigation.replace("Home");
            });
          }, 1500);
        });
      }
    };

    prepare();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Image source={require("../../assets/splash-icon.png")} style={styles.image} resizeMode="contain" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#fff', // Ajuste conforme o tema
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default Screen;
