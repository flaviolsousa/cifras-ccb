import React from "react";
import { View, StyleSheet, BackHandler, Image } from "react-native";
import { DrawerItem, DrawerContentScrollView, DrawerContentComponentProps } from "@react-navigation/drawer";
import { useTheme, Title, Caption, Drawer } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = DrawerContentComponentProps;

function DrawerContent(props: Props) {
  const theme = useTheme();
  const logoSource = theme.dark ? require("../../assets/logo-h-dark.png") : require("../../assets/logo-h-light.png");

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} style={{ flex: 1 }}>
        <View style={styles.drawerContent}>
          <Drawer.Section style={styles.drawerSection}>
            <Image style={{ ...styles.profileAvatar, width: "100%", height: 120 }} resizeMode="contain" source={logoSource} />
          </Drawer.Section>
          <Drawer.Section>
            <DrawerItem
              icon={({ size }) => <MaterialCommunityIcons name="home-outline" color={theme.colors.secondary} size={size} />}
              label="Home"
              onPress={() => {
                props.navigation.navigate("HomeStack");
                props.navigation.closeDrawer();
              }}
            />
          </Drawer.Section>
          <Drawer.Section>
            <DrawerItem
              icon={({ color, size }) => <MaterialCommunityIcons name="tune" color={theme.colors.secondary} size={size} />}
              label="Preferences"
              onPress={() => {
                props.navigation.navigate("Preferences");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => <MaterialCommunityIcons name="information" color={theme.colors.secondary} size={size} />}
              label="Sobre o App"
              onPress={() => {
                props.navigation.navigate("About");
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <View style={{ backgroundColor: theme.colors.surface }}>
        <DrawerItem
          icon={({ size }) => <MaterialCommunityIcons name="exit-to-app" color={theme.colors.secondary} size={size} />}
          label="Encerrar App"
          onPress={() => {
            BackHandler.exitApp();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },

  profile: {
    paddingLeft: 20,
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%", // garante que o container ocupe toda a largura
  },
  profileAvatar: {
    marginBottom: 20,
  },
  profileContent: {
    marginRight: "auto",
  },
  profileTitle: {
    fontWeight: "bold",
  },
  profileUser: {
    fontSize: 14,
    lineHeight: 14,
    display: "flex",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default DrawerContent;
