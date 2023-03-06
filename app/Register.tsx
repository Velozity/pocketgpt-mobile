import React, { useState } from "react";
import { useTheme } from "@providers/ThemeProvider";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import WebAPIClient from "@services/WebAPIClient";

const Register = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.palette.background,
      alignItems: "center",
      justifyContent: "center",
    },
    inputContainer: {
      marginBottom: 20,
      width: "80%",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.palette.background,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: theme.palette.text.secondary,
      padding: 10,
    },
    inputIcon: {
      marginRight: 10,
      color: theme.palette.text.secondary,
    },
    input: {
      flex: 1,
      paddingVertical: 8,
      color: theme.palette.text.primary,
    },
    button: {
      width: "80%",
      backgroundColor: theme.palette.primary,
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: theme.palette.text.primary,
      fontSize: 18,
      fontWeight: "bold",
    },
    buttonSignIn: {
      width: "80%",
      backgroundColor: theme.palette.secondary,
      borderRadius: 25,
      marginTop: 40,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonSignInText: {
      color: theme.palette.text.primary,
      fontSize: 18,
      fontWeight: "bold",
    },
  });

  const handleEmailChange = (text: string) => {
    setEmail(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  const handleRegister = () => {
    const api = new WebAPIClient();

    api.register(email, password).then((res) => {
      if (res.error) {
        Toast.show(res.error);
      }

      if (res.success) {
        Toast.show("You may login.");
        navigation.navigate("Login");
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <FontAwesome5 name="envelope" size={24} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={theme.palette.text.hintColor}
          onChangeText={handleEmailChange}
          value={email}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <FontAwesome5 name="lock" size={24} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={theme.palette.text.hintColor}
          onChangeText={handlePasswordChange}
          value={password}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonSignIn}
        onPress={() => {
          navigation.navigate("Login");
        }}
      >
        <Text style={styles.buttonSignInText}>Already have an account?</Text>
      </TouchableOpacity>
      <StatusBar
        style={theme ? (theme.mode === "dark" ? "light" : "dark") : "auto"}
      />
    </View>
  );
};

export default Register;
