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
  const flatListRef = useRef<FlatList>(null);
  const [hymns, setHymns] = useState(genPageHymns(Hymns, preferences.favoriteHymns, preferences.flaggedHymns));

  const filteredHymns = hymns.filter(({ title, code, isFavorite, isFlagged }) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = title.toLowerCase().includes(query) || code.toLowerCase().includes(query);
    const matchesFavorite = !showOnlyFavorites || isFavorite;
    const matchesFlagged = !showOnlyFlagged || isFlagged;
    return matchesQuery && matchesFavorite && matchesFlagged;
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
          onChangeShowOnlyFavorites={setShowOnlyFavorites}
          onChangeShowOnlyFlagged={setShowOnlyFlagged}
          onResetFilters={() => {
            setShowOnlyFavorites(false);
            setShowOnlyFlagged(false);
          }}
          onCloseFilters={() => setFilterVisible(false)}
        />
      )}

      <Searchbar
        placeholder="Buscar Hino"
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
