// src/screens/Home.tsx
import React, { useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useTheme, Appbar, Searchbar, List } from "react-native-paper";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/MainNavigator";
import { usePreferences } from "../hooks/usePreferences";

import Hymns from "../../data/Hymns.json";
import HymnFilterPanel from "../components/HymnFilterPanel";

const Home = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { preferences, savePreferences } = usePreferences();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showOnlyFlagged, setShowOnlyFlagged] = useState(false);

  console.log("flaggedHymns(2):", preferences.flaggedHymns?.includes(2));

  const hymns = Hymns.map((hymn) => ({
    code: hymn.code,
    title: hymn.title,
  }));

  const isFavorite = (code: string) => {
    //console.log("Checking favorite for code:", code, ": ", preferences.favoriteHymns?.includes(Number(code)));
    return preferences.favoriteHymns?.includes(Number(code));
  };
  const isFlagged = (code: string) => {
    return preferences.flaggedHymns?.includes(Number(code));
  };
  const filteredHymns = hymns.filter(({ title, code }) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = title.toLowerCase().includes(query) || code.toLowerCase().includes(query);
    const matchesFavorite = !showOnlyFavorites || isFavorite(code);
    const matchesFlagged = !showOnlyFlagged || isFlagged(code);
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
    // Atualiza a lista quando as preferências mudam
    // (flagged, favorites, etc)
    setSearchQuery((q) => q);
  }, [preferences.favoriteHymns, preferences.flaggedHymns]);

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
        />
      )}

      <Searchbar
        placeholder="Buscar Hino"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
        icon="magnify"
        // Adiciona o botão de filtro à direita
        right={(props) => (
          <TouchableOpacity onPress={() => setFilterVisible((v) => !v)}>
            <List.Icon {...props} icon={filterVisible ? "filter-remove-outline" : "filter-menu-outline"} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={filteredHymns}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={selectItemHandler(item, filteredHymns)}>
            <List.Item
              title={item.code + " - " + item.title}
              right={(props) => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {isFlagged(item.code) && <List.Icon {...props} icon="flag" color="#d32f2f" style={{ marginRight: 0 }} />}
                  <TouchableOpacity onPress={() => toggleFavorite(item.code)}>
                    <List.Icon {...props} icon={isFavorite(item.code) ? "star" : "star-outline"} color={isFavorite(item.code) ? "#FFD700" : "#888"} />
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
