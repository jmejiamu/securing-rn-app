import { Drawer } from "expo-router/drawer";

export default function RootLayout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="index" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Home",
          title: "Home",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="jwt" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "JWT Demo",
          title: "JWT Demo",
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="access-refresh-token" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Access Refresh Token",
          title: "Access Refresh Token",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="rate-limit" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Rate Limit Demo",
          title: "Rate Limit Demo",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="password-hashing" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Password Hashing Demo",
          title: "Password Hashing Demo",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="validation" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Validation Demo",
          title: "Validation Demo",
          headerShown: false,
        }}
      />
    </Drawer>
  );
}
