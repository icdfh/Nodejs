import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Posts from "../screens/Posts";
import Profile from "../screens/Profile";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // ❗ верхний хедер будет из Stack
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Posts") iconName = "newspaper-outline";
          else if (route.name === "Profile") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Posts"
        component={Posts}
        options={{ title: "Посты" }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ title: "Профиль" }}
      />
    </Tab.Navigator>
  );
}
