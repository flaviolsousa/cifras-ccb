import * as React from 'react';
import { View } from 'react-native';
import { useTheme, Button, Text } from 'react-native-paper';
import FiltrableList from '../components/FiltrableList';
import Hymns from '../data/Hymns.json';

function HomeView() {
  const theme = useTheme();
  const items = Hymns.map((hymn) => ({
    code: hymn.code,
    description: hymn.description,
  }));

  return (
    <View
      style={{
        ...theme,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Home View 001</Text>
      <FiltrableList items={items} />
      <Button
        icon="camera"
        mode="contained"
        onPress={() => console.log('Pressed')}
      >
        Press me
      </Button>
    </View>
  );
}

export default HomeView;
