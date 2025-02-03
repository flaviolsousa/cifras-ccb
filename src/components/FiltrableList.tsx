import React, { useState } from 'react';
import { TextInput, List } from 'react-native-paper';

export interface FiltrableListItem {
  code: string;
  description: string;
}

export interface FiltrableListProps {
  items: FiltrableListItem[];
}

const FiltrableList: React.FC<FiltrableListProps> = ({ items }) => {
  const [filter, setFilter] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredItems = items.filter((item) =>
    item.description.toLowerCase().includes(filter.toLowerCase())
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % filteredItems.length);
    } else if (event.key === 'ArrowUp') {
      setSelectedIndex(
        (prevIndex) =>
          (prevIndex - 1 + filteredItems.length) % filteredItems.length
      );
    }
  };

  return (
    <div>
      <TextInput
        label="Filter items"
        value={filter}
        onChangeText={(text) => setFilter(text)}
      />
      <ul onKeyDown={handleKeyDown} tabIndex={0}>
        {filteredItems.map((item, index) => (
          <List.Item key={index} title={item.description} />
        ))}
      </ul>
    </div>
  );
};

export default FiltrableList;
