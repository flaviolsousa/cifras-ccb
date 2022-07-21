import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

function HymnView() {
  const theme = useTheme();
  return (
    <View
      style={{
        ...theme,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Hymn View 001</Text>
    </View>
  );
}

export default HymnView;
