import React from "react";
import { THEME_SYSTEM } from "../values";

export const ThemeContext = React.createContext({
  setThemeName: (name: string) => {},
  themeName: THEME_SYSTEM,
});
