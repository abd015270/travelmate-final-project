import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function CustomButton({ title, onPress, color }) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color || "#2563eb" }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  text: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});