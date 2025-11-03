import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, AuthContext } from "./src/AuthContext";
import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import CreatePost from "./src/screens/CreatePost";
import AppTabs from "./src/navigation/AppTabs"; // ✅ нижнее меню

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {user ? (
        // ✅ Если вошёл — показываем основное приложение с табами
        <>
          <Stack.Screen
            name="AppTabs"
            component={AppTabs}
            options={{ headerShown: true, title: "Главная" }}
          />
          <Stack.Screen
            name="CreatePost"
            component={CreatePost}
            options={{ title: "Создать пост" }}
          />
        </>
      ) : (
        // 🚪 Если не вошёл — показываем экраны входа и регистрации
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
