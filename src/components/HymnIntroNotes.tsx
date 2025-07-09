import React, { useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { Divider, useTheme } from "react-native-paper";
import { HymnModel } from "../domain/HymnModel";

interface HymnIntroNotesProps {
  hymn: HymnModel;
  visible?: boolean;
  isPortrait?: boolean;
  contentWidth: number;
}

const HymnIntroNotes: React.FC<HymnIntroNotesProps> = ({ hymn, contentWidth, visible = true, isPortrait = true }) => {
  const theme = useTheme();
  const [imageError, setImageError] = useState(false);

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      overflow: "hidden",
      marginLeft: 8,
    },
    image: {
      width: isPortrait ? contentWidth * 1.5 : contentWidth * 0.98,
      height: isPortrait ? 250 * (contentWidth / 2252) * 1.5 : 250 * (contentWidth / 2252),
      tintColor: theme.colors.secondary,
    },
  });

  if (!visible || imageError) return null;

  const imageUrl = `https://flaviolsousa.github.io/cifras-ccb-assets/png-intro/${hymn.code}.png`;

  return (
    <>
      <View style={styles.container}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" onError={() => setImageError(true)} />
      </View>
      <Divider />
    </>
  );
};

export default HymnIntroNotes;
