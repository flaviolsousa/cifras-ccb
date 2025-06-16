import { useState, useEffect } from "react";
import { Preferences, PreferencesService } from "../services/PreferencesService";

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(PreferencesService.DEFAULT_PREFERENCES);

  useEffect(() => {
    async function fetchPreferences() {
      const loadedPreferences = await PreferencesService.loadPreferences();
      setPreferences(loadedPreferences);
    }
    fetchPreferences();
  }, []);

  const savePreferences = async (updatedPreferences: Preferences) => {
    setPreferences(updatedPreferences);
    await PreferencesService.savePreferences(updatedPreferences);
  };

  return { preferences, savePreferences };
}
