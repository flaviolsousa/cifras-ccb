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

  // Exemplo de dados – substitua pelos dados reais dos hinos
  const hymns = Hymns.map((hymn) => ({
    code: hymn.code,
    title: hymn.title,
  }));

  const filteredHymns = hymns.filter((h) => h.title.toLowerCase().includes(searchQuery.toLowerCase()) || h.code.includes(searchQuery));

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
          <TouchableOpacity onPress={() => navigation.navigate("HymnDetails", { hymnCode: item.code })}>
            <List.Item title={item.code + " - " + item.title} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    margin: 10,
  },
});

export default Home;
