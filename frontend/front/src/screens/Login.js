import React, { useState, useContext } from "react";
import { View, TextInput, Button, Text, TouchableOpacity } from "react-native";
import { AuthContext } from "../AuthContext";

export default function Login({ navigation }) {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    const res = await login(form.email, form.password);
    setMsg(res.error ? res.error : "✅ Успешный вход");
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Вход
      </Text>

      <TextInput
        placeholder="Email"
        value={form.email}
        onChangeText={(t) => setForm({ ...form, email: t })}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
          marginBottom: 10,
        }}
      />

      <TextInput
        placeholder="Пароль"
        secureTextEntry
        value={form.password}
        onChangeText={(t) => setForm({ ...form, password: t })}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
          marginBottom: 20,
        }}
      />

      <Button title="Войти" onPress={handleSubmit} />
      <Text style={{ marginTop: 10, color: "gray" }}>{msg}</Text>

      {/* 🔹 Кнопка для перехода на экран регистрации */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text
          style={{
            marginTop: 20,
            textAlign: "center",
            color: "#007AFF",
            fontWeight: "600",
          }}
        >
          Нет аккаунта? Зарегистрироваться
        </Text>
      </TouchableOpacity>
    </View>
  );
}
