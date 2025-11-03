import React, { useState, useContext } from "react";
import { View, TextInput, Button, Text, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../AuthContext";
import { API_URL } from "../api";

export default function CreatePost({ navigation }) {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title) {
      setMsg("Введите заголовок");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    if (image) {
      formData.append("image", {
        uri: image.uri,
        type: "image/jpeg",
        name: "photo.jpg",
      });
    }

    const res = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await res.json();
    if (data.error) setMsg(data.error);
    else {
      setMsg("✅ Пост создан!");
      navigation.goBack();
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Заголовок"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Описание"
        multiline
        numberOfLines={4}
        value={body}
        onChangeText={setBody}
        style={{
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
          marginBottom: 10,
          textAlignVertical: "top",
        }}
      />

      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: "100%", height: 200, marginBottom: 10, borderRadius: 10 }}
        />
      )}

      <Button title="📸 Выбрать фото" onPress={pickImage} />
      <Button title="✅ Создать пост" onPress={handleSubmit} />
      <Text style={{ marginTop: 10, color: "gray" }}>{msg}</Text>
    </View>
  );
}
