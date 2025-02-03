import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Text, Button } from 'react-native-paper';
import FiltrableList, { FiltrableListItem } from '../components/FiltrableList';

function HomeView() {
  const theme = useTheme();
  const items: FiltrableListItem[] = [
    { code: '001', description: 'Cristo, meu Mestre...' },
    { code: '002', description: 'De Deus tu és eleita' },
    { code: '003', description: 'Faz-nos ouvir Tua voz' },
    { code: '004', description: 'Ouve a nossa oração' },
    { code: '005', description: 'A Rocha celestial' },
    { code: '006', description: 'Glória ao Justo, fiel Cordeiro!' },
    { code: '007', description: 'Granjeai, granjeai os talentos' },
    { code: '008', description: 'Oh! Vem, sim, vem' },
    { code: '009', description: 'Luminosa é a senda' },
  ];

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
