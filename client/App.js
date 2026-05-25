import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import AuthProvider from "./src/context/AuthContext";
import ThemeProvider from "./src/context/ThemeContext";
import LanguageProvider from "./src/context/LanguageContext";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}