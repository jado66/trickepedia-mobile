import "../global.css";
import "react-native-reanimated";

import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AppProviders } from "@/src/providers/AppProviders";
import { useAuthStore } from "@/src/store/auth-store";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootStack() {
  const { session, initializing, init } = useAuthStore();

  useEffect(() => {
    void init();
  }, [init]);

  if (initializing) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-950">
        <ActivityIndicator color="#f97316" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootStack />
      <StatusBar style="light" />
    </AppProviders>
  );
}
