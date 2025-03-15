// src/screens/HymnDetails.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text, Dimensions, Platform, LayoutChangeEvent } from "react-native";
import { useTheme, Appbar, IconButton } from "react-native-paper";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/MainNavigator";
import { PinchGestureHandler, PinchGestureHandlerGestureEvent, HandlerStateChangeEvent, State } from "react-native-gesture-handler";
import HymnService from "../services/Hymn/HymnService";
import { HymnModel } from "../domain/HymnModel";

type HymnDetailsRouteProp = RouteProp<RootStackParamList, "HymnDetails">;

const HymnDetails = () => {
  const theme = useTheme();
  const FONT_SIZE_INITIAL = 16;

  const route = useRoute<HymnDetailsRouteProp>();
  const navigation = useNavigation();
  const { hymnCode: hymnCode } = route.params;

  const [fontSize, setFontSize] = useState(FONT_SIZE_INITIAL);
  const [hymn, setHymn] = useState<HymnModel | null>(null);

  const [fontSizeReference, setFontSizeReference] = useState(FONT_SIZE_INITIAL);
  const [hymnTitle, setTitle] = useState<string>("");
  const [hymnContent, setHymnContent] = useState<string>("");
  const [isPortrait, setIsPortrait] = useState(true);

  const onPinchEvent = (event: PinchGestureHandlerGestureEvent) => {
    if (event.nativeEvent.scale) {
      const fontMinSize = 10;
      const fontMaxSize = 72;
      setFontSize(() => Math.max(fontMinSize, Math.min(fontMaxSize, fontSizeReference * event.nativeEvent.scale)));
    }
  };

  const onPinchStateEvent = (event: HandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setFontSizeReference(fontSize);
    }
  };

  const shouldShowHeader = Platform.OS === "web" || isPortrait;

  useEffect(() => {
    const fetchContent = async () => {
      const hymn = await HymnService.getHymn(hymnCode);
      if (hymn) {
        setHymn(hymn);
        setTitle(`${hymn.code} - ${hymn.title}`);
        setHymnContent(hymn.content.join("\n"));
      } else {
        setTitle(`${hymnCode} - Hymn not found`);
        setHymnContent("TBD");
      }
    };
    fetchContent();
  }, [hymnCode]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      const isPortrait = window.height > window.width;
      setIsPortrait(isPortrait);
    });
    setIsPortrait(Dimensions.get("window").height > Dimensions.get("window").width);
    return () => subscription.remove();
  }, []);

  return (
    <View style={{ ...theme, flex: 1 }}>
      {shouldShowHeader && (
        <Appbar.Header elevated={true}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={hymnTitle} />
          <IconButton
            icon="information"
            onPress={() => {
              /* Toggle detail HymnDetail */
            }}
          />
        </Appbar.Header>
      )}

      <PinchGestureHandler onGestureEvent={onPinchEvent} onHandlerStateChange={onPinchStateEvent}>
        <ScrollView contentContainerStyle={[styles.content, isPortrait ? styles.portrait : styles.landscape]}>
          <Text
            style={[
              styles.hymnText,
              {
                fontSize: fontSize,
                color: theme.colors.secondary,
              },
            ]}
          >
            {hymnContent}
          </Text>
        </ScrollView>
      </PinchGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingHorizontal: 16,
  },
  hymnText: {
    fontFamily: "UbuntuMonoRegular",
  },
  portrait: {},
  landscape: {
    marginTop: 16,
    alignSelf: "center",
    width: "100%",
  },
});

export default HymnDetails;
