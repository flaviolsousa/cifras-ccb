// src/screens/About.tsx
import React, { useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme, Appbar } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const About = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const scrollViewRef = useRef<ScrollView>(null);

  useFocusEffect(
    React.useCallback(() => {
      // Scroll to top when screen comes into focus
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: 0, animated: false });
        }
      }, 100);
    }, []),
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated={true}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Sobre" />
      </Appbar.Header>

      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent}>
        {/* Paragraphs */}
        <Text style={[styles.paragraph, { color: theme.colors.onBackground }]}>
          Este aplicativo foi criado de forma totalmente independente, sem qualquer vínculo oficial com a Congregação Cristã no Brasil.
        </Text>

        <Text style={[styles.paragraph, { color: theme.colors.onBackground }]}>
          O objetivo é simplesmente ajudar músicos amadores — como eu — a tocar os hinos da CCB com mais facilidade no violão.
        </Text>

        <Text style={[styles.paragraph, { color: theme.colors.onBackground }]}>
          Sou desenvolvedor de software e iniciante no violão. Criar este app foi uma forma de, enquanto estudava novas tecnologias, tornar o processo
          de tocar violão mais acessível — tanto para mim quanto para outros que também estão aprendendo o instrumento.
        </Text>

        <Text style={[styles.paragraph, { color: theme.colors.onBackground }]}>
          A programação e a música sempre foram grandes passatempos para mim. A música, em especial, é algo que compartilho com minha família e que me
          traz lembranças muito especiais do meu pai, Reinaldo Antunes de Sousa, que amava tocar hinos com seu clarinete e sua viola caipira. Este
          projeto foi desenvolvido não só como uma ferramenta prática, mas também como uma forma de manter viva essas memórias e carregar esse
          significado especial para mim.
        </Text>

        <Text style={[styles.paragraph, { color: theme.colors.onBackground }]}>
          Espero que este app te ajude tanto quanto tem me ajudado. Bons hinos, bons estudos… e que Deus te abençoe!
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  paragraph: {
    fontSize: 20,
    lineHeight: 40,
    marginBottom: 40,
    textAlign: "justify",
    textAlignVertical: "center",
  },
});

export default About;
