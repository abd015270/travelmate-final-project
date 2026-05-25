import { useContext, useState } from "react";

import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { AuthContext } from "../context/AuthContext";

import { ThemeContext } from "../context/ThemeContext";

import { LanguageContext } from "../context/LanguageContext";

export default function LoginScreen({
  navigation,
}) {
  const { login } = useContext(AuthContext);

  const { colors } =
    useContext(ThemeContext);

  const { t } =
    useContext(LanguageContext);

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert(
          "Error",
          "Please fill all fields"
        );

        return;
      }

      await login(email, password);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Login failed"
      );
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color: colors.text,
          },
        ]}
      >
        TravelMate
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor:
              colors.card,
            color: colors.text,
            borderColor:
              colors.border,
          },
        ]}
        placeholder={t.email}
        placeholderTextColor={
          colors.subText
        }
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor:
              colors.card,
            color: colors.text,
            borderColor:
              colors.border,
          },
        ]}
        placeholder={t.password}
        placeholderTextColor={
          colors.subText
        }
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>
          {t.login}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Register")
        }
      >
        <Text style={styles.link}>
          {t.createNewAccount}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },

  input: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },

  link: {
    textAlign: "center",
    marginTop: 18,
    color: "#2563eb",
  },
});