import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "@/src/store/auth-store";

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);

  return (
    <SafeAreaView className="flex-1 bg-neutral-950" edges={["top"]}>
      <ScrollView contentContainerClassName="p-6">
        <Text className="text-sm uppercase tracking-wider text-neutral-500">
          Welcome
        </Text>
        <Text className="mt-1 text-3xl font-bold text-white">
          {user?.email ?? "Trickepedia"}
        </Text>

        <View className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <Text className="text-lg font-semibold text-white">Today</Text>
          <Text className="mt-2 text-neutral-400">
            Your daily trick feed will show up here. Wire this screen to your
            Supabase tables to get started.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
