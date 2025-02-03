import React, { useState } from 'react';

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
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items"
      />
      <ul onKeyDown={handleKeyDown} tabIndex={0}>
        {filteredItems.map((item, index) => (
          <li
            key={index}
            style={{
              background: index === selectedIndex ? 'lightgray' : 'white',
            }}
          >
            {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FiltrableList;
