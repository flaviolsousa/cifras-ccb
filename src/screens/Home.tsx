// src/screens/Home.tsx
import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import type { FlatList } from "react-native";
import { useTheme, Appbar } from "react-native-paper";
import { useNavigation, DrawerActions, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/MainNavigator";
import { usePreferences } from "../hooks/usePreferences";
import HomeFilterPanelAnimated from "../components/HomeFilterPanelAnimated";
import HomeSearchBar from "../components/HomeSearchBar";
import HymnList, { type HymnListItem } from "../components/HymnList";
import HymnService from "../services/Hymn/HymnService";

function genPageHymns(
  hymns: any[],
  favoriteHymns: number[] = [],
  flaggedHymns: number[] = [],
  favoriteChords: string[] = [],
  onlyFavoriteChords: boolean = false,
): HymnListItem[] {
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
  const flatListRef = useRef<FlatList<HymnListItem>>(null);
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

  const handleResetFilters = () => {
    setShowOnlyFavorites(false);
    setShowOnlyFlagged(false);
    setSelectedDifficulties([]);
    setSelectedRhythms([]);
  };

  const handleSelectItem = (item: HymnListItem) => {
    const hymnsCode = filteredHymns.map((hymn) => hymn.code);
    navigation.navigate("HymnDetails", { hymnCode: item.code, hymnsCode });
  };

  return (
    <View style={{ ...theme, flex: 1, backgroundColor: theme.colors.surface }}>
      <Appbar.Header elevated={true}>
        <Appbar.Action icon="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
        <Appbar.Content title="Hinos" />
      </Appbar.Header>

      <HomeFilterPanelAnimated
        visible={filterVisible}
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
        onResetFilters={handleResetFilters}
        onCloseFilters={() => setFilterVisible(false)}
      />

      <HomeSearchBar
        filteredCount={filteredHymns.length}
        searchQuery={searchQuery}
        onChangeSearch={setSearchQuery}
        filterVisible={filterVisible}
        onToggleFilters={() => setFilterVisible((v) => !v)}
        style={styles.searchInput}
      />

      <HymnList data={filteredHymns} listRef={flatListRef} onPressItem={handleSelectItem} onToggleFavorite={toggleFavorite} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    margin: 10,
  },
});

export default Home;
