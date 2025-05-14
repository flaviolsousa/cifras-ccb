// src/screens/HymnDetails.tsx
import "react-native-reanimated";
import React, { useState, useEffect, useRef } from "react";
import { Animated, Easing, View, StyleSheet, type ScrollView, Text, Platform, type LayoutChangeEvent } from "react-native";
import { useTheme, Appbar, IconButton, Menu, FAB, Divider } from "react-native-paper";
import { type RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { type RootStackParamList } from "../navigation/MainNavigator";
import useHymnData from "../hooks/useHymnData";
import useOrientation from "../hooks/useOrientation";
import HymnNavigate from "../components/HymnNavigate";
import ScoreDetails from "../components/ScoreDetails";
import ToneNavigate from "../components/ToneNavigate";
import ChordPanel from "../components/ChordPanel";
import AutoScrollControl from "../components/AutoScrollControl";
import HymnAudioPlayer from "../components/HymnAudioPlayer";
import { HymnModel } from "../domain/HymnModel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
  const FONT_SIZE_INITIAL = 22;
  const FOOT_HEIGHT = 300;

  const route = useRoute<HymnDetailsRouteProp>();
  const navigation = useNavigation<any>();
  const { hymnCode, hymnsCode } = route.params;

  const { hymn, title, updateHymn } = useHymnData(hymnCode);
  const [fontSize, setFontSize] = useState(FONT_SIZE_INITIAL);
  const [fontSizeQuarter, setFontSizeQuarter] = useState(Math.floor(FONT_SIZE_INITIAL / 4));
  const [fontSizeDouble, setFontSizeDouble] = useState(Math.floor(FONT_SIZE_INITIAL * 2));

  const isPortrait = useOrientation();
  const [verseHeights, setVerseHeights] = useState<{ [key: string]: number }>({});

  const [selectedChord, setSelectedChord] = useState<string | null>(null);
  const [allChords, setAllChords] = useState<string[]>([]);
  const [autoScrollVisible, setAutoScrollVisible] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(true);

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
      height: FOOT_HEIGHT,
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
      color: "transparent",
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
    closeAllTools();
    setSelectedChord(cleanChordName(chord));
  };

  const closeAllTools = () => {
    setSelectedChord(null);
    setZoomControlVisible(false);
    setNavigationVisible(false);
    setToneNavigationVisible(false);
  };

  // Menu
  const [menuVisible, setMenuVisible] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    closeAllTools();
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

  // Show and hide header based on scroll position
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

      if (deltaY < 0 && !headerVisible && !isAutoScrolling) {
        setHeaderVisible(true);
        showHeader();
      } else if (deltaY > 0 && headerVisible && currentScrollY > 64) {
        setHeaderVisible(false);
        hideHeader();
      }
      lastScrollY.current = currentScrollY;
    },
  });

  const scoreTouchingRef = useRef<boolean>(false);
  const handleTouchStart = () => (scoreTouchingRef.current = true);
  const handleTouchEnd = () => setTimeout(() => (scoreTouchingRef.current = false), 500);

  const [navigationVisible, setNavigationVisible] = useState(false);
  const [toneNavigationVisible, setToneNavigationVisible] = useState(false);

  const handleHymnNavigation = (newHymnCode: string) => {
    navigation.setParams({ hymnCode: newHymnCode });
  };

  const handleCloseChordPanel = () => {
    setSelectedChord(null);
  };

  const handleToneChange = (transposedHymn: HymnModel) => {
    updateHymn(transposedHymn);
  };

  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

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
              <Menu
                visible={menuVisible}
                style={{ flex: 1, position: "absolute", top: "10%", right: "10%", left: "10%" }}
                onDismiss={closeMenu}
                anchor={<IconButton icon="menu" onPress={toggleMenu} />}
              >
                <Menu.Item
                  onPress={() => {
                    closeMenu();
                    setNavigationVisible(true);
                    closeMenu();
                  }}
                  title="Navegar Hinos"
                  leadingIcon="page-next-outline"
                />
                <Menu.Item
                  onPress={() => {
                    closeAllTools();
                    setZoomControlVisible(true);
                    closeMenu();
                  }}
                  title="Tamanho Fonte"
                  leadingIcon="format-size"
                />
                <Menu.Item
                  onPress={() => {
                    closeAllTools();
                    setToneNavigationVisible(true);
                    closeMenu();
                  }}
                  title="Mudar Tom"
                  leadingIcon="pound"
                />
                <Menu.Item
                  onPress={() => {
                    closeAllTools();
                    setAutoScrollVisible(!autoScrollVisible);
                    closeMenu();
                  }}
                  title="Rolagem Automática"
                  leadingIcon="autorenew"
                />
                <Menu.Item
                  onPress={() => {
                    closeAllTools();
                    setAudioPlayerVisible((v) => !v);
                    closeMenu();
                  }}
                  title={audioPlayerVisible ? "Ocultar Áudio" : "Exibir Áudio"}
                  leadingIcon="music"
                />
                <Divider />
                <Menu.Item onPress={closeMenu} title="Fechar menu" leadingIcon="close" />
              </Menu>
            </Appbar.Header>
            <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16 }}>
              {autoScrollVisible && (
                <AutoScrollControl
                  scrollViewRef={scrollViewRef}
                  contentHeight={contentHeight}
                  viewportHeight={scrollViewHeight}
                  hymn={hymn}
                  fontSize={fontSize}
                  lastScrollYRef={lastScrollY}
                  scoreTouchingRef={scoreTouchingRef}
                  onScrollingChange={setIsAutoScrolling}
                />
              )}
            </View>
          </Animated.View>
        </>
      )}

      <Animated.ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[styles.content, isPortrait ? styles.portrait : styles.landscape]}
        onScroll={handleScroll}
        onLayout={(e: LayoutChangeEvent) => setScrollViewHeight(e.nativeEvent.layout.height)}
        onContentSizeChange={(contentWidth: number, contentHeight: number) => setContentHeight(contentHeight)}
        scrollEventThrottle={1}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onScrollBeginDrag={handleTouchStart}
        onScrollEndDrag={handleTouchEnd}
      >
        <View
          style={[
            styles.score,
            {
              marginBottom: fontSizeQuarter,
              marginTop: insets.top + (shouldShowHeader ? 64 : 0) + (autoScrollVisible ? 32 : 0),
            },
          ]}
        >
          {shouldShowHeader && hymn && <ScoreDetails hymn={hymn} onToneChange={handleToneChange} />}
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
      <HymnNavigate
        visible={navigationVisible}
        onClose={() => setNavigationVisible(false)}
        hymnsCode={hymnsCode}
        currentHymnCode={hymnCode}
        onNavigate={handleHymnNavigation}
      />
      {hymn && (
        <ToneNavigate
          hymn={hymn}
          visible={toneNavigationVisible}
          onClose={() => setToneNavigationVisible(false)}
          currentTone={hymn.tone.selected}
          onToneChange={handleToneChange}
        />
      )}
      <FAB.Group
        open={zoomControlVisible}
        visible={zoomControlVisible}
        icon={"close"}
        backdropColor="rgba(255,255,255,0.35)"
        actions={[
          {
            icon: "format-font-size-increase",
            onPress: increaseFontSize,
          },
          {
            icon: "format-font-size-decrease",
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
      <HymnAudioPlayer hymnCode={hymnCode} visible={audioPlayerVisible} />
    </View>
  );
};

export default HymnDetails;
