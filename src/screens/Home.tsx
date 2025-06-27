// src/screens/Home.tsx
import React, { useRef, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useTheme, Appbar, Searchbar, List } from "react-native-paper";
import { useNavigation, DrawerActions, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/MainNavigator";
import { usePreferences } from "../hooks/usePreferences";

import Hymns from "../../data/Hymns.json";
import HymnFilterPanel from "../components/HymnFilterPanel";

function genPageHymns(hymns: any[], favoriteHymns: number[] = [], flaggedHymns: number[] = []) {
  return hymns.map((hymn) => ({
    code: hymn.code,
    title: hymn.title,
    level: hymn.level,
    chords: hymn.chords,
    rhythm: hymn.rhythm,
    isFavorite: favoriteHymns.includes(Number(hymn.code)),
    isFlagged: flaggedHymns.includes(Number(hymn.code)),
  }));
}

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
  const flatListRef = useRef<FlatList>(null);
  const [hymns, setHymns] = useState(genPageHymns(Hymns, preferences.favoriteHymns, preferences.flaggedHymns));
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
      setHymns(genPageHymns(Hymns, preferences.favoriteHymns, preferences.flaggedHymns));
    setSearchQuery((q) => q);
  }, [preferences.flaggedHymns, preferences.favoriteHymns]);

  useFocusEffect(
    React.useCallback(() => {
      reloadPreferences();
    }, []),
  );

  return (
    <View style={{ ...theme, flex: 1, backgroundColor: theme.colors.surface }}>
      <Appbar.Header elevated={true}>
        <Appbar.Action icon="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
        <Appbar.Content title="Hinos" />
      </Appbar.Header>

      {filterVisible && (
        <HymnFilterPanel
          showOnlyFavorites={showOnlyFavorites}
          showOnlyFlagged={showOnlyFlagged}
          selectedDifficulties={selectedDifficulties}
          selectedRhythms={selectedRhythms}
          onChangeShowOnlyFavorites={setShowOnlyFavorites}
          onChangeShowOnlyFlagged={setShowOnlyFlagged}
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
      )}

      <Searchbar
        placeholder={`Filtrar por Nome - ${filteredHymns.length} Hinos`}
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
        icon="magnify"
        right={(props) => (
          <TouchableOpacity onPress={() => setFilterVisible((v) => !v)}>
            <List.Icon {...props} icon={filterVisible ? "filter-remove-outline" : "filter-menu-outline"} style={{ marginRight: 10 }} />
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
  searchInput: {
    margin: 10,
  },
});

export default Home;
