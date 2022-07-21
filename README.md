# violao-ccb

## Start

### Browser

1. On your application

   ```sh
   expo start:web
   ```

2. Press `W` on keyboard

### Android

1. Activate DevMode on yor Android

2. Install `Expo Go` on your Android

3. Plug your android by USB on PC

4. On your application

   ```sh
   expo start --tunnel
   ```

5. Press `A` on keyboard

## Build

```sh
eas build -p android --profile preview
```

## Reference Pages:

- https://docs.expo.dev/workflow/expo-cli/
- https://callstack.github.io/react-native-paper/getting-started.html
- https://github.com/Trancever/twitterClone
- https://medium.com/react-native-training/best-practices-for-creating-react-native-apps-part-1-66311c746df3

## Reference to new project configuration

```sh
expo init violao-ccb

npm install -s @react-navigation/native @react-navigation/stack @react-native-community/masked-view @react-navigation/drawer @react-navigation/material-bottom-tabs react-native-paper

npm install --save \
  react-native \
  react-native-reanimated \
  react-native-gesture-handler \
  react-native-screens \
  react-native-safe-area-view \
  react-native-safe-area-context \
  react-native-vector-icons \
  react-native-appearance

# react-navigation
# @react-native-community/masked-view
#
#
#
# react-native-svg
# react-native-web
```

```
npm install -g eas-cli
› eas build -p android
```
