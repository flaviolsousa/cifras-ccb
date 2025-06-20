import React from "react";
import { View, StyleSheet } from "react-native";
import { Switch, Text, Surface } from "react-native-paper";

type Props = {
  showOnlyFavorites: boolean;
  onChangeShowOnlyFavorites: (value: boolean) => void;
};

const HymnFilterPanel: React.FC<Props> = ({ showOnlyFavorites, onChangeShowOnlyFavorites }) => (
  <Surface style={styles.container} elevation={2}>
    <View style={styles.row}>
      <Text style={styles.label}>Apenas Favoritos</Text>
      <Switch value={showOnlyFavorites} onValueChange={onChangeShowOnlyFavorites} />
    </View>
  </Surface>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    margin: 8,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
});

export default HymnFilterPanel;
