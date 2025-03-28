// src/screens/Home.tsx
import React, { useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useTheme, Appbar, Searchbar, TextInput, List, Switch } from "react-native-paper";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/MainNavigator";

import Hymns from "../../data/Hymns.json";

const Home = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState("");

  const hymns = Hymns.map((hymn) => ({
    code: hymn.code,
    title: hymn.title,
  }));

  const filteredHymns = hymns.filter(({ title, code }) => {
    const query = searchQuery.toLowerCase().trim();
    return title.toLowerCase().includes(query) || code.toLowerCase().includes(query);
  });

  return (
    <View style={{ ...theme, flex: 1, backgroundColor: theme.colors.surface }}>
      <Appbar.Header elevated={true}>
        <Appbar.Action icon="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
        <Appbar.Content title="Hinos" />
      </Appbar.Header>

      <Searchbar placeholder="Buscar Hino" value={searchQuery} onChangeText={setSearchQuery} style={styles.searchInput} />

      <FlatList
        data={filteredHymns}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={selectItemHandler(item, filteredHymns)}>
            <List.Item title={item.code + " - " + item.title} />
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
