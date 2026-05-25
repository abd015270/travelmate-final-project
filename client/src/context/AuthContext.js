import {
  createContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import API from "../api/api";

export const AuthContext = createContext();

export default function AuthProvider({
  children,
}) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedToken =
        await AsyncStorage.getItem("token");

      const savedUser =
        await AsyncStorage.getItem("user");

      if (savedToken && savedUser) {
        setToken(savedToken);

        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await API.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      setToken(response.data.token);

      setUser(response.data.user);

      await AsyncStorage.setItem(
        "token",
        response.data.token
      );

      await AsyncStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);

    setToken(null);

    await AsyncStorage.removeItem("token");

    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}