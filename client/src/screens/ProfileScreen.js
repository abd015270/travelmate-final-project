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

export default function ProfileScreen() {
  const { user, logout, updateProfile, deleteAccount } = useContext(AuthContext);

  const { colors, darkMode, toggleTheme } = useContext(ThemeContext);

  const { changeLanguage, t } = useContext(LanguageContext);

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [nationalId, setNationalId] = useState(user?.nationalId || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const handleUpdate = async () => {
    try {
      await updateProfile({
        fullName,
        email,
        nationalId,
        phone,
      });

      Alert.alert("Success", "Profile updated");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Could not update profile"
      );
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Account", "Are you sure?", [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteAccount();
          } catch (error) {
            Alert.alert("Error", "Could not delete account");
          }
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{t.profile}</Text>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full Name"
          placeholderTextColor={colors.subText}
        />

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={colors.subText}
        />

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          value={nationalId}
          onChangeText={setNationalId}
          placeholder="National ID"
          placeholderTextColor={colors.subText}
        />

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.background,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone"
          placeholderTextColor={colors.subText}
        />
      </View>

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>

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

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete Account</Text>
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

  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  updateButton: {
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },

  themeButton: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
    marginTop: 12,
  },

  logoutButton: {
    backgroundColor: "#f97316",
    padding: 15,
    borderRadius: 10,
    marginTop: 12,
  },

  deleteButton: {
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