import React from "react";
import { useTheme } from "@providers/ThemeProvider";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

const Splash = () => {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.palette.background }]}
    >
      <StatusBar style="auto" />
      <Text style={[styles.text, { color: theme.palette.text.primary }]}>
        PocketGPT
      </Text>
      <ActivityIndicator
        size="small"
        color={theme.palette.primary}
        style={{ marginTop: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
});

export default Splash;
