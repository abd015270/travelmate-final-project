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

import DateTimePicker from "@react-native-community/datetimepicker";

import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { LanguageContext } from "../context/LanguageContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nationalIdRegex = /^\d{9}$/;
const phoneRegex = /^05\d{8}$/;
const fullNameRegex = /^[A-Za-z\u0590-\u05FF\u0600-\u06FF\s]+$/;

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseDate = (dateString) => {
  if (!dateString) {
    return new Date(2000, 0, 1);
  }

  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) {
    return new Date(2000, 0, 1);
  }

  return new Date(year, month - 1, day);
};

const calculateAge = (birthDateString) => {
  const birthDate = parseDate(birthDateString);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
};

const getMaximumBirthDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return date;
};

export default function ProfileScreen() {
  const {
    user,
    logout,
    updateProfile,
    deleteAccount,
  } = useContext(AuthContext);

  const {
    colors,
    darkMode,
    toggleTheme,
  } = useContext(ThemeContext);

  const {
    changeLanguage,
    t,
  } = useContext(LanguageContext);

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [nationalId, setNationalId] = useState(user?.nationalId || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [birthDate, setBirthDate] = useState(
    user?.birthDate?.slice(0, 10) || ""
  );

  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [updating, setUpdating] = useState(false);

  const validateProfile = () => {
    const trimmedName = fullName.trim();
    const lettersCount = trimmedName.replace(/\s/g, "").length;

    if (
      !trimmedName ||
      !email ||
      !nationalId ||
      !phone ||
      !birthDate
    ) {
      Alert.alert(t.error, t.fillAllFields);
      return false;
    }

    if (!fullNameRegex.test(trimmedName) || lettersCount < 8) {
      Alert.alert(t.error, t.invalidFullName);
      return false;
    }

    if (!emailRegex.test(email.trim().toLowerCase())) {
      Alert.alert(t.error, t.invalidEmail);
      return false;
    }

    if (!nationalIdRegex.test(nationalId)) {
      Alert.alert(t.error, t.invalidNationalId);
      return false;
    }

    if (!phoneRegex.test(phone)) {
      Alert.alert(t.error, t.invalidPhone);
      return false;
    }

    if (calculateAge(birthDate) < 18) {
      Alert.alert(t.error, t.invalidAge);
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!validateProfile() || updating) {
      return;
    }

    try {
      setUpdating(true);

      await updateProfile({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        nationalId,
        phone,
        birthDate,
      });

      Alert.alert(t.success, t.profileUpdated);
    } catch (error) {
      Alert.alert(
        t.error,
        error.response?.data?.message || t.couldNotUpdateProfile
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(t.deleteAccount, t.areYouSure, [
      {
        text: t.cancel,
      },
      {
        text: t.delete,
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAccount();
          } catch (error) {
            Alert.alert(t.error, t.couldNotDeleteAccount);
          }
        },
      },
    ]);
  };

  const handleBirthDateChange = (event, selectedDate) => {
    setShowBirthDatePicker(false);

    if (event.type === "dismissed" || !selectedDate) {
      return;
    }

    setBirthDate(formatLocalDate(selectedDate));
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {t.profile}
      </Text>

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
          onChangeText={(value) => {
            const lettersOnly = value.replace(
              /[^A-Za-z\u0590-\u05FF\u0600-\u06FF\s]/g,
              ""
            );

            setFullName(lettersOnly);
          }}
          placeholder={t.fullName}
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
          placeholder={t.email}
          placeholderTextColor={colors.subText}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
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
          onChangeText={(value) =>
            setNationalId(value.replace(/\D/g, "").slice(0, 9))
          }
          placeholder={t.nationalId}
          placeholderTextColor={colors.subText}
          keyboardType="number-pad"
          maxLength={9}
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
          onChangeText={(value) =>
            setPhone(value.replace(/\D/g, "").slice(0, 10))
          }
          placeholder={t.phone}
          placeholderTextColor={colors.subText}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <TouchableOpacity
          style={[
            styles.input,
            styles.dateButton,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setShowBirthDatePicker(true)}
        >
          <Text
            style={{
              color: birthDate ? colors.text : colors.subText,
            }}
          >
            {birthDate || t.selectBirthDate}
          </Text>
        </TouchableOpacity>

        {showBirthDatePicker && (
          <DateTimePicker
            value={parseDate(birthDate)}
            mode="date"
            display="default"
            maximumDate={getMaximumBirthDate()}
            onChange={handleBirthDateChange}
          />
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.updateButton,
          updating && styles.disabledButton,
        ]}
        onPress={handleUpdate}
        disabled={updating}
      >
        <Text style={styles.buttonText}>{t.updateProfile}</Text>
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
        <Text style={styles.buttonText}>{t.deleteAccount}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 35,
    paddingBottom: 35,
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
    minHeight: 50,
  },

  dateButton: {
    justifyContent: "center",
  },

  updateButton: {
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },

  disabledButton: {
    opacity: 0.6,
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