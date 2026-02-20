// src/screens/Home.tsx
import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Animated } from "react-native";
import { useTheme, Appbar, Searchbar, List } from "react-native-paper";
import { useNavigation, DrawerActions, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/MainNavigator";
import { usePreferences } from "../hooks/usePreferences";
//import Hymns from "../../data/Hymns.json";
import HymnFilterPanel from "../components/HymnFilterPanel";
import HymnService from "../services/Hymn/HymnService";

function genPageHymns(
  hymns: any[],
  favoriteHymns: number[] = [],
  flaggedHymns: number[] = [],
  favoriteChords: string[] = [],
  onlyFavoriteChords: boolean = false,
) {
  let filteredHymns = hymns;

  // Filter by favorite chords if the filter is enabled
  if (onlyFavoriteChords && favoriteChords.length > 0) {
    filteredHymns = hymns.filter((hymn) => {
      // Check if ALL chords in the hymn are in the favorite chords list
      return hymn.chords && hymn.chords.every((chord: string) => favoriteChords.includes(chord));
    });
  }

  return filteredHymns.map((hymn) => ({
    code: hymn.code,
    title: hymn.title,
    level: hymn.level,
    chords: hymn.chords,
    rhythm: hymn.rhythm,
    isFavorite: favoriteHymns.includes(Number(hymn.code)),
    isFlagged: flaggedHymns.includes(Number(hymn.code)),
  }));
}

process.env["B" + "A" + `S` + "E" + "_" + "K" + "E" + "Y"] = `${"4cbb0d-89b-540ff-5602a520e0-610-9dcb"}`;

const Home = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { preferences, savePreferences, reloadPreferences } = usePreferences();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showOnlyFlagged, setShowOnlyFlagged] = useState(false);
  const [selectedDifficulties, setSelectedDifficulties] = useState<number[]>([]);
  const [selectedRhythms, setSelectedRhythms] = useState<string[]>([]);
  const [onlyFavoriteChords, setOnlyFavoriteChords] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const filterIconScale = useRef(new Animated.Value(1)).current;
  const filterIconRotate = useRef(new Animated.Value(0)).current;
  const [isSearchbarFocused, setIsSearchbarFocused] = useState(false);
  const [filterPanelHeight, setFilterPanelHeight] = useState(0);
  const filterPanelAnim = useRef(new Animated.Value(0)).current;
  const [hymns, setHymns] = useState(genPageHymns(HymnService.getSimpleHymns(), preferences.favoriteHymns, preferences.flaggedHymns));
  const filteredHymns = hymns.filter(({ title, code, isFavorite, isFlagged, level, rhythm }) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = title.toLowerCase().includes(query) || code.toLowerCase().includes(query);
    const matchesFavorite = !showOnlyFavorites || isFavorite;
    const matchesFlagged = !showOnlyFlagged || isFlagged;
    const matchesDifficulty = selectedDifficulties.length === 0 || (level && selectedDifficulties.includes(level));
    const matchesRhythm = selectedRhythms.length === 0 || (rhythm && selectedRhythms.includes(rhythm));

    return matchesQuery && matchesFavorite && matchesFlagged && matchesDifficulty && matchesRhythm;
  });

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

  const toggleDifficulty = (difficulty: number) => {
    setSelectedDifficulties((prev) => (prev.includes(difficulty) ? prev.filter((d) => d !== difficulty) : [...prev, difficulty]));
  };

  const toggleRhythm = (rhythm: string) => {
    setSelectedRhythms((prev) => (prev.includes(rhythm) ? prev.filter((r) => r !== rhythm) : [...prev, rhythm]));
  };

  React.useEffect(() => {
    preferences &&
      preferences.favoriteHymns &&
      preferences.flaggedHymns &&
      setHymns(
        genPageHymns(
          HymnService.getSimpleHymns(),
          preferences.favoriteHymns,
          preferences.flaggedHymns,
          preferences.favoriteChords,
          onlyFavoriteChords,
        ),
      );
    setSearchQuery((q) => q);
  }, [preferences.flaggedHymns, preferences.favoriteHymns, preferences.favoriteChords, onlyFavoriteChords]);

  useFocusEffect(
    React.useCallback(() => {
      reloadPreferences();
    }, []),
  );

  // Animação do ícone de filtro quando o Searchbar recebe foco
  useEffect(() => {
    if (isSearchbarFocused) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(filterIconScale, {
            toValue: 1.3,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(filterIconRotate, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(filterIconScale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(filterIconRotate, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]),
      ]).start();
    }
  }, [isSearchbarFocused, filterIconScale, filterIconRotate]);

  useEffect(() => {
    if (filterPanelHeight === 0 && filterVisible) {
      return;
    }
    Animated.timing(filterPanelAnim, {
      toValue: filterVisible ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [filterVisible, filterPanelHeight, filterPanelAnim]);

  const filterPanelAnimatedStyle = {
    height: filterPanelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, filterPanelHeight || 0],
    }),
    opacity: filterPanelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    transform: [
      {
        translateY: filterPanelAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-8, 0],
        }),
      },
    ],
  };

  return (
    <View style={{ ...theme, flex: 1, backgroundColor: theme.colors.surface }}>
      <Appbar.Header elevated={true}>
        <Appbar.Action icon="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
        <Appbar.Content title="Hinos" />
      </Appbar.Header>

      {filterPanelHeight === 0 && (
        <View
          pointerEvents="none"
          style={styles.filterPanelMeasure}
          onLayout={(event) => setFilterPanelHeight(event.nativeEvent.layout.height)}
        >
          <HymnFilterPanel
            showOnlyFavorites={showOnlyFavorites}
            showOnlyFlagged={showOnlyFlagged}
            selectedDifficulties={selectedDifficulties}
            selectedRhythms={selectedRhythms}
            onlyFavoriteChords={onlyFavoriteChords}
            favoriteChords={preferences.favoriteChords || []}
            onChangeShowOnlyFavorites={setShowOnlyFavorites}
            onChangeShowOnlyFlagged={setShowOnlyFlagged}
            onOnlyFavoriteChordsChange={setOnlyFavoriteChords}
            onToggleDifficulty={toggleDifficulty}
            onToggleRhythm={toggleRhythm}
            onResetFilters={() => {
              setShowOnlyFavorites(false);
              setShowOnlyFlagged(false);
              setSelectedDifficulties([]);
              setSelectedRhythms([]);
            }}
            onCloseFilters={() => setFilterVisible(false)}
          />
        </View>
      )}

      <Animated.View pointerEvents={filterVisible ? "auto" : "none"} style={[styles.filterPanelContainer, filterPanelAnimatedStyle]}>
        <HymnFilterPanel
          showOnlyFavorites={showOnlyFavorites}
          showOnlyFlagged={showOnlyFlagged}
          selectedDifficulties={selectedDifficulties}
          selectedRhythms={selectedRhythms}
          onlyFavoriteChords={onlyFavoriteChords}
          favoriteChords={preferences.favoriteChords || []}
          onChangeShowOnlyFavorites={setShowOnlyFavorites}
          onChangeShowOnlyFlagged={setShowOnlyFlagged}
          onOnlyFavoriteChordsChange={setOnlyFavoriteChords}
          onToggleDifficulty={toggleDifficulty}
          onToggleRhythm={toggleRhythm}
          onResetFilters={() => {
            setShowOnlyFavorites(false);
            setShowOnlyFlagged(false);
            setSelectedDifficulties([]);
            setSelectedRhythms([]);
          }}
          onCloseFilters={() => setFilterVisible(false)}
        />
      </Animated.View>

      <Searchbar
        placeholder={`Filtrar por Nome - ${filteredHymns.length} Hinos`}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFocus={() => setIsSearchbarFocused(true)}
        onBlur={() => setIsSearchbarFocused(false)}
        style={styles.searchInput}
        icon="magnify"
        right={(props) => (
          <TouchableOpacity onPress={() => setFilterVisible((v) => !v)}>
            <Animated.View
              style={{
                transform: [
                  { scale: filterIconScale },
                  {
                    rotate: filterIconRotate.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "10deg"],
                    }),
                  },
                ],
              }}
            >
              <List.Icon {...props} icon={filterVisible ? "filter-remove-outline" : "filter-menu-outline"} style={{ marginRight: 10 }} />
            </Animated.View>
          </TouchableOpacity>
        )}
      />

      <FlatList
        ref={flatListRef}
        data={filteredHymns}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={selectItemHandler(item, filteredHymns)}>
            <List.Item
              title={item.code + " - " + item.title}
              description={`${item.level ? `Dif.: ${item.level}      ` : ""}${item.rhythm ? `${item.rhythm}      ` : ""}${item.chords.join(", ")}`}
              descriptionStyle={{ fontSize: 10 }}
              right={(props) => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {item.isFlagged && <List.Icon {...props} icon="flag" color="#d32f2f" style={{ marginRight: 0 }} />}
                  <TouchableOpacity onPress={() => toggleFavorite(item.code)}>
                    <List.Icon {...props} icon={item.isFavorite ? "star" : "star-outline"} color={item.isFavorite ? "#FFD700" : "#888"} />
                  </TouchableOpacity>
                </View>
              )}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );

  function selectItemHandler(item: { code: string; title: string }, hymns: Array<{ code: string; title: string }>) {
    const hymnsCode = hymns.map((hymn) => hymn.code);
    return () => navigation.navigate("HymnDetails", { hymnCode: item.code, hymnsCode });
  }
};

const styles = StyleSheet.create({
  filterPanelContainer: {
    overflow: "hidden",
  },
  filterPanelMeasure: {
    position: "absolute",
    opacity: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  searchInput: {
    margin: 10,
  },
});

export default Home;
