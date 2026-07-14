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

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;

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

  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const trimmedName = fullName.trim();
    const lettersCount = trimmedName.replace(/\s/g, "").length;

    if (
      !nationalId ||
      !trimmedName ||
      !email ||
      !phone ||
      !birthDate ||
      !password
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

    if (!passwordRegex.test(password)) {
      Alert.alert(t.error, t.invalidPassword);
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm() || submitting) {
      return;
    }

    try {
      setSubmitting(true);

      await register({
        nationalId,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone,
        birthDate,
        password,
      });

      Alert.alert(t.success, t.accountCreated);
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert(
        t.error,
        error.response?.data?.message || t.registerFailed
      );
    } finally {
      setSubmitting(false);
    }
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
        {t.createAccount}
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder={t.nationalId}
        placeholderTextColor={colors.subText}
        value={nationalId}
        onChangeText={(value) =>
          setNationalId(value.replace(/\D/g, "").slice(0, 9))
        }
        keyboardType="number-pad"
        maxLength={9}
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder={t.fullName}
        placeholderTextColor={colors.subText}
        value={fullName}
        onChangeText={(value) => {
          const lettersOnly = value.replace(
            /[^A-Za-z\u0590-\u05FF\u0600-\u06FF\s]/g,
            ""
          );

          setFullName(lettersOnly);
        }}
        autoCapitalize="words"
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder={t.email}
        placeholderTextColor={colors.subText}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder={t.phone}
        placeholderTextColor={colors.subText}
        value={phone}
        onChangeText={(value) =>
          setPhone(value.replace(/\D/g, "").slice(0, 10))
        }
        keyboardType="phone-pad"
        maxLength={10}
      />

      <TouchableOpacity
        style={[
          styles.input,
          styles.dateButton,
          {
            backgroundColor: colors.card,
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

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder={t.password}
        placeholderTextColor={colors.subText}
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={styles.showPasswordButton}
        onPress={() => setShowPassword((previous) => !previous)}
      >
        <Text style={styles.showPasswordText}>
          {showPassword ? t.hidePassword : t.showPassword}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          submitting && styles.disabledButton,
        ]}
        onPress={handleRegister}
        disabled={submitting}
      >
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingTop: 35,
    paddingBottom: 35,
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
    minHeight: 52,
  },

  dateButton: {
    justifyContent: "center",
  },

  button: {
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 10,
    marginTop: 5,
  },

  disabledButton: {
    opacity: 0.6,
  },

  showPasswordButton: {
    alignSelf: "flex-end",
    marginTop: -4,
    marginBottom: 14,
  },

  showPasswordText: {
    color: "#2563eb",
    fontWeight: "bold",
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