import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("token").then((t) => {
      if (t) {
        setToken(t);
        api("/profile", "GET", null, t).then(setUser).catch(() => setUser(null));
      }
    });
  }, []);

  const login = async (email, password) => {
    const res = await api("/auth/login", "POST", { email, password });
    if (res.token) {
      await AsyncStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (data) => {
    const res = await api("/auth/register", "POST", data);
    if (res.token) {
      await AsyncStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
