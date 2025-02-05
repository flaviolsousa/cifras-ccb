// src/screens/HymnDetails.tsx
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { useTheme, Appbar, IconButton } from "react-native-paper";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/MainNavigator";
import { PinchGestureHandler, PinchGestureHandlerGestureEvent, HandlerStateChangeEvent, State } from "react-native-gesture-handler";

type HymnDetailsRouteProp = RouteProp<RootStackParamList, "HymnDetails">;

const HymnDetails = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <View style={{ ...theme, flex: 1 }}>
      <Appbar.Header elevated={true}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={"Preferencias"} />
        <IconButton
          icon="information"
          onPress={() => {
            /* Toggle área de detalhes do hino */
          }}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Text>Preferences Screen</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
});

export default HymnDetails;
