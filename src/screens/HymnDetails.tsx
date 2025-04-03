// src/screens/HymnDetails.tsx
import React, { useState, useEffect, useRef } from "react";
import { Animated, View, StyleSheet, ScrollView, Text, Platform, LayoutChangeEvent } from "react-native";
import { useTheme, Appbar, IconButton, Menu, FAB, Divider } from "react-native-paper";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/MainNavigator";
import { PinchGestureHandler, PinchGestureHandlerGestureEvent, HandlerStateChangeEvent, State } from "react-native-gesture-handler";
import useHymnData from "../hooks/useHymnData";
import useOrientation from "../hooks/useOrientation";
import HymnNavigate from "../components/HymnNavigate";
import ScoreDetails from "../components/ScoreDetails";
import ChordPanel from "../components/ChordPanel";
import { transpose } from "chord-transposer";

type HymnDetailsRouteProp = RouteProp<RootStackParamList, "HymnDetails">;

function cleanChordName(chord: string): string {
  return chord.replaceAll(/[.]/g, "");
}

const StyledChordText = ({
  text,
  style,
  styleSelected,
  onChordPress,
  selectedChord,
}: {
  text: string;
  style: any;
  styleSelected: any;
  onChordPress?: (chord: string) => void;
  selectedChord?: string | null;
}) => {
  const theme = useTheme();
  const parts = text.split(/([^_\s]+)/g).filter(Boolean);

  return (
    <Text style={style}>
      {parts.map((part, index) =>
        part.includes("_") ? (
          <Text key={index}>{part}</Text>
        ) : (
          <Text
            key={index}
            style={[{ color: theme.colors.primary }, cleanChordName(part.trim()) === selectedChord && styleSelected]}
            onPress={() => onChordPress?.(part.trim())}
          >
            {part}
          </Text>
        ),
      )}
    </Text>
  );
};

const StyledLyricText = ({ text, style, onLayout }: { text: string; style: any; onLayout: any }) => {
  const phrase = text.replace(/([_])+$/g, "");
  const additional = "x".repeat(text.length - phrase.length);
  return (
    <Text style={style} onLayout={onLayout}>
      <Text>{phrase}</Text>
      <Text style={{ color: "transparent" }}>{additional}</Text>
    </Text>
  );
};

const HymnDetails = () => {
  const theme = useTheme();
  const FONT_SIZE_INITIAL = 22;

  const route = useRoute<HymnDetailsRouteProp>();
  const navigation = useNavigation<any>();
  const { hymnCode, hymnsCode } = route.params;

  const { hymn, title, updateHymn } = useHymnData(hymnCode);
  const [fontSize, setFontSize] = useState(FONT_SIZE_INITIAL);
  const [fontSizeQuarter, setFontSizeQuarter] = useState(Math.floor(FONT_SIZE_INITIAL / 4));
  const [fontSizeDouble, setFontSizeDouble] = useState(Math.floor(FONT_SIZE_INITIAL * 2));
  const [fontSizeReference, setFontSizeReference] = useState(FONT_SIZE_INITIAL);
  const isPortrait = useOrientation();
  const [verseHeights, setVerseHeights] = useState<{ [key: string]: number }>({});

  const [selectedChord, setSelectedChord] = useState<string | null>(null);
  const [allChords, setAllChords] = useState<string[]>([]);

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

    scoreDetail: {},
    scoreFooter: {
      height: 220,
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
    chordSelected: {
      fontFamily: "UbuntuMonoBold",
      color: theme.colors.secondary,
    },
    lyric: {
      position: "absolute",
      left: 0,
      right: 0,
      fontFamily: "UbuntuMonoRegular",
      color: theme.colors.secondary,
    },
    stanzaRow: {
      //borderColor: "yellow",
      //borderWidth: 1,
    },
    stanzaLabelContainer: {
      width: 16,
      alignItems: "center",
      marginRight: 7,

      //borderColor: "red",
      //borderWidth: 1,
    },
    stanzaLabel: {
      textAlign: "center",
      borderRadius: 2,
      width: 50,
      marginTop: 25 - 5,
      position: "absolute",
      transform: [{ rotate: "-90deg" }],

      //borderColor: "red",
      //borderWidth: 1,
    },
    stanza: {
      //borderColor: "blue",
      //borderWidth: 1,
      flex: 1,
    },
  });

  // save distinct of chords to ChordPanel
  useEffect(() => {
    if (hymn?.score?.stanzas) {
      const chordSet = new Set<string>();
      hymn.score.stanzas.forEach((stanza) => {
        if (stanza.verses)
          stanza.verses.forEach((verse) => {
            const chords = verse.chords
              .split(/([^_\s]+)/g)
              .filter((part) => !part.includes("_") && part.trim())
              .map((chord) => chord.trim());
            chords.forEach((chord) => chordSet.add(cleanChordName(chord)));
          });
      });
      setAllChords(Array.from(chordSet));
    }
  }, [hymn]);

  const handleChordPress = (chord: string) => {
    setSelectedChord(cleanChordName(chord));
  };

  // Menu
  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    setSelectedChord(null);
  };
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
    listener: (event: any) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      const deltaY = currentScrollY - lastScrollY.current;

      if (deltaY < 0 && !headerVisible) {
        setHeaderVisible(true);
        showHeader();
      } else if (deltaY > 0 && headerVisible && currentScrollY > 64) {
        setHeaderVisible(false);
        hideHeader();
      }

      lastScrollY.current = currentScrollY;
    },
  });

  const [navigationVisible, setNavigationVisible] = useState(false);

  const handleHymnNavigation = (newHymnCode: string) => {
    navigation.setParams({ hymnCode: newHymnCode });
  };

  const handleCloseChordPanel = () => {
    setSelectedChord(null);
  };

  const handleToneChange = (newTone: string) => {
    if (!hymn) return;

    const transposedHymn = {
      ...hymn,
      tone: newTone,
      score: {
        ...hymn.score,
        stanzas: hymn.score.stanzas.map((stanza) => ({
          ...stanza,
          verses: stanza.verses?.map((verse) => ({
            ...verse,
            chords: verse.chords
              .split(/([^_\s]+)/g)
              .map((part) => {
                if (part.includes("_") || !part.trim()) return part;
                const match = part.trim().match(/([_.]*)(.*?)([_.]*$)/);
                const chordPrefix = match?.[1] || "";
                const chord = match?.[2] || part.trim();
                const chordSuffix = match?.[3] || "";
                try {
                  const transposed = transpose(chord)
                    .fromKey(hymn.toneOriginal || hymn.tone)
                    .toKey(newTone);
                  return `${chordPrefix}${transposed}${chordSuffix}`;
                } catch (e: any) {
                  console.error(e);
                  return part + ":ERROR";
                }
              })
              .join(""),
          })),
        })),
      },
    };

    updateHymn(transposedHymn);
  };

  return (
    <View style={{ ...theme, flex: 1 }}>
      {shouldShowHeader && (
        <>
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
                <Menu.Item
                  onPress={() => {
                    setNavigationVisible(true);
                    closeMenu();
                  }}
                  title="Navegar Hinos"
                />
                <Menu.Item onPress={fontSizeMenu} title="Tamanho Fonte" />
                <Divider />
                <Menu.Item onPress={closeMenu} title="Fechar menu" />
              </Menu>
            </Appbar.Header>
          </Animated.View>
        </>
      )}

      <PinchGestureHandler onGestureEvent={onPinchEvent} onHandlerStateChange={onPinchStateEvent}>
        <Animated.ScrollView
          contentContainerStyle={[styles.content, isPortrait ? styles.portrait : styles.landscape]}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View
            style={[
              styles.score,
              {
                marginBottom: fontSizeQuarter,
                marginTop: shouldShowHeader ? 64 : 0,
              },
            ]}
          >
            {shouldShowHeader && hymn && (
              <ScoreDetails rhythm={hymn.rhythm} tone={hymn.tone} toneOriginal={hymn.toneOriginal} capo={1} onToneChange={handleToneChange} />
            )}
            <Divider />
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
                          styleSelected={styles.chordSelected}
                          onChordPress={handleChordPress}
                          selectedChord={selectedChord}
                        />
                        <StyledLyricText
                          text={verse.lyrics}
                          style={[
                            styles.lyric,
                            {
                              top: fontSize,
                              fontSize: fontSize,
                              lineHeight: fontSizeDouble,
                            },
                          ]}
                          onLayout={(e: LayoutChangeEvent) => onVerseLayout(e, stanzaIndex, verseIndex)}
                        />
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
            <Divider />
            <View style={styles.scoreFooter}></View>
          </View>
        </Animated.ScrollView>
      </PinchGestureHandler>
      <HymnNavigate
        visible={navigationVisible}
        onClose={() => setNavigationVisible(false)}
        hymnsCode={hymnsCode}
        currentHymnCode={hymnCode}
        onNavigate={handleHymnNavigation}
      />
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
      {selectedChord && (
        <ChordPanel selectedChord={selectedChord} allChords={allChords} onChordSelect={handleChordPress} onClose={handleCloseChordPanel} />
      )}
    </View>
  );
};

export default HymnDetails;
