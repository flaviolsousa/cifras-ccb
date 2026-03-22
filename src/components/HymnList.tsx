import React from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { List } from "react-native-paper";

export type HymnListItem = {
  code: string;
  title: string;
  level?: number;
  chords: string[];
  rhythm?: string;
  isFavorite: boolean;
  isFlagged: boolean;
};

type Props = {
  data: HymnListItem[];
  listRef?: React.Ref<FlatList<HymnListItem>>;
  onPressItem: (item: HymnListItem) => void;
  onToggleFavorite: (code: string) => void;
};

const HymnList: React.FC<Props> = ({ data, listRef, onPressItem, onToggleFavorite }) => (
  <FlatList
    ref={listRef}
    data={data}
    keyExtractor={(item) => item.code}
    renderItem={({ item }) => (
      <TouchableOpacity onPress={() => onPressItem(item)}>
        <List.Item
          title={item.code + " - " + item.title}
          description={`${item.level ? `Dif.: ${item.level}      ` : ""}${item.rhythm ? `${item.rhythm}      ` : ""}${item.chords.join(", ")}`}
          descriptionStyle={{ fontSize: 10 }}
          right={(props) => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {item.isFlagged && <List.Icon {...props} icon="flag" color="#d32f2f" style={{ marginRight: 0 }} />}
              <TouchableOpacity onPress={() => onToggleFavorite(item.code)}>
                <List.Icon {...props} icon={item.isFavorite ? "star" : "star-outline"} color={item.isFavorite ? "#FFD700" : "#888"} />
              </TouchableOpacity>
            </View>
          )}
        />
      </TouchableOpacity>
    )}
  />
);

export default HymnList;
