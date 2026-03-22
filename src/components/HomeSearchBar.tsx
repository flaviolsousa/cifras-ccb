import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { Searchbar, List } from "react-native-paper";

type Props = {
  filteredCount: number;
  searchQuery: string;
  onChangeSearch: (text: string) => void;
  filterVisible: boolean;
  onToggleFilters: () => void;
  style?: StyleProp<ViewStyle>;
};

const HomeSearchBar: React.FC<Props> = ({
  filteredCount,
  searchQuery,
  onChangeSearch,
  filterVisible,
  onToggleFilters,
  style,
}) => {
  const filterIconScale = useRef(new Animated.Value(1)).current;
  const filterIconRotate = useRef(new Animated.Value(0)).current;
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(filterIconScale, {
            toValue: 1.3,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(filterIconRotate, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(filterIconScale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(filterIconRotate, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]),
      ]).start();
    }
  }, [isFocused, filterIconScale, filterIconRotate]);

  return (
    <Searchbar
      placeholder={`Filtrar por Nome - ${filteredCount} Hinos`}
      value={searchQuery}
      onChangeText={onChangeSearch}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={style}
      icon="magnify"
      right={(props) => (
        <TouchableOpacity onPress={onToggleFilters}>
          <Animated.View
            style={{
              transform: [
                { scale: filterIconScale },
                {
                  rotate: filterIconRotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "10deg"],
                  }),
                },
              ],
            }}
          >
            <List.Icon {...props} icon={filterVisible ? "filter-remove-outline" : "filter-menu-outline"} style={{ marginRight: 10 }} />
          </Animated.View>
        </TouchableOpacity>
      )}
    />
  );
};

export default HomeSearchBar;
