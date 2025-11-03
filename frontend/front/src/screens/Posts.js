import React, { useState, useContext, useLayoutEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { api } from "../api";
import PostCard from "../components/PostCard";
import { AuthContext } from "../AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

export default function Posts({ navigation }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  // ✅ загружаем посты при каждом возврате на экран
  useFocusEffect(
    React.useCallback(() => {
      api("/posts").then(setPosts);
    }, [])
  );

  // ✅ кнопки в шапке
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-circle-outline" size={28} color="#007AFF" />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate("CreatePost")}>
          <Ionicons name="add-circle-outline" size={28} color="#007AFF" />
        </TouchableOpacity>
      ),
      title: "Посты",
    });
  }, [navigation]);

  return (
    <ScrollView>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          margin: 10,
        }}
      >
        Все посты
      </Text>

      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}

      {posts.length === 0 && (
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Text style={{ color: "gray" }}>Постов пока нет 😔</Text>
        </View>
      )}
    </ScrollView>
  );
}
