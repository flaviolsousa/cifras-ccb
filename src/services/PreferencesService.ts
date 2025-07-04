import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { Theme } from "../config/values";

const PREFERENCES_FILE = `${FileSystem.documentDirectory}violao-ccb-preferences.json`;

export type Preferences = {
  fontSize: number;
  themeName: Theme;
  favoriteChords?: string[];
  favoriteHymns?: number[];
  flaggedHymns?: number[];
  showAutoScroll: boolean;
  showAudioPlayer: boolean;
  showNotes: boolean;
  showToolbar: boolean;
};

const DEFAULT_PREFERENCES: Preferences = {
  fontSize: Platform.OS === "web" ? 30 : 22,
  themeName: "system",
  favoriteChords: ["A", "A7", "Am", "C", "D", "D7", "Dm", "E", "E7", "Em", "G", "B7"],
  favoriteHymns: [],
  flaggedHymns: [],
  showAutoScroll: true,
  showAudioPlayer: true,
  showNotes: true,
  showToolbar: true,
};

async function savePreferences(preferences: Preferences): Promise<void> {
  try {
    const jsonValue = JSON.stringify(preferences);
    if (Platform.OS === "web") {
      console.log("Saving preferences 1:", preferences);
      await AsyncStorage.setItem("preferences", jsonValue);
    } else {
      console.log("Saving preferences 2:", preferences);
      await FileSystem.writeAsStringAsync(PREFERENCES_FILE, jsonValue);
    }
  } catch (error) {
    console.error("Failed to save preferences:", error);
  }
}

async function loadPreferences(): Promise<Preferences> {
  try {
    if (Platform.OS === "web") {
      const jsonValue = await AsyncStorage.getItem("preferences");

      console.log("Loaded preferences 1:", jsonValue);
      return jsonValue != null ? JSON.parse(jsonValue) : DEFAULT_PREFERENCES;
    } else {
      const fileExists = await FileSystem.getInfoAsync(PREFERENCES_FILE);
      if (fileExists.exists) {
        const jsonValue = await FileSystem.readAsStringAsync(PREFERENCES_FILE);

        console.log("Loaded preferences 2:", jsonValue);
        return JSON.parse(jsonValue);
      }
    }
  } catch (error) {
    console.error("Failed to load preferences:", error);
  }
  return DEFAULT_PREFERENCES;
}

export const PreferencesService = {
  savePreferences,
  loadPreferences,
  DEFAULT_PREFERENCES,
};
