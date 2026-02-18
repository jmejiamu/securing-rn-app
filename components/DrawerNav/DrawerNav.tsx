import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

const DrawerNav = () => {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={{ alignSelf: "flex-start", borderRadius: 8 }}
    >
      <MaterialIcons name="menu" size={24} />
    </Pressable>
  );
};

export default DrawerNav;

const styles = StyleSheet.create({});
