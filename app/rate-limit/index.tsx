import DrawerNav from "@/components/DrawerNav/DrawerNav";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_BASE_URL = "http://localhost:4000";

type LoginResponse = { message: string } | { error: string };

export default function App() {
  const [email, setEmail] = useState("user@test.com");
  const [password, setPassword] = useState("1234");
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    setIsLoading(true);
    setStatus("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();

      if (response.status === 200) {
        setStatus("Login successful");
        Alert.alert("Success", "Login successful");
        return;
      }

      if (response.status === 401) {
        setStatus("Invalid credentials");
        Alert.alert("Login failed", "Invalid credentials");
        return;
      }

      if (response.status === 429) {
        setStatus("error" in data ? data.error : "Too many attempts");
        Alert.alert("Too many attempts", "Please wait before trying again.");

        return;
      }

      setStatus("Unexpected error");
      Alert.alert("Error", "Unexpected response from server");
    } catch (error) {
      setStatus("Network error");
      Alert.alert("Error", "Network request failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <DrawerNav />
          </View>

          <Text style={styles.title}>Rate Limit Demo</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              placeholder="Email"
              style={styles.input}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              style={styles.input}
            />

            <View style={styles.buttonRow}>
              <View style={styles.buttonWrapper}>
                <Button
                  title={isLoading ? "Logging in..." : "Login"}
                  onPress={handleLogin}
                  disabled={isLoading}
                />
              </View>

              {isLoading ? (
                <ActivityIndicator style={styles.spinner} size="small" />
              ) : null}
            </View>

            {status ? <Text style={styles.status}>{status}</Text> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  flex: { flex: 1 },
  container: { padding: 20, gap: 12 },
  header: { marginBottom: 8 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  card: {
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  label: { fontSize: 12, color: "#333", marginBottom: 6, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  buttonRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  buttonWrapper: { flex: 1 },
  spinner: { marginLeft: 12 },
  status: { marginTop: 10, color: "#444" },
  containerCenter: { flex: 1, justifyContent: "center", alignItems: "center" },
});
