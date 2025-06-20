import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Switch, Text, Surface } from "react-native-paper";

type Props = {
  showOnlyFavorites: boolean;
  onChangeShowOnlyFavorites: (value: boolean) => void;
  onResetFilters: () => void;
};

const HymnFilterPanel: React.FC<Props> = ({ showOnlyFavorites, onChangeShowOnlyFavorites, onResetFilters }) => (
  <Surface style={styles.container}>
    <View style={styles.row}>
      <Text style={styles.label}>Apenas Favoritos</Text>
      <Switch style={styles.label} value={showOnlyFavorites} onValueChange={onChangeShowOnlyFavorites} />
    </View>
    <View style={styles.row}>
      <TouchableOpacity onPress={onResetFilters} style={styles.resetContainer}>
        <Text style={styles.resetText}>Reset Filtros</Text>
      </TouchableOpacity>
    </View>
  </Surface>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    padding: 8,
    margin: 16,
    borderRadius: 8,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
  resetContainer: {
    flex: 1,
    marginTop: 4,
    padding: 4,
  },
  resetText: {
    color: "#1976d2",
    alignSelf: "center",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default HymnFilterPanel;
