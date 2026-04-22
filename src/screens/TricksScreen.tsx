import React from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

type TrickRow = {
  id: string;
  name: string;
  slug?: string | null;
  difficulty_level?: number | null;
};

async function fetchTricks(): Promise<TrickRow[]> {
  // Adjust the table/columns to match your Trickepedia schema.
  const { data, error } = await supabase
    .from("tricks")
    .select("id, name, slug, difficulty_level")
    .order("name", { ascending: true })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

export function TricksScreen() {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["tricks"],
    queryFn: fetchTricks,
  });

  return (
    <SafeAreaView className="flex-1 bg-neutral-950" edges={["top"]}>
      <View className="px-6 pb-4 pt-2">
        <Text className="text-3xl font-bold text-white">Tricks</Text>
        <Text className="mt-1 text-neutral-400">Pulled live from Supabase.</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#f97316" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-red-400">
            {(error as Error).message}
          </Text>
        </View>
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-6 pb-10"
          onRefresh={refetch}
          refreshing={isRefetching}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <View className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
              <Text className="text-base font-semibold text-white">
                {item.name}
              </Text>
              {item.difficulty_level != null && (
                <Text className="mt-1 text-xs text-neutral-400">
                  Difficulty {item.difficulty_level}
                </Text>
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text className="mt-10 text-center text-neutral-500">
              No tricks found.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
