import { useContext, useState } from "react";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { LanguageContext } from "../context/LanguageContext";

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);
  const { colors, darkMode, toggleTheme } = useContext(ThemeContext);
  const { changeLanguage, t } = useContext(LanguageContext);

  const [nationalId, setNationalId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      if (!nationalId || !fullName || !email || !phone || !birthDate || !password) {
        Alert.alert(t.error, t.fillAllFields);
        return;
      }

      await register({
        nationalId,
        fullName,
        email,
        phone,
        birthDate,
        password,
      });

      Alert.alert(t.success, t.accountCreated);
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert(t.error, error.response?.data?.message || t.registerFailed);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {t.createAccount}
      </Text>

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        placeholder={t.nationalId}
        placeholderTextColor={colors.subText}
        value={nationalId}
        onChangeText={setNationalId}
      />

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        placeholder={t.fullName}
        placeholderTextColor={colors.subText}
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        placeholder={t.email}
        placeholderTextColor={colors.subText}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        placeholder={t.phone}
        placeholderTextColor={colors.subText}
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        placeholder={t.birthDate}
        placeholderTextColor={colors.subText}
        value={birthDate}
        onChangeText={setBirthDate}
      />

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        placeholder={t.password}
        placeholderTextColor={colors.subText}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>{t.register}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>{t.alreadyHaveAccount}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
        <Text style={styles.buttonText}>
          {darkMode ? t.lightMode : t.darkMode}
        </Text>
      </TouchableOpacity>

      <View style={styles.languages}>
        <TouchableOpacity style={styles.langButton} onPress={() => changeLanguage("en")}>
          <Text style={styles.buttonText}>EN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.langButton} onPress={() => changeLanguage("ar")}>
          <Text style={styles.buttonText}>AR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.langButton} onPress={() => changeLanguage("he")}>
          <Text style={styles.buttonText}>HE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },

  input: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 10,
  },

  themeButton: {
    backgroundColor: "#7c3aed",
    padding: 15,
    borderRadius: 10,
    marginTop: 18,
  },

  languages: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  langButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 10,
    width: "30%",
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  link: {
    textAlign: "center",
    marginTop: 18,
    color: "#2563eb",
    fontWeight: "bold",
  },
});