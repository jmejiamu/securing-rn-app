import DrawerNav from "@/components/DrawerNav/DrawerNav";
import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_BASE_URL = "http://localhost:4000";

export default function App() {
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("1234");

  async function register() {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      Alert.alert("Register", JSON.stringify(data));
    } catch {
      Alert.alert("Error", "Network error");
    }
  }

  async function login() {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      Alert.alert("Login", JSON.stringify(data));
    } catch {
      Alert.alert("Error", "Network error");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
        <DrawerNav />
      </View>
      <View style={{ padding: 20, gap: 10, marginTop: 40 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>
          Password Hashing Demo
        </Text>

        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 8,
          }}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 8,
          }}
        />

        <Button title="Register" onPress={register} />
        <Button title="Login" onPress={login} />
      </View>
    </SafeAreaView>
  );
}
