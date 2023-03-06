import Home from "@app/Home";
import Login from "@app/Login";
import Chat from "@app/Chat";

import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { useAccount } from "@providers/AccountProvider";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useTheme } from "@providers/ThemeProvider";
import { View, StyleSheet, Text } from "react-native";
import { Switch } from "react-native-gesture-handler";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import Splash from "@app/Splash";
import FAQ from "@app/FAQ";
import Register from "@app/Register";
import { TouchableOpacity } from "react-native";

const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();
function HomeStack() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <HomeDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="FAQ" component={FAQ} />
    </Drawer.Navigator>
  );
}

function HomeDrawerContent(props: any) {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAccount();

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: theme.palette.background,
    },
    headerText: {
      fontSize: 20,
      color: theme.palette.text.primary,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      color: theme.palette.text.primary,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    label: {
      fontSize: 16,
      color: theme.palette.text.primary,
    },
  });

  return (
    <DrawerContentScrollView
      style={{ backgroundColor: theme.palette.background }}
      {...props}
    >
      <View style={styles.container}>
        <Text style={styles.headerText}>PocketGPT</Text>
      </View>
      <DrawerItemList {...props} />
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>Dark mode</Text>
          <Switch value={theme.mode === "dark"} onValueChange={toggleTheme} />
        </View>
        <TouchableOpacity
          onPress={() => {
            logout();
          }}
        >
          <View style={styles.row}>
            <Text style={styles.label}>Sign out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

export default function Navigator() {
  const { account, loading } = useAccount();

  return (
    <Stack.Navigator>
      {loading ? (
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
      ) : account ? (
        <>
          <Stack.Screen
            name="HomeStack"
            component={HomeStack}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{ ...TransitionPresets.SlideFromRightIOS }}
            initialParams={{
              chatId: null,
              title: null,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
