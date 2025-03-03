// src/screens/HymnDetails.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text, Dimensions, Platform } from "react-native";
import { useTheme, Appbar, IconButton } from "react-native-paper";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/MainNavigator";
import { PinchGestureHandler, PinchGestureHandlerGestureEvent, HandlerStateChangeEvent, State } from "react-native-gesture-handler";
import HymnService from "../services/Hymn/HymnService";

type HymnDetailsRouteProp = RouteProp<RootStackParamList, "HymnDetails">;

const HymnDetails = () => {
  const theme = useTheme();
  const fontSizeInitial = 16;
  const route = useRoute<HymnDetailsRouteProp>();
  const navigation = useNavigation();
  const { hymnCode: hymnCode } = route.params;
  const [fontSize, setFontSize] = useState(fontSizeInitial);
  const [fontSizeReference, setFontSizeReference] = useState(fontSizeInitial);
  const [hymnTitle, setTitle] = useState<string>("");
  const [hymnContent, setHymnContent] = useState<string>("");
  const [isPortrait, setIsPortrait] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const hymn = await HymnService.getHymn(hymnCode);
      if (hymn) {
        const content = hymn.content.join("\n");
        setTitle(`${hymn.code} - ${hymn.title}`);
        setHymnContent(content);
      } else {
        setTitle(`${hymnCode} - Hino não encontrado`);
        setHymnContent("TBD");
      }
    };
    fetchContent();
  }, [hymnCode]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setIsPortrait(window.height > window.width);
    });

    setIsPortrait(Dimensions.get("window").height > Dimensions.get("window").width);

    return () => subscription.remove();
  }, []);

  const onPinchEvent = (event: PinchGestureHandlerGestureEvent) => {
    if (event.nativeEvent.scale) {
      setFontSize(() => Math.max(10, Math.min(72, fontSizeReference * event.nativeEvent.scale)));
    }
  };

  const onPinchStateEvent = (event: HandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.ACTIVE) setFontSizeReference(fontSize);
  };

  const shouldShowHeader = Platform.OS === "web" || isPortrait;

  return (
    <View style={{ ...theme, flex: 1 }}>
      {shouldShowHeader && (
        <Appbar.Header elevated={true}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={hymnTitle} />
          <IconButton
            icon="information"
            onPress={() => {
              /* Toggle área de detalhes do hino */
            }}
          />
        </Appbar.Header>
      )}

      <PinchGestureHandler onGestureEvent={onPinchEvent} onHandlerStateChange={onPinchStateEvent}>
        <ScrollView contentContainerStyle={[styles.content, isPortrait ? styles.portrait : styles.landscape]}>
          <Text style={[styles.hymnText, { fontSize, color: theme.colors.secondary }]}>{hymnContent}</Text>
        </ScrollView>
      </PinchGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  hymnText: {
    fontFamily: "UbuntuMonoRegular",
  },
  portrait: {
    paddingHorizontal: 16,
  },
  landscape: {
    paddingHorizontal: 16,
    marginTop: 16,
    alignSelf: "center",
    width: "100%",
  },
});

export default HymnDetails;
