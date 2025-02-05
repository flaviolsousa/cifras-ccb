import React from "react";
import { View, StyleSheet } from "react-native";
import { DrawerItem, DrawerContentScrollView, DrawerContentComponentProps } from "@react-navigation/drawer";
import { useTheme, Avatar, Title, Caption, Paragraph, Drawer, Text, TouchableRipple, Switch } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = DrawerContentComponentProps;

//const DrawerItemNavigate = ({ materialIcon, label, navigateTo }) => {};

function DrawerContent(props: Props) {
  const theme = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} style={{ ...theme, flex: 1, backgroundColor: theme.colors.surface }}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <Avatar.Image
              source={{
                uri: "https://pbs.twimg.com/profile_images/1548044150603333638/3F3siO5A_200x200.jpg",
              }}
              size={50}
            />
            <Title style={{ ...theme, ...styles.title, color: theme.colors.primary }}>Flávio Sousa</Title>
            <Caption style={{ ...theme, ...styles.caption, color: theme.colors.secondary }}>google: flaviolsousa</Caption>
          </View>
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ size }) => <MaterialCommunityIcons name="home-outline" color={theme.colors.secondary} size={size} />}
              label="Home"
              labelStyle={{ color: theme.colors.secondary }}
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
              labelStyle={{ color: theme.colors.secondary }}
              onPress={() => {
                props.navigation.navigate("Preferences");
              }}
            />
            <DrawerItem
              icon={({ color, size }) => <MaterialCommunityIcons name="bookmark-outline" color={theme.colors.secondary} size={size} />}
              label="Bookmarks"
              labelStyle={{ color: theme.colors.secondary }}
              onPress={() => {
                props.navigation.navigate("Bookmarks");
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <View style={{ backgroundColor: theme.colors.surface }}>
        <DrawerItem
          icon={({ color, size }) => <MaterialCommunityIcons name="exit-to-app" color={theme.colors.secondary} size={size} />}
          label="Close"
          labelStyle={{ color: theme.colors.secondary }}
          onPress={() => {
            props.navigation.closeDrawer();
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
  userInfoSection: {
    flexDirection: "row",
    paddingLeft: 20,
    paddingTop: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
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
