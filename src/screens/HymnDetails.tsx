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
  const FONT_SIZE_INITIAL = 8;
  const FONT_MARGIN_RIGHT_INITIAL = Platform.OS === "web" ? 50 : 0;
  const STEP_FONT_SIZE = 1;
  const route = useRoute<HymnDetailsRouteProp>();
  const navigation = useNavigation();
  const { hymnCode: hymnCode } = route.params;

  const [fontSize, setFontSize] = useState(FONT_SIZE_INITIAL);
  const [fontSizeAutoAdjusted, setFontSizeAutoAdjusted] = useState(false);
  const [fontMaxSizePortrait, setFontMaxSizePortrait] = useState(FONT_SIZE_INITIAL);
  const [fontMaxSizeLandscape, setFontMaxSizeLandscape] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowWidthReference, setWindowWidthReference] = useState(0);

  const [textHeight, setTextHeight] = useState(0);
  const [singleLineHeight, setSingleLineHeight] = useState(0);
  const [hymn, setHymn] = useState<HymnModel | null>(null);
  const [textColor, setTextColor] = useState(theme.colors.background);
  //const [textColor, setTextColor] = useState(theme.colors.secondary);
  const [textMarginRight, setTextMarginRight] = useState(FONT_MARGIN_RIGHT_INITIAL);

  const [fontSizeReference, setFontSizeReference] = useState(FONT_SIZE_INITIAL);
  const [hymnTitle, setTitle] = useState<string>("");
  const [hymnContent, setHymnContent] = useState<string>("");
  const [isPortrait, setIsPortrait] = useState(true);

  const getLongestLine = (hymn: HymnModel) => {
    const lines = hymn.content;
    const longestLine = lines.reduce((longest, line) => (line.length > longest.length ? line : longest), "");
    return longestLine;
  };

  const handleTextLayout = (event: LayoutChangeEvent) => {
    if (fontSizeAutoAdjusted) return;

    const height = event.nativeEvent.layout.height;
    if (!singleLineHeight) {
      setSingleLineHeight(height);
    }
    setTextHeight(height);
  };

  const onPinchEvent = (event: PinchGestureHandlerGestureEvent) => {
    if (event.nativeEvent.scale) {
      const fontMaxSize = isPortrait ? fontMaxSizePortrait : fontMaxSizeLandscape;
      setFontSize(() => Math.max(10, Math.min(fontMaxSize, fontSizeReference * event.nativeEvent.scale)));
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
        setHymnContent(getLongestLine(hymn));
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
      setWindowWidth(window.width);
    });
    setIsPortrait(Dimensions.get("window").height > Dimensions.get("window").width);
    setWindowWidth(Dimensions.get("window").width);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!windowWidthReference) return;
    if (!fontSizeAutoAdjusted) return;

    if (!isPortrait && !fontMaxSizeLandscape) setFontMaxSizeLandscape((fontMaxSizePortrait / windowWidthReference) * windowWidth);

    setFontSize((fontSize / windowWidthReference) * windowWidth);
    setWindowWidthReference(windowWidth);
  }, [isPortrait]);

  useEffect(() => {
    if (!hymn) return;
    if (fontSizeAutoAdjusted) return;
    if (textHeight && singleLineHeight) {
      if (textHeight > singleLineHeight * 1.5) {
        setFontSize(fontSize - STEP_FONT_SIZE);
        setFontMaxSizePortrait(fontSize - STEP_FONT_SIZE);
        setFontSizeAutoAdjusted(true);
        setWindowWidthReference(windowWidth);

        setHymnContent(hymn.content.join("\n"));
        setTextColor(theme.colors.secondary);
        setTextMarginRight(0);
      } else {
        setSingleLineHeight(textHeight);
        setFontSize(fontSize + STEP_FONT_SIZE);
      }
    }
  }, [textHeight]);

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
            onLayout={handleTextLayout}
            style={[
              styles.hymnText,
              {
                fontSize: fontSize,
                color: textColor,
                marginRight: textMarginRight,
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
