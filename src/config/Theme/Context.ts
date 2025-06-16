import React from "react";
import { Theme, THEME_SYSTEM } from "../values";

export const ThemeContext = React.createContext({
  setThemeName: (name: Theme) => {},
  themeName: THEME_SYSTEM,
});
