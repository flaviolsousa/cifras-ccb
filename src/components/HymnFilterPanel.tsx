import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Switch, Text, Icon, Surface, useTheme } from "react-native-paper";

type Props = {
  showOnlyFavorites: boolean;
  showOnlyFlagged: boolean;
  onChangeShowOnlyFavorites: (value: boolean) => void;
  onChangeShowOnlyFlagged: (value: boolean) => void;
  onResetFilters: () => void;
  onCloseFilters: () => void;
};

const HymnFilterPanel: React.FC<Props> = ({
  showOnlyFavorites,
  showOnlyFlagged,
  onChangeShowOnlyFavorites,
  onChangeShowOnlyFlagged,
  onResetFilters,
  onCloseFilters,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "column",
      padding: 8,
      margin: 16,
      borderRadius: 8,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    labelContainer: {
      flex: 1,
      justifyContent: "center",
    },
    label: {
      fontSize: 16,
    },
    resetContainer: {
      flex: 1,
      marginTop: 4,
      padding: 4,
    },
    resetText: {
      color: theme.colors.primary,
      alignSelf: "flex-start",
      fontSize: 14,
      textDecorationLine: "underline",
    },
    closeFilters: {
      color: theme.colors.primary,
      alignSelf: "flex-end",
      fontSize: 14,
      textDecorationLine: "underline",
    },
  });

  return (
    <Surface style={styles.container}>
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            Apenas Favoritos
            <Icon source="star" size={16} color={"#FFD700"} />
          </Text>
        </View>
        <Switch value={showOnlyFavorites} onValueChange={onChangeShowOnlyFavorites} />
      </View>
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            Apenas para estudar
            <Icon source="flag" size={16} color={"#d32f2f"} />
          </Text>
        </View>
        <Switch value={showOnlyFlagged} onValueChange={onChangeShowOnlyFlagged} />
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={onResetFilters} style={styles.resetContainer}>
          <Text style={styles.resetText}>Reset Filtros</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCloseFilters} style={styles.closeFilters}>
          <Text style={styles.resetText}>Ocultar Filtros</Text>
        </TouchableOpacity>
      </View>
    </Surface>
  );
};

export default HymnFilterPanel;
