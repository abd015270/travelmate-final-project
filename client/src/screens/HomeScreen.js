import { useContext } from "react";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ThemeContext } from "../context/ThemeContext";

import { LanguageContext } from "../context/LanguageContext";

export default function HomeScreen() {
  const { colors } =
    useContext(ThemeContext);

  const { t } =
    useContext(LanguageContext);

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  text: {
    fontSize: 18,
  },
});