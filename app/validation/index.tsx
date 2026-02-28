import DrawerNav from "@/components/DrawerNav/DrawerNav";
import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

const API_BASE_URL = "http://localhost:4000";

const AuthSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export default function ValidationScreen() {
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("1234");

  async function register() {
    // const result = AuthSchema.safeParse({ email, password });

    // if (!result.success) {
    //   const messages = result.error?.issues.map((i) => i.message).join(", ");
    //   Alert.alert("Validation Error", messages || "Unknown error");
    //   return;
    // }
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.status === 400) {
        Alert.alert("Register", JSON.stringify(data.error));
      } else if (res.status === 201) {
        Alert.alert("Register", JSON.stringify(data.message));
      }
    } catch {
      Alert.alert("Error", "Network error");
    }
  }

  async function login() {
    const result = AuthSchema.safeParse({ email, password });

    if (!result.success) {
      const messages = result.error?.issues.map((i) => i.message).join(", ");
      Alert.alert("Validation Error", messages || "Unknown error");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.status === 400) {
        Alert.alert("Login", JSON.stringify(data.error));
      } else if (res.status === 201) {
        Alert.alert("Login", JSON.stringify(data.message));
      }
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
          Validation Demo
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
