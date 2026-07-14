import { useContext } from "react";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import AppNavigator from "./src/navigation/AppNavigator";

import AuthProvider from "./src/context/AuthContext";
import ThemeProvider, { ThemeContext } from "./src/context/ThemeContext";
import LanguageProvider from "./src/context/LanguageContext";

function AppContent() {
  const { darkMode, colors } = useContext(ThemeContext);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
        edges={["top", "left", "right"]}
      >
        <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
          <StatusBar
            style={darkMode ? "light" : "dark"}
            backgroundColor={colors.background}
          />

          <AppNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}