// src/screens/HymnDetails.tsx
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Platform, StyleSheet, Text, View, type LayoutChangeEvent, type ScrollView } from "react-native";
import { Appbar, Divider, FAB, IconButton, Menu, useTheme } from "react-native-paper";
import "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AutoScrollControl from "../components/AutoScrollControl";
import ChordPanel from "../components/ChordPanel";
import HymnAudioPlayer from "../components/HymnAudioPlayer";
import HymnNavigate from "../components/HymnNavigate";
import ScoreDetails from "../components/ScoreDetails";
import ToneNavigate from "../components/ToneNavigate";
import { type HymnModel } from "../domain/HymnModel";
import useHymnData from "../hooks/useHymnData";
import useOrientation from "../hooks/useOrientation";
import { type RootStackParamList } from "../navigation/MainNavigator";
import HymnIntroNotes from "../components/HymnIntroNotes";
import StyledVerse from "../components/StyledVerse";
import StyledIntroductionText from "../components/StyledIntroductionText";
import { usePreferences } from "../hooks/usePreferences";

type HymnDetailsRouteProp = RouteProp<RootStackParamList, "HymnDetails">;

function cleanChordName(chord: string): string {
  return chord.replaceAll(/[.]/g, "").replaceAll(/\|.*/g, "");
}

const HymnDetails = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { preferences, savePreferences } = usePreferences();
  const FOOT_HEIGHT = preferences.fontSize * 10;

  const route = useRoute<HymnDetailsRouteProp>();
  const navigation = useNavigation<any>();
  const { hymnCode, hymnsCode } = route.params;

  const { hymn, title, updateHymn } = useHymnData(hymnCode);
  const [fontSize, setFontSize] = useState(preferences.fontSize);
  const [fontSizeQuarter, setFontSizeQuarter] = useState(Math.floor(preferences.fontSize / 4));
  const [fontSizeDouble, setFontSizeDouble] = useState(Math.floor(preferences.fontSize * 2));

  const isPortrait = useOrientation();
  const [verseHeights, setVerseHeights] = useState<{ [key: string]: number }>({});

  const [selectedChord, setSelectedChord] = useState<string | null>(null);
  const [allChords, setAllChords] = useState<string[]>([]);
  const [autoScrollVisible, setAutoScrollVisible] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [audioPlayerVisible, setAudioPlayerVisible] = useState(true);
  const [showNotes, setShowNotes] = useState(true);

  const styles = StyleSheet.create({
    content: {},
    portrait: {},
    landscape: {
      alignSelf: "center",
      width: "100%",
    },
    scoreFooter: {
      height: FOOT_HEIGHT,
    },
    score: {},
    stanzaRow: {},
    stanzaDivider: {
      marginVertical: fontSize,
    },
    stanzaLabelContainer: {
      width: 16,
      alignItems: "center",
      marginRight: 7,
    },
    stanzaLabel: {
      textAlign: "center",
      borderRadius: 2,
      width: 50,
      marginTop: 25 - 5,
      position: "absolute",
      transform: [{ rotate: "-90deg" }],
    },
    stanza: {
      flex: 1,
    },
    fabContainer: {
      position: "absolute",
      bottom: 24,
      right: 24,
      flexDirection: "row",
      zIndex: 100,
    },
    fab: {
      marginLeft: 12,
    },
  });

  useEffect(() => {
    setFontSize(preferences.fontSize);
  }, [preferences.fontSize]);

  // save distinct of chords to ChordPanel
  useEffect(() => {
    if (hymn?.score?.stanzas) {
      const chordSet = new Set<string>();
      hymn.score.stanzas.forEach((stanza) => {
        if (stanza.text)
          stanza.text.forEach((line) => {
            const matches = line.match(/\[([^\]]+)\]/g);
            if (matches) {
              matches.forEach((match) => {
                const chord = match.slice(1, -1);
                chordSet.add(cleanChordName(chord));
              });
            }
          });
      });
      setAllChords(Array.from(chordSet).filter(Boolean));
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
      toValue: -200, // -64 to perfect hide the header
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
  const scrollViewHeightRef = useRef(0);
  const contentHeightRef = useRef(0);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    if (Platform.OS === "web") {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "+") {
          increaseFontSize();
        } else if (event.key === "-") {
          decreaseFontSize();
        } else if (event.key === "e" || event.key === "E") {
          navigation.navigate("HymnEdit", { hymnCode });
        }
      };

      window.addEventListener("keydown", handleKeyPress);
      return () => {
        window.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [navigation, hymnCode]);

  // Begin: Favorite Button
  const isFavorite = (code: string) => {
    return preferences.favoriteHymns?.includes(Number(code));
  };

  const toggleFavorite = (code: string) => {
    const codeNum = Number(code);
    let updatedFavorites = preferences.favoriteHymns ?? [];
    if (updatedFavorites.includes(codeNum)) {
      updatedFavorites = updatedFavorites.filter((c) => c !== codeNum);
    } else {
      updatedFavorites = [...updatedFavorites, codeNum];
    }
    savePreferences({ ...preferences, favoriteHymns: updatedFavorites });
  };
  // End: Favorite Button

  // Begin: flag Button
  const isFlagged = (code: string) => {
    return preferences.flaggedHymns?.includes(Number(code));
  };
  const toggleFlagged = (code: string) => {
    const codeNum = Number(code);
    let updatedFlags = preferences.flaggedHymns ?? [];
    if (updatedFlags.includes(codeNum)) {
      updatedFlags = updatedFlags.filter((c) => c !== codeNum);
    } else {
      updatedFlags = [...updatedFlags, codeNum];
    }
    savePreferences({ ...preferences, flaggedHymns: updatedFlags });
  };
  // End: flag Button

  return (
    <View style={{ ...theme, flex: 1 }}>
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
          {/* Botão de flag */}
          {isFlagged(hymnCode) && (
            <Appbar.Action icon="flag" color="#d32f2f" onPress={() => toggleFlagged(hymnCode)} accessibilityLabel="Desmarcar para revisar" />
          )}
          {!isFlagged(hymnCode) && (
            <Appbar.Action icon="flag-outline" color="#888" onPress={() => toggleFlagged(hymnCode)} accessibilityLabel="Marcar para revisar" />
          )}
          {/* Botão de menu */}
          {/* Botão de favorito */}
          <Appbar.Action
            icon={isFavorite(hymnCode) ? "star" : "star-outline"}
            color={isFavorite(hymnCode) ? "#FFD700" : "#888"}
            onPress={() => toggleFavorite(hymnCode)}
            accessibilityLabel="Favoritar"
          />
          <Menu visible={menuVisible} onDismiss={closeMenu} anchor={<IconButton icon="menu" onPress={toggleMenu} />}>
            <Menu.Item
              onPress={() => {
                navigation.navigate("HymnEdit", { hymnCode });
                closeMenu();
              }}
              title="Editar Hino"
              leadingIcon="file-edit-outline"
            />
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
              leadingIcon="music-accidental-sharp"
            />
            <Menu.Item
              onPress={() => {
                closeAllTools();
                setAutoScrollVisible(!autoScrollVisible);
                closeMenu();
              }}
              title="Rolagem Automática"
              leadingIcon="pan-vertical"
            />
            <Menu.Item
              onPress={() => {
                closeAllTools();
                setAudioPlayerVisible((v) => !v);
                closeMenu();
              }}
              title={audioPlayerVisible ? "Ocultar Áudio" : "Exibir Áudio"}
              leadingIcon="play"
            />
            <Menu.Item
              onPress={() => {
                setShowNotes((prev) => !prev);
                closeMenu();
              }}
              title={showNotes ? "Ocultar Notas" : "Exibir Notas"}
              leadingIcon="lead-pencil"
            />
            <Divider />
            <Menu.Item onPress={closeMenu} title="Fechar menu" leadingIcon="close" />
          </Menu>
        </Appbar.Header>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16 }}>
          <AutoScrollControl
            scrollViewRef={scrollViewRef}
            contentHeightRef={contentHeightRef}
            viewportHeightRef={scrollViewHeightRef}
            hymn={hymn}
            lastScrollYRef={lastScrollY}
            scoreTouchingRef={scoreTouchingRef}
            visible={!!autoScrollVisible}
            onScrollingChange={setIsAutoScrolling}
          />
        </View>
      </Animated.View>

      <Animated.ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[styles.content, isPortrait ? styles.portrait : styles.landscape]}
        onScroll={handleScroll}
        onLayout={(e: LayoutChangeEvent) => {
          scrollViewHeightRef.current = e.nativeEvent.layout.height;
        }}
        onContentSizeChange={(contentWidth: number, contentHeight: number) => {
          contentHeightRef.current = contentHeight;
          setContentWidth(contentWidth);
        }}
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
              marginTop: insets.top + 64 + (autoScrollVisible ? 32 : 0),
            },
          ]}
        >
          {hymn && <ScoreDetails hymn={hymn} onToneChange={handleToneChange} />}
          <Divider />
          {hymn && <HymnIntroNotes hymn={hymn} isPortrait={isPortrait} contentWidth={contentWidth} />}
          {hymn && hymn?.score?.introduction && (
            <StyledIntroductionText
              introduction={hymn.score.introduction}
              fontSize={fontSize}
              fontSizeDouble={fontSizeDouble}
              selectedChord={selectedChord}
              onChordPress={handleChordPress}
            />
          )}
          <Divider />

          {hymn?.score?.stanzas.map((stanza, stanzaIndex) => (
            <View key={stanzaIndex} style={styles.stanzaRow}>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.stanzaLabelContainer}>
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
                <View style={styles.stanza}>
                  {stanza.text?.map((line, verseIndex) => {
                    const verseKey = `${stanzaIndex}-${verseIndex}`;
                    const verseHeight = verseHeights[verseKey] || fontSizeDouble;
                    return (
                      <StyledVerse
                        key={verseKey}
                        line={line}
                        fontSize={fontSize}
                        fontSizeDouble={fontSizeDouble}
                        verseHeight={verseHeight}
                        onChordPress={handleChordPress}
                        selectedChord={selectedChord}
                        onVerseLayout={(event) => onVerseLayout(event, stanzaIndex, verseIndex)}
                        showNotes={showNotes}
                      />
                    );
                  })}
                </View>
              </View>
              {stanzaIndex < hymn.score.stanzas.length - 1 && <Divider style={styles.stanzaDivider} />}
            </View>
          ))}
          <Divider style={styles.stanzaDivider} />
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
      {zoomControlVisible && (
        <View style={styles.fabContainer} pointerEvents="box-none">
          <FAB icon="format-font-size-decrease" onPress={decreaseFontSize} style={styles.fab} small accessibilityLabel="Diminuir fonte" />
          <FAB icon="format-font-size-increase" onPress={increaseFontSize} style={styles.fab} small accessibilityLabel="Aumentar fonte" />
          <FAB icon="close" onPress={() => setZoomControlVisible(false)} style={styles.fab} small accessibilityLabel="Fechar controle de zoom" />
        </View>
      )}
      <HymnAudioPlayer hymnCode={hymnCode} visible={audioPlayerVisible} onPlay={closeAllTools} />

      <ChordPanel
        selectedChord={selectedChord}
        allChords={allChords}
        onChordSelect={handleChordPress}
        onClose={handleCloseChordPanel}
        visible={!!selectedChord}
      />
    </View>
  );
};

export default HymnDetails;
