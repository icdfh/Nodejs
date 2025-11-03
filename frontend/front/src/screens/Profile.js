import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../AuthContext";
import { API_URL } from "../api";

export default function Profile() {
  const { user, token, logout, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(null);
  const [msg, setMsg] = useState("");

  if (!user) return <Text style={{ padding: 20 }}>Not logged in</Text>;

  // 📸 выбрать изображение
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      setAvatar(result.assets[0]);
    }
  };

  // 💾 отправить обновление профиля
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (avatar) {
      formData.append("avatar", {
        uri: avatar.uri,
        type: "image/jpeg",
        name: "avatar.jpg",
      });
    }

    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        setMsg(data.error);
      } else {
        setUser(data); // обновим user в контексте
        setMsg("✅ Профиль обновлён!");
      }
    } catch (e) {
      setMsg("Ошибка при обновлении профиля");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 15 }}>
        Профиль
      </Text>

      {/* Аватар */}
      {user.avatar_url && !avatar && (
        <Image
          source={{ uri: `${API_URL}${user.avatar_url}` }}
          style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
        />
      )}
      {avatar && (
        <Image
          source={{ uri: avatar.uri }}
          style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
        />
      )}

      <TouchableOpacity onPress={pickImage}>
        <Text style={{ color: "#007AFF", marginBottom: 15 }}>
          📸 Изменить фото
        </Text>
      </TouchableOpacity>

      {/* Имя */}
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Введите имя"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          marginBottom: 15,
        }}
      />

      {/* Кнопки */}
      <Button title="Сохранить изменения" onPress={handleSave} />
      <View style={{ marginTop: 10 }}>
        <Button title="Выйти" color="red" onPress={logout} />
      </View>

      <Text style={{ marginTop: 10, color: "gray" }}>{msg}</Text>
    </View>
  );
}
