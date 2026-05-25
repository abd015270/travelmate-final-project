import { useContext } from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemeContext } from "../context/ThemeContext";

import { LanguageContext } from "../context/LanguageContext";

export default function HomeScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);

  const { t } = useContext(LanguageContext);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
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
        {t.welcome}
      </Text>

      <Text
        style={[
          styles.text,
          {
            color: colors.subText,
          },
        ]}
      >
        {t.subtitle}
      </Text>

      <View style={styles.cards}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate(t.trips)}
        >
          <Text style={styles.cardText}>{t.trips}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate(t.favorites)}
        >
          <Text style={styles.cardText}>{t.favorites}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate(t.bookings)}
        >
          <Text style={styles.cardText}>{t.bookings}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
  },

  cards: {
    gap: 15,
  },

  card: {
    backgroundColor: "#2563eb",
    padding: 25,
    borderRadius: 15,
  },

  cardText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
});