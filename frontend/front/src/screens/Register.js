import React, { useState, useContext } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { AuthContext } from "../AuthContext";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    const res = await register(form);
    setMsg(res.error ? res.error : "✅ Registered successfully");
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Name" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} />
      <TextInput placeholder="Email" value={form.email} onChangeText={(t) => setForm({ ...form, email: t })} />
      <TextInput placeholder="Password" secureTextEntry value={form.password} onChangeText={(t) => setForm({ ...form, password: t })} />
      <Button title="Register" onPress={handleSubmit} />
      <Text>{msg}</Text>
    </View>
  );
}
