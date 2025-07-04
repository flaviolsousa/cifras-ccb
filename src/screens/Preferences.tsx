// src/screens/Preferences.tsx
import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text, Platform, type LayoutChangeEvent } from "react-native";
import { useTheme, Appbar, List, Button, SegmentedButtons, Switch, Icon, Modal, Portal } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import _ from "lodash";

import { HYMN_MAX_FONT_SIZE, HYMN_MIN_FONT_SIZE, type Theme, THEME_DARK, THEME_LIGHT, THEME_SYSTEM } from "../config/values";
import { ThemeContext } from "../config/Theme/Context";
import StyledVerse from "../components/StyledVerse";
import SelectChord from "../components/SelectChord";
import { usePreferences } from "../hooks/usePreferences";

const Preferences = () => {
  const { preferences, savePreferences } = usePreferences();
  const theme = useTheme();
  const { fontSize, themeName, showAutoScroll, showAudioPlayer, showNotes, showToolbar, favoriteChords = [] } = preferences;
  const [verseHeight, setVerseHeight] = useState<number>(preferences.fontSize);
  const { themeName: themeNameContext, setThemeName: setThemeNameContext } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [showChordModal, setShowChordModal] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 2000);
  }, []);

  const handleFontSizeChange = _.debounce((value: number) => {
    if (!isLoaded) return;
    savePreferences({ ...preferences, fontSize: value });
  }, 150);

  const handleThemeChange = (value: Theme) => {
    setThemeNameContext(value);
    savePreferences({ ...preferences, themeName: value });
  };

  const handleChordToggle = (chord: string) => {
    const updatedChords = favoriteChords.includes(chord) ? favoriteChords.filter((c) => c !== chord) : [...favoriteChords, chord];

    savePreferences({ ...preferences, favoriteChords: updatedChords });
  };

  const onVerseLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setVerseHeight(height);
  };

  return (
    <View style={{ ...theme, flex: 1 }}>
      <Appbar.Header elevated={true}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Preferences" />
      </Appbar.Header>
      <View style={{ ...styles.content, flex: 1 }}>
        <ScrollView>
          <List.Section>
            <List.Subheader style={styles.subHeader}>Font Size ({fontSize})</List.Subheader>
            <Slider
              style={styles.slideFontSize}
              minimumValue={HYMN_MIN_FONT_SIZE}
              maximumValue={HYMN_MAX_FONT_SIZE}
              step={1}
              value={fontSize}
              onValueChange={handleFontSizeChange}
            />
            <StyledVerse
              line={"Oh! V[C|x1]em, Sen[G|↓↑↓]hor, c[D]om Teu Dom me conso[G]lar.[G|↓].."}
              fontSize={fontSize}
              fontSizeDouble={fontSize * 2}
              verseHeight={verseHeight}
              onChordPress={(chord) => console.log(`Chord pressed: ${chord}`)}
              selectedChord={""}
              onVerseLayout={(event) => onVerseLayout(event)}
              showNotes={showNotes}
            />
          </List.Section>

          <List.Section>
            <List.Subheader style={styles.subHeader}>Theme</List.Subheader>
            <SegmentedButtons
              value={themeName}
              onValueChange={handleThemeChange}
              buttons={[
                { label: "Sistema", value: THEME_SYSTEM },
                { label: "Dark", value: THEME_DARK },
                { label: "Light", value: THEME_LIGHT },
              ]}
            />
          </List.Section>

          <List.Section>
            <List.Subheader style={styles.subHeader}>Acordes Favoritos</List.Subheader>
            <List.Item
              title="Selecionar Acordes Favoritos"
              description={`${favoriteChords.length} acorde${favoriteChords.length !== 1 ? "s" : ""} selecionado${
                favoriteChords.length !== 1 ? "s" : ""
              }`}
              left={() => <Icon source="music" size={24} />}
              right={() => <Icon source="chevron-right" size={24} />}
              onPress={() => setShowChordModal(true)}
            />
            {favoriteChords.length > 0 && (
              <View style={styles.favoriteChords}>
                <Text variant="bodySmall" style={styles.favoriteChordsList}>
                  {favoriteChords.sort().join(", ")}
                </Text>
              </View>
            )}
          </List.Section>

          <List.Section>
            <List.Subheader style={styles.subHeader}>Componentes</List.Subheader>
            <List.Item
              title="Exibir Notas nas Cifras"
              description="Notas em alguns acordes para ajudar com o ritmo (visualizar no verso acima)"
              left={() => <Icon source="lead-pencil" size={24} />}
              right={() => (
                <Switch
                  value={showNotes ?? true}
                  onValueChange={(value) => {
                    savePreferences({ ...preferences, showNotes: value });
                  }}
                />
              )}
            />
            <List.Item
              title="Exibir Barra de Ferramentas"
              description="Barra de ferramentas abaixo do cabeçalho na tela de hino"
              left={() => <Icon source="tools" size={24} />}
              right={() => (
                <Switch
                  value={showToolbar ?? true}
                  onValueChange={(value) => {
                    savePreferences({ ...preferences, showToolbar: value });
                  }}
                />
              )}
            />
            <List.Item
              title="Exibir Rolagem Automática"
              description="Controle que permite iniciar rolagem automática no detalhe do hinos"
              left={() => <Icon source="pan-vertical" size={24} />}
              right={() => (
                <Switch
                  value={showAutoScroll ?? true}
                  onValueChange={(value) => {
                    savePreferences({ ...preferences, showAutoScroll: value });
                  }}
                />
              )}
            />
            <List.Item
              title="Exibir Player de Áudio"
              description="Player de áudio, no canto inferior esquerdo, do hino corrente "
              left={() => <Icon source="play" size={24} />}
              right={() => (
                <Switch
                  value={showAudioPlayer ?? true}
                  onValueChange={(value) => {
                    savePreferences({ ...preferences, showAudioPlayer: value });
                  }}
                />
              )}
            />
          </List.Section>
        </ScrollView>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Salvar
        </Button>
      </View>

      <Portal>
        <Modal
          visible={showChordModal}
          onDismiss={() => setShowChordModal(false)}
          contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.modalHeader}>
            <Text variant="headlineSmall">Selecionar Acordes Favoritos</Text>
            <Button onPress={() => setShowChordModal(false)}>Fechar</Button>
          </View>
          <SelectChord selectedChords={favoriteChords} onChordToggle={handleChordToggle} />
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  subHeader: {
    paddingLeft: 0,
  },
  slideFontSize: {
    width: "100%",
  },
  favoriteChords: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  favoriteChordsList: {
    color: "gray",
    fontStyle: "italic",
  },
  modalContainer: {
    flex: 1,
    margin: 20,
    marginTop: 60,
    borderRadius: 8,
    padding: 0,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
});

export default Preferences;
