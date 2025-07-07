# cifras-ccb

## Tasks

### Home Screen

- ☒ Filter hymns by title

### Hymn Detail Screen

- ☒ Display Hymn Detail screen
- ☒ Implement zoom control via gestures
- ☒ Implement zoom control via buttons
- ☒ Ensure chords and lyrics break lines together
- ☒ Implement header auto-hide on vertical scroll
- ☒ Implement header auto-hide in horizontal mode
- ☒ Add controls to navigate between neighboring hymns
- ☒ Option to display rhythm
- ☒ Implement auto-scroll feature
- ☒ Integrate MIDI player functionality
- ☒ Option to show/hide draw of chords
- ☒ Option to display capo positioning
- ☒ Implement tone selection feature
- ☒ Display rhythm instructions clearly: (\_ ‿ <sub>↑ ↓ ↟ ↥ ⇑ ⇞ ⇡ ↡ ↧ ⇓ ⇟ ⇣ x2 </sub> )
- ☒ Provide difficulty level
- ☒ When changing the tone key, retain the original chord positions
- ☒ Favorite Hymns
- ☒ Filter on Home Screen
- ☒ Show introduction
- ☒ Add Flag on hymn
- ☐ Highlight the easiest tone (with low capo position) in tone selection popup
- ☐ Display capo position for each chord in tone selection popup
- ☐ Mark chords as favorites
- ☐ Keep the screen always on during use

#### V2 (future)

- ☐ Count how many times a hymn is played
- ☐ Public statistics on hymn play counts
- ☐ Public statistics on which hymns have been favorited
- ☐ Add metronome functionality
- ☐ Add drums backing track support
- ☐ Allow MIDI playback of selected parts only
- ☐ Search by hymn content
- ☐ Search by favorite chords
- ☐ Recommended order for hymn practice sequence
- ☐ Enable user feedback on each hymn
- ☐ Let users save customized preferred tones and notes
- ☐ Add more themes, including high-contrast mode for accessibility
- ☐ Create social group (e.g., WhatsApp) for community support
- ☐ Support for other instruments (e.g., Ukulele, Viola Caipira, Piano)

## Start

### Browser

1. On your application

```sh
npx expo start
```

2. Press `w` on keyboard

### Android

1. Activate DevMode on yor Android

2. Install `Expo Go` on your Android

3. Plug your android by USB on PC

4. On your application

```sh
npx expo start --tunnel
npx expo start --tunnel -c
```

5. Press `a` on keyboard

## Build Android

```sh
# Generate .apk without signature for tests
eas build --platform android --profile preview
# eas build --platform android --profile development
```

## Reference to new project configuration

```sh
npm install -g expo-cli
npx create-expo-app cifras-ccb --template expo-template-blank-typescript

cd cifras-ccb
npm i

npx expo install react-dom react-native-web @expo/metro-runtime
npx expo install --fix

npx expo install @reduxjs/toolkit react-redux

npx expo install @react-navigation/native
# npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-navigation/native-stack

npx expo install @react-navigation/drawer
npx expo install react-native-paper
npx expo install eslint -- --save-dev
npx expo install expo-font
npx expo install SplashScreen

# npx expo install expo-app-loading

# npx expo install react-native-gesture-handler

npx expo install @react-native-community/slider
npx expo install expo-screen-orientation

npx expo-doctor
```

## References

- https://docs.expo.dev/workflow/expo-cli/
- https://callstack.github.io/react-native-paper/getting-started.html
- https://github.com/Trancever/twitterClone
- https://medium.com/react-native-training/best-practices-for-creating-react-native-apps-part-1-66311c746df3
- https://stackoverflow.com/questions/69854731/drawer-navigation-react-native-paper
- https://github.com/eneiasramos/ccb-hinario-5-do
- https://medium.com/async/react-navigation-stacks-tabs-and-drawers-oh-my-92edd606e4db
- https://cifrasccb.com.br
- https://github.com/tombatossals/chords-db/tree/master
- https://github.com/artutra/OpenChord?tab=readme-ov-file
- https://www.npmjs.com/package/@tonaljs/progression
- https://pictogrammers.com/library/mdi/
- https://www.caracteresespeciais.com/2009/09/lista-com-2-mil-caracteres-especiais.html
