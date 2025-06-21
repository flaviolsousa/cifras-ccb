// src/screens/HymnDetails.tsx
import React from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { useTheme, Appbar, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const HymnDetails = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <View style={{ ...theme, flex: 1 }}>
      <Appbar.Header elevated={true}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={"Sobre"} />
        <IconButton
          icon="information"
          onPress={() => {
            /* Toggle área de detalhes do hino */
          }}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Text>About Screen</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
});

export default HymnDetails;
