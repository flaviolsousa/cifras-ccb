import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";

interface HymnDetailToolbarProps {
  onNavigate: () => void;
  onZoom: () => void;
  onToneChange: () => void;
  onToggleAutoScroll: () => void;
  onToggleAudioPlayer: (value: boolean) => void;
  onToggleNotes: () => void;
  onEditHymn: () => void;
  visible: boolean;
  isWebPlatform: boolean; // New prop to check if we're on web platform

  // States for toggle buttons
  navigationVisible: boolean;
  zoomControlVisible: boolean;
  toneNavigationVisible: boolean;
  autoScrollVisible: boolean;
  audioPlayerVisible: boolean;
  showNotes: boolean;
}

const HymnDetailToolbar = ({
  onNavigate,
  onZoom,
  onToneChange,
  onToggleAutoScroll,
  onToggleAudioPlayer,
  onToggleNotes,
  onEditHymn,
  visible,
  isWebPlatform,

  // Toggle states
  navigationVisible,
  zoomControlVisible,
  toneNavigationVisible,
  autoScrollVisible,
  audioPlayerVisible,
  showNotes,
}: HymnDetailToolbarProps) => {
  const theme = useTheme();

  if (!visible) return null;

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.elevation.level1,
      paddingVertical: 8,
      paddingHorizontal: 4,
      // Remove the border
      // borderBottomWidth: 1,
      // borderBottomColor: theme.colors.outline,

      // Add shadow properties similar to Appbar
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5, // For Android
      zIndex: 1, // Ensure shadow is visible
    },
    scrollView: {
      flexGrow: 0,
    },
    toolbar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    buttonContainer: {
      alignItems: "center",
      marginHorizontal: 4,
    },
    buttonLabel: {
      fontSize: 10,
      textAlign: "center",
    },
    activeButton: {
      backgroundColor: theme.colors.primaryContainer,
    },
    activeLabel: {
      color: theme.colors.primary,
      fontWeight: "bold",
    },
  });

  const getButtonStyle = (isActive: boolean) => (isActive ? { backgroundColor: theme.colors.primaryContainer } : {});

  const getLabelStyle = (isActive: boolean) => (isActive ? styles.activeLabel : {});

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolbar} style={styles.scrollView}>
        {isWebPlatform && (
          <View style={styles.buttonContainer}>
            <IconButton icon="file-edit-outline" size={24} onPress={onEditHymn} />
            <Text style={styles.buttonLabel}>Editar</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <IconButton
            icon="page-next-outline"
            size={24}
            onPress={() => {
              if (navigationVisible) {
                // If already visible, close it
                onNavigate();
              } else {
                // If not visible, open it
                onNavigate();
              }
            }}
            style={getButtonStyle(navigationVisible)}
          />
          <Text style={[styles.buttonLabel, getLabelStyle(navigationVisible)]}>Navegar</Text>
        </View>

        <View style={styles.buttonContainer}>
          <IconButton
            icon="format-size"
            size={24}
            onPress={() => {
              if (zoomControlVisible) {
                // If already visible, close it
                onZoom();
              } else {
                // If not visible, open it
                onZoom();
              }
            }}
            style={getButtonStyle(zoomControlVisible)}
          />
          <Text style={[styles.buttonLabel, getLabelStyle(zoomControlVisible)]}>Fonte</Text>
        </View>

        <View style={styles.buttonContainer}>
          <IconButton
            icon="music-accidental-sharp"
            size={24}
            onPress={() => {
              if (toneNavigationVisible) {
                // If already visible, close it
                onToneChange();
              } else {
                // If not visible, open it
                onToneChange();
              }
            }}
            style={getButtonStyle(toneNavigationVisible)}
          />
          <Text style={[styles.buttonLabel, getLabelStyle(toneNavigationVisible)]}>Tom</Text>
        </View>

        <View style={styles.buttonContainer}>
          <IconButton icon="pan-vertical" size={24} onPress={onToggleAutoScroll} style={getButtonStyle(autoScrollVisible)} />
          <Text style={[styles.buttonLabel, getLabelStyle(autoScrollVisible)]}>Rolagem</Text>
        </View>

        <View style={styles.buttonContainer}>
          <IconButton icon="play" size={24} onPress={() => onToggleAudioPlayer(!audioPlayerVisible)} style={getButtonStyle(audioPlayerVisible)} />
          <Text style={[styles.buttonLabel, getLabelStyle(audioPlayerVisible)]}>Áudio</Text>
        </View>

        <View style={styles.buttonContainer}>
          <IconButton icon="lead-pencil" size={24} onPress={onToggleNotes} style={getButtonStyle(showNotes)} />
          <Text style={[styles.buttonLabel, getLabelStyle(showNotes)]}>Notas</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default HymnDetailToolbar;
