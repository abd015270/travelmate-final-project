import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AuthContext } from "../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <Text style={styles.text}>Name: {user?.fullName}</Text>
        <Text style={styles.text}>Email: {user?.email}</Text>
        <Text style={styles.text}>Phone: {user?.phone}</Text>
        <Text style={styles.text}>National ID: {user?.nationalId}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 10,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#dc2626",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});