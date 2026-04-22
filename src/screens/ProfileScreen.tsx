import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../store/auth-store";

export function ProfileScreen() {
  const { user, signOut } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-neutral-950" edges={["top"]}>
      <View className="flex-1 px-6 py-4">
        <Text className="text-3xl font-bold text-white">Profile</Text>

        <View className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <Text className="text-xs uppercase tracking-wider text-neutral-500">
            Signed in as
          </Text>
          <Text className="mt-1 text-white">{user?.email ?? "—"}</Text>
          {user?.id && (
            <Text className="mt-2 text-xs text-neutral-500">id: {user.id}</Text>
          )}
        </View>

        <Pressable
          onPress={signOut}
          className="mt-6 items-center rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 active:opacity-80"
        >
          <Text className="font-semibold text-white">Sign out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
