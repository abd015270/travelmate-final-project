import { useContext, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { AuthContext } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);

  const [nationalId, setNationalId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      if (!nationalId || !fullName || !email || !phone || !birthDate || !password) {
        Alert.alert("Error", "Please fill all fields");
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

      Alert.alert("Success", "Account created");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Register failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput style={styles.input} placeholder="National ID" value={nationalId} onChangeText={setNationalId} />
      <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder="Birth Date 2000-01-01" value={birthDate} onChangeText={setBirthDate} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have account?</Text>
      </TouchableOpacity>
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
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#16a34a",
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