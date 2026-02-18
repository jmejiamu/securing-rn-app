import DrawerNav from "@/components/DrawerNav/DrawerNav";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
        <DrawerNav />
      </View>

      <View style={{ paddingHorizontal: 16, gap: 10 }}>
        <Text style={{ fontSize: 26, fontWeight: "900" }}>
          Mobile App Security Demos
        </Text>

        <Text style={{ fontSize: 14, color: "#555", lineHeight: 20 }}>
          This React Native app is a companion for my video series on securing{" "}
          <Text style={{ fontWeight: "800", color: "#111" }}>
            React Native + Node/Express
          </Text>
          .
        </Text>

        <Text style={{ fontSize: 14, color: "#555", lineHeight: 20 }}>
          Open the drawer menu to explore different demos (each screen matches a
          video episode). Every demo has a vulnerable version and a fixed
          version.
        </Text>

        <View
          style={{
            marginTop: 10,
            borderWidth: 1,
            borderColor: "#EEE",
            backgroundColor: "#FAFAFA",
            borderRadius: 14,
            padding: 12,
            gap: 6,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "900" }}>Important</Text>

          <Text style={{ fontSize: 13, color: "#555", lineHeight: 18 }}>
            Make sure you are running the server that corresponds to the demo
            you selected in the drawer. If the wrong server is running, the demo
            will fail or behave differently.
          </Text>

          <Text style={{ fontSize: 13, color: "#555", lineHeight: 18 }}>
            Example: if you open the “JWT Demo” screen, run the JWT demo server.
          </Text>
        </View>

        <Text style={{ marginTop: 6, fontSize: 12, color: "#777" }}>
          Tip: Keep the demos local and use them only for learning.
        </Text>
      </View>
    </SafeAreaView>
  );
}
