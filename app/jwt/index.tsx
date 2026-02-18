import DrawerNav from "@/components/DrawerNav/DrawerNav";
import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
type Screen = "login" | "admin";
const API_IOS = "http://localhost:3000";
const API_ANDROID = "http://10.0.2.2:3000";
export default function Index() {
  const [platform, setPlatform] = useState<"ios" | "android">("ios");
  const API_BASE = useMemo(
    () => (platform === "ios" ? API_IOS : API_ANDROID),
    [platform],
  );

  const [screen, setScreen] = useState<Screen>("login");
  const [token, setToken] = useState<string>("");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
        <DrawerNav />
      </View>
      <ScrollView contentContainerStyle={{ marginHorizontal: 16, gap: 14 }}>
        <Text style={{ fontSize: 22, fontWeight: "800" }}>
          JWT Demo (2 Screens)
        </Text>

        <View style={{ gap: 8, padding: 12, borderWidth: 1, borderRadius: 12 }}>
          <Text style={{ fontWeight: "700" }}>API Base</Text>
          <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
            <Chip
              label={
                Platform.OS === "ios" ? "iOS (localhost)" : "Android (10.0.2.2)"
              }
              active={
                Platform.OS === "ios"
                  ? platform === "ios"
                  : platform === "android"
              }
              onPress={() =>
                setPlatform(Platform.OS === "ios" ? "android" : "ios")
              }
            />
          </View>
          <Text style={{ color: "#555" }}>{API_BASE}</Text>
        </View>

        {screen === "login" ? (
          <LoginScreen
            apiBase={API_BASE}
            onLoggedIn={(newToken) => {
              setToken(newToken);
              setScreen("admin");
            }}
          />
        ) : (
          <AdminScreen
            apiBase={API_BASE}
            token={token}
            setToken={setToken}
            onLogout={() => {
              setToken("");
              setScreen("login");
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function LoginScreen({
  apiBase,
  onLoggedIn,
}: {
  apiBase: string;
  onLoggedIn: (token: string) => void;
}) {
  const [email, setEmail] = useState("user@test.com");
  const [password, setPassword] = useState("1234");
  const [status, setStatus] = useState("");

  async function login() {
    try {
      setStatus("Logging in...");
      const res = await fetch(`${apiBase}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus(`Login failed: ${data?.error ?? res.status}`);
        return;
      }

      if (!data?.token) {
        setStatus("No token returned.");
        return;
      }

      setStatus("Logged in ✅");
      onLoggedIn(data.token);
    } catch (e: any) {
      setStatus(`Error: ${e?.message ?? String(e)}`);
    }
  }

  return (
    <View style={{ gap: 10, padding: 12, borderWidth: 1, borderRadius: 12 }}>
      <Text style={{ fontWeight: "800", fontSize: 18 }}>1) Login</Text>

      <Label label="Email" />
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={inputStyle}
      />

      <Label label="Password" />
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={inputStyle}
      />

      <Pressable onPress={login} style={buttonStyle}>
        <Text style={{ fontWeight: "800" }}>Login & Get Token</Text>
      </Pressable>

      {!!status && <Text style={{ color: "#555" }}>{status}</Text>}
    </View>
  );
}

function AdminScreen({
  apiBase,
  token,
  setToken,
  onLogout,
}: {
  apiBase: string;
  token: string;
  setToken: (t: string) => void;
  onLogout: () => void;
}) {
  const [result, setResult] = useState("");

  async function callAdmin() {
    try {
      setResult("Calling /admin ...");
      const res = await fetch(`${apiBase}/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await res.text();
      setResult(`Status: ${res.status}\n\n${text}`);
    } catch (e: any) {
      setResult(`Error: ${e?.message ?? String(e)}`);
    }
  }

  return (
    <View style={{ gap: 10, padding: 12, borderWidth: 1, borderRadius: 12 }}>
      <Text style={{ fontWeight: "800", fontSize: 18 }}>
        2) Protected Route
      </Text>

      <Text style={{ color: "#555" }}>
        Paste a forged token here during the demo (bad server), then press “Call
        /admin”.
      </Text>

      <Label label="JWT Token (editable)" />
      <TextInput
        value={token}
        onChangeText={setToken}
        multiline
        autoCapitalize="none"
        style={[inputStyle, { minHeight: 120, textAlignVertical: "top" }]}
      />

      <Pressable onPress={callAdmin} style={buttonStyle}>
        <Text style={{ fontWeight: "800" }}>Call /admin</Text>
      </Pressable>

      <Pressable onPress={onLogout} style={[buttonStyle, { opacity: 0.7 }]}>
        <Text style={{ fontWeight: "800" }}>Logout</Text>
      </Pressable>

      {!!result && (
        <View style={{ gap: 6 }}>
          <Text style={{ fontWeight: "700" }}>Result</Text>
          <Text style={{ fontFamily: "Menlo" }}>{result}</Text>
        </View>
      )}
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 999,
        borderWidth: 1,
        opacity: active ? 1 : 0.5,
      }}
    >
      <Text style={{ fontWeight: active ? "800" : "600" }}>{label}</Text>
    </Pressable>
  );
}

function Label({ label }: { label: string }) {
  return <Text style={{ fontWeight: "700" }}>{label}</Text>;
}

const inputStyle = {
  borderWidth: 1,
  borderRadius: 10,
  padding: 10,
} as const;

const buttonStyle = {
  borderWidth: 1,
  borderRadius: 12,
  padding: 14,
  alignItems: "center",
} as const;
