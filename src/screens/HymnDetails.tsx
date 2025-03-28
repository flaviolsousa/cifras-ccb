// src/screens/HymnDetails.tsx
import React, { useState, useEffect, useRef } from "react";
import { Animated, View, StyleSheet, ScrollView, Text, Platform, LayoutChangeEvent } from "react-native";
import { useTheme, Appbar, IconButton, Menu, FAB, Divider } from "react-native-paper";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/MainNavigator";
import { PinchGestureHandler, PinchGestureHandlerGestureEvent, HandlerStateChangeEvent, State } from "react-native-gesture-handler";
import useHymnData from "../hooks/useHymnData";
import useOrientation from "../hooks/useOrientation";

type HymnDetailsRouteProp = RouteProp<RootStackParamList, "HymnDetails">;

const StyledChordText = ({ text, style }: { text: string; style: any }) => {
  const theme = useTheme();
  const parts = text.split(/([^_]+)/g).filter(Boolean);

  return (
    <Text style={style}>
      {parts.map((part, index) =>
        part.includes("_") ? (
          <Text key={index}>{part}</Text>
        ) : (
          <Text key={index} style={{ color: theme.colors.primary }}>
            {part}
          </Text>
        ),
      )}
    </Text>
  );
};

const HymnDetails = () => {
  const theme = useTheme();
  const FONT_SIZE_INITIAL = 16;

  const route = useRoute<HymnDetailsRouteProp>();
  const navigation = useNavigation();
  const { hymnCode, hymnsCode } = route.params;

  const { hymn, title } = useHymnData(hymnCode);
  const [fontSize, setFontSize] = useState(FONT_SIZE_INITIAL);
  const [fontSizeQuarter, setFontSizeQuarter] = useState(Math.floor(FONT_SIZE_INITIAL / 4));
  const [fontSizeDouble, setFontSizeDouble] = useState(Math.floor(FONT_SIZE_INITIAL * 2));
  const [fontSizeReference, setFontSizeReference] = useState(FONT_SIZE_INITIAL);
  const isPortrait = useOrientation();
  const [verseHeights, setVerseHeights] = useState<{ [key: string]: number }>({});

  // Menu
  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => setMenuVisible(!menuVisible);
  const closeMenu = () => setMenuVisible(false);

  // Zoom
  const [zoomControlVisible, setZoomControlVisible] = React.useState(false);
  let zoomControlAction = "";
  const increaseFontSize = () => {
    setFontSize((prev: number) => Math.min(prev + 2, 90));
    zoomControlAction = "increaseFontSize";
  };
  const decreaseFontSize = () => {
    setFontSize((prev: number) => Math.max(prev - 2, 10));
    zoomControlAction = "decreaseFontSize";
  };
  const fontSizeMenu = () => {
    setZoomControlVisible(true);
    closeMenu();
  };

  const onPinchEvent = (event: PinchGestureHandlerGestureEvent) => {
    if (event.nativeEvent.scale) {
      const fontMinSize = 10;
      const fontMaxSize = 90;
      let fontSize = Math.floor(Math.max(fontMinSize, Math.min(fontMaxSize, fontSizeReference * event.nativeEvent.scale)));
      setFontSize(fontSize);
    }
  };

  const onPinchStateEvent = (event: HandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setFontSizeReference(fontSize);
    }
  };

  const onVerseLayout = (event: LayoutChangeEvent, stanzaIndex: number, verseIndex: number) => {
    const { height } = event.nativeEvent.layout;
    setVerseHeights((prev) => ({
      ...prev,
      [`${stanzaIndex}-${verseIndex}`]: height,
    }));
  };

  const shouldShowHeader = Platform.OS === "web" || isPortrait;

  useEffect(() => {
    setFontSizeQuarter(Math.floor(fontSize / 4));
    setFontSizeDouble(Math.floor(fontSize * 2));
  }, [fontSize]);

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollYValue = useRef(0);
  const lastScrollY = useRef(0);
  const [headerVisible, setHeaderVisible] = useState(true);

  const headerTranslateY = useRef(new Animated.Value(0)).current;

  const showHeader = () => {
    Animated.spring(headerTranslateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
    }).start();
  };

  const hideHeader = () => {
    Animated.spring(headerTranslateY, {
      toValue: -64,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
    }).start();
  };

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: true,
    listener: (event) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      const deltaY = currentScrollY - lastScrollY.current;

      // Show header when scrolling up (deltaY < 0)
      if (deltaY < 0 && !headerVisible) {
        setHeaderVisible(true);
        showHeader();
      }
      // Hide header when scrolling down (deltaY > 0)
      else if (deltaY > 0 && headerVisible && currentScrollY > 64) {
        setHeaderVisible(false);
        hideHeader();
      }

      lastScrollY.current = currentScrollY;
    },
  });

  return (
    <View style={{ ...theme, flex: 1 }}>
      {shouldShowHeader && (
        <Animated.View
          style={{
            transform: [{ translateY: headerTranslateY }],
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            backgroundColor: theme.colors.background,
          }}
        >
          <Appbar.Header elevated={true}>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title={title} />
            <Menu visible={menuVisible} onDismiss={closeMenu} anchor={<IconButton icon="menu" onPress={toggleMenu} />}>
              <Menu.Item onPress={fontSizeMenu} title="Tamanho Fonte" />
              <Divider />
              <Menu.Item onPress={closeMenu} title="Fechar menu" />
            </Menu>
          </Appbar.Header>
        </Animated.View>
      )}

      <PinchGestureHandler onGestureEvent={onPinchEvent} onHandlerStateChange={onPinchStateEvent}>
        <Animated.ScrollView
          contentContainerStyle={[styles.content, isPortrait ? styles.portrait : styles.landscape]}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={[styles.score, { marginBottom: fontSizeQuarter }]}>
            {hymn?.score?.stanzas.map((stanza, stanzaIndex) => (
              <View key={`stanza-row-${stanzaIndex}`} style={[styles.stanzaRow, { flexDirection: "row" }]}>
                <View key={`stanza-label-${stanzaIndex}`} style={[styles.stanzaLabelContainer]}>
                  <Text
                    style={[
                      styles.stanzaLabel,
                      {
                        color: theme.colors.secondary,
                        backgroundColor: theme.colors.elevation.level2,
                      },
                    ]}
                  >
                    {stanza.type == "chorus" ? "Coro" : stanza.code}
                  </Text>
                </View>
                <View key={`${stanzaIndex}`} style={[styles.stanza, { marginBottom: fontSize, width: 100 }]}>
                  {stanza.verses?.map((verse, verseIndex) => {
                    const verseKey = `${stanzaIndex}-${verseIndex}`;
                    const verseHeight = verseHeights[verseKey] || fontSizeDouble;

                    return (
                      <View
                        key={verseKey}
                        style={[
                          styles.verse,
                          {
                            height: verseHeight,
                            marginBottom: fontSize,
                          },
                        ]}
                      >
                        <StyledChordText
                          text={verse.chords}
                          style={[
                            styles.chord,
                            {
                              fontSize: fontSize,
                              lineHeight: fontSizeDouble,
                            },
                          ]}
                        />
                        <Text
                          style={[
                            styles.lyric,
                            {
                              top: fontSize,
                              fontSize: fontSize,
                              lineHeight: fontSizeDouble,
                              color: theme.colors.secondary,
                            },
                          ]}
                          onLayout={(e) => onVerseLayout(e, stanzaIndex, verseIndex)}
                        >
                          {verse.lyrics}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </Animated.ScrollView>
      </PinchGestureHandler>
      <FAB.Group
        open={zoomControlVisible}
        visible={zoomControlVisible}
        icon={"close"}
        backdropColor="rgba(255,255,255,0.2)"
        actions={[
          {
            icon: "magnify-plus",
            onPress: increaseFontSize,
          },
          {
            icon: "magnify-minus",
            onPress: decreaseFontSize,
          },
        ]}
        onStateChange={(state) => {
          if (state.open) setZoomControlVisible(state.open);
          if (zoomControlAction == "") {
            setZoomControlVisible(state.open);
          }
          zoomControlAction = "";
        }}
        onPress={() => {
          if (zoomControlVisible) {
            setZoomControlVisible(false);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    // paddingHorizontal: 16,
  },
  hymnText: {
    fontFamily: "UbuntuMonoRegular",
  },
  portrait: {},
  landscape: {
    alignSelf: "center",
    width: "100%",
  },

  score: {},
  verse: {
    position: "relative",
  },
  chord: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    fontFamily: "UbuntuMonoRegular",
    color: "transparent", // Make the underscores transparent
    zIndex: 1,
  },
  lyric: {
    position: "absolute",
    left: 0,
    right: 0,
    fontFamily: "UbuntuMonoRegular",
  },
  stanzaRow: {
    //borderColor: "yellow",
    //borderWidth: 1,
  },
  stanzaLabelContainer: {
    color: "#000",
    width: 16,
    alignItems: "center",
    marginRight: 4,
    //justifyContent: "center",

    //borderColor: "red",
    //borderWidth: 1,
  },
  stanzaLabel: {
    padding: 0,
    textAlign: "center",
    borderRadius: 2,
    width: 50,
    marginTop: 25 - 5,
    position: "absolute",
    transform: [{ rotate: "-90deg" }],
  },
  stanza: {
    //borderColor: "blue",
    //borderWidth: 1,
    flex: 1,
  },
});

export default HymnDetails;
