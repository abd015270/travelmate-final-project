import { useContext } from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { LanguageContext } from "../context/LanguageContext";

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  const { colors, darkMode, toggleTheme } = useContext(ThemeContext);

  const { changeLanguage, t } = useContext(LanguageContext);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t.profile}</Text>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.text, { color: colors.text }]}>
          Name: {user?.fullName}
        </Text>

        <Text style={[styles.text, { color: colors.text }]}>
          Email: {user?.email}
        </Text>

        <Text style={[styles.text, { color: colors.text }]}>
          Phone: {user?.phone}
        </Text>

        <Text style={[styles.text, { color: colors.text }]}>
          National ID: {user?.nationalId}
        </Text>
      </View>

      <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
        <Text style={styles.buttonText}>
          {darkMode ? t.lightMode : t.darkMode}
        </Text>
      </TouchableOpacity>

      <View style={styles.languages}>
        <TouchableOpacity
          style={styles.langButton}
          onPress={() => changeLanguage("en")}
        >
          <Text style={styles.buttonText}>EN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.langButton}
          onPress={() => changeLanguage("ar")}
        >
          <Text style={styles.buttonText}>AR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.langButton}
          onPress={() => changeLanguage("he")}
        >
          <Text style={styles.buttonText}>HE</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.buttonText}>{t.logout}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    padding: 18,
    borderRadius: 10,
    elevation: 3,
  },

  text: {
    fontSize: 16,
    marginBottom: 10,
  },

  themeButton: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },

  logoutButton: {
    backgroundColor: "#dc2626",
    padding: 15,
    borderRadius: 10,
    marginTop: 12,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  languages: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  langButton: {
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 10,
    width: "30%",
  },
});