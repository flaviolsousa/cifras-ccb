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
  const fontSizeInitial = 16;
  const route = useRoute<HymnDetailsRouteProp>();
  const navigation = useNavigation();
  const { hymnCode: hymnCode } = route.params;
  const [fontSize, setFontSize] = useState(fontSizeInitial);
  const [fontSizeReference, setFontSizeReference] = useState(fontSizeInitial);
  const [hymnContent, setHymnContent] = useState("Letra do hino com acordes");

  const onPinchEvent = (event: PinchGestureHandlerGestureEvent) => {
    if (event.nativeEvent.scale) {
      setFontSize(() => Math.max(10, Math.min(72, fontSizeReference * event.nativeEvent.scale)));
      setHymnContent("!scale: " + event.nativeEvent.scale + " fontSizeRef: " + fontSizeReference + " fontSize: " + fontSize);
    }
  };

  const onPinchStateEvent = (event: HandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.ACTIVE) setFontSizeReference(fontSize);
  };

  return (
    <View style={{ ...theme, flex: 1 }}>
      <Appbar.Header elevated={true}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={`Hino ${hymnCode}`} />
        <IconButton
          icon="information"
          onPress={() => {
            /* Toggle área de detalhes do hino */
          }}
        />
      </Appbar.Header>

      <PinchGestureHandler onGestureEvent={onPinchEvent} onHandlerStateChange={onPinchStateEvent}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[styles.hymnText, { fontSize, color: theme.colors.secondary }]}>{hymnContent}</Text>
        </ScrollView>
      </PinchGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  hymnText: {
    fontFamily: "UbuntuMonoRegular",
  },
});

export default HymnDetails;
