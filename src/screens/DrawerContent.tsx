import React from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { DrawerItem, DrawerContentScrollView, DrawerContentComponentProps } from "@react-navigation/drawer";
import { useTheme, Avatar, Title, Caption, Paragraph, Drawer, Text, TouchableRipple, Switch } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = DrawerContentComponentProps;

function DrawerContent(props: Props) {
  const theme = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} style={{ flex: 1 }}>
        <View style={styles.drawerContent}>
          <View style={{ ...styles.profile }}>
            <Avatar.Image
              style={{ ...styles.profileAvatar }}
              source={{
                uri: "https://pbs.twimg.com/profile_images/1548044150603333638/3F3siO5A_200x200.jpg",
              }}
              size={100}
            />
            <View style={{ ...styles.profileContent }}>
              <Title style={{ ...styles.profileTitle }}>Flávio Sousa</Title>
              <Caption style={{ ...styles.profileUser }}>google: flaviolsousa</Caption>
            </View>
          </View>
          <Drawer.Section style={styles.drawerSection}>
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
              icon={({ color, size }) => <MaterialCommunityIcons name="bookmark-outline" color={theme.colors.secondary} size={size} />}
              label="Bookmarks"
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
  },
  profileAvatar: {
    marginRight: 15,
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
