import React from "react";
import { View, Text, Image } from "react-native";
import { API_URL } from "../api";

export default function PostCard({ post }) {
  return (
    <View style={{ margin: 10, padding: 10, borderWidth: 1, borderRadius: 8 }}>
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>{post.title}</Text>
      <Text>{post.body}</Text>
      {post.image_url && <Image source={{ uri: `${API_URL}${post.image_url}` }} style={{ width: "100%", height: 200, marginTop: 8, borderRadius: 10 }} />}
      <Text>👤 {post.author}</Text>
    </View>
  );
}
