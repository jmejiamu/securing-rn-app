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
    </Drawer>
  );
}
