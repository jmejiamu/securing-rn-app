import { apiFetch, tokenStorage } from "@/utils/apiFetch";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const AccessRefreshToken = () => {
  const [email, setEmail] = useState("user@test.com");
  const [password, setPassword] = useState("1234");
  const [output, setOutput] = useState<string>("");

  const login = async (email: string, password: string) => {
    const response = await apiFetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (response?.ok) {
      const data = await response.json();
      await tokenStorage.set({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    } else {
      throw new Error("Login failed");
    }
  };

  const getMe = async () => {
    const accessToken = await tokenStorage.getAccess();
    const response = await apiFetch("/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response?.ok) {
      return await response.json();
    }
    throw new Error("Failed to fetch /me");
  };

  const logout = async () => {
    const refreshToken = await tokenStorage.getRefresh();
    try {
      if (refreshToken)
        await apiFetch("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
          headers: { "Content-Type": "application/json" },
        });
    } finally {
      await tokenStorage.clear();
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Access vs Refresh</Text>
        <Text style={styles.subtitle}>Token demo</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholder="email"
            placeholderTextColor="#8A8F98"
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="password"
            placeholderTextColor="#8A8F98"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <View style={styles.actions}>
          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={async () => {
              try {
                await login(email, password);
                setOutput("Logged in ✅");
              } catch {
                setOutput("Login failed");
              }
            }}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              Login
            </Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.secondaryButton]}
            onPress={async () => {
              try {
                const me = await getMe();
                setOutput(JSON.stringify(me, null, 2));
              } catch {
                setOutput(
                  "Request failed (maybe token expired + refresh failed?)",
                );
              }
            }}
          >
            <Text style={styles.buttonText}>Call /me (Protected)</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.logoutButton]}
            onPress={async () => {
              await logout();
              setOutput("Logged out ✅ (tokens cleared)");
            }}
          >
            <Text style={[styles.buttonText, styles.logoutButtonText]}>
              Logout
            </Text>
          </Pressable>
        </View>

        <View style={styles.outputContainer}>
          <Text style={styles.outputLabel}>Output</Text>
          <Text style={styles.outputText}>{output || "No output yet"}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 24,
    backgroundColor: "#F3F5F7",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E7E9EE",
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: -8,
    fontSize: 13,
    color: "#6B7280",
  },
  form: {
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D6DAE1",
    backgroundColor: "#FAFBFC",
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 12,
    fontSize: 15,
    color: "#111827",
  },
  actions: {
    gap: 10,
    marginTop: 4,
  },
  button: {
    minHeight: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  secondaryButton: {
    backgroundColor: "#EEF2FF",
    borderColor: "#C7D2FE",
  },
  logoutButton: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  primaryButtonText: {
    color: "#FFFFFF",
  },
  logoutButtonText: {
    color: "#991B1B",
  },
  outputContainer: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    padding: 12,
    gap: 6,
    minHeight: 92,
  },
  outputLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: "#6B7280",
  },
  outputText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#111827",
  },
});

export default AccessRefreshToken;
