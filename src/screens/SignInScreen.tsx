import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

type Mode = "signIn" | "signUp";

export function SignInScreen() {
  const [mode, setMode] = useState<Mode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const { error } =
        mode === "signIn"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });
      if (error) Alert.alert("Auth error", error.message);
      else if (mode === "signUp") {
        Alert.alert(
          "Check your email",
          "We sent you a confirmation link to finish signing up.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-neutral-950"
    >
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-sm">
          <Text className="mb-2 text-3xl font-bold text-white">Trickepedia</Text>
          <Text className="mb-8 text-neutral-400">
            {mode === "signIn" ? "Welcome back." : "Create your account."}
          </Text>

          <TextInput
            className="mb-3 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white"
            placeholder="Email"
            placeholderTextColor="#737373"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            className="mb-4 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white"
            placeholder="Password"
            placeholderTextColor="#737373"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Pressable
            onPress={submit}
            disabled={loading}
            className="mb-3 items-center rounded-xl bg-brand px-4 py-3 active:opacity-80 disabled:opacity-60"
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="font-semibold text-white">
                {mode === "signIn" ? "Sign in" : "Create account"}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
            className="items-center py-2"
          >
            <Text className="text-neutral-400">
              {mode === "signIn"
                ? "New here? Create an account"
                : "Already have an account? Sign in"}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
