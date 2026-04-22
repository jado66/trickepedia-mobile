# Trickepedia Mobile

React Native (Expo SDK 54, TypeScript) companion app for
[Trickepedia](https://trickipedia.app). Shares the same Supabase backend as
the web app.

## Stack

- **Expo** (SDK 54) with the new architecture + React Compiler enabled
- **Expo Router** (file-based routing with typed routes)
- **TypeScript** (strict)
- **Supabase JS** with `AsyncStorage`-backed session persistence
- **TanStack Query** for server state
- **Zustand** for client state (auth)
- **NativeWind v4** (Tailwind CSS for React Native)

## Project layout

```
app/                            # Expo Router file-based routes
  _layout.tsx                   # Root Stack, wraps auth gate + providers
  sign-in.tsx                   # Signed-out route
  (tabs)/
    _layout.tsx                 # Bottom tab navigator
    index.tsx                   # Home
    tricks.tsx                  # Example TanStack Query + Supabase fetch
    profile.tsx                 # Account + sign out

src/                            # Non-route code
  lib/
    supabase.ts                 # Supabase client (AsyncStorage session)
    query-client.ts             # TanStack Query client
  providers/
    AppProviders.tsx            # Query + SafeArea + GestureHandler
  store/
    auth-store.ts               # Zustand auth store

components/                     # Re-usable UI (themed text/view, icons)
constants/                      # Colors + theme
hooks/                          # useColorScheme, etc.

tailwind.config.js              # NativeWind preset + brand color
global.css                      # Tailwind directives (imported in _layout)
babel.config.js                 # babel-preset-expo + nativewind + worklets
metro.config.js                 # withNativeWind wrapper
eas.json                        # EAS Build profiles
```

Auth gating is done with expo-router's `Stack.Protected`:

```12:37:app/_layout.tsx
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
```

## Getting started

```bash
npm install
cp .env.local .env                 # or set EXPO_PUBLIC_* vars directly in .env.local
npm run ios                         # iOS simulator (requires Xcode)
npm run android                     # Android emulator (requires Android Studio)
npm run start                       # Metro + Expo Go on a physical device
```

Required env vars (either `.env` or `.env.local`, both are gitignored):

```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_SITE_URL=...            # optional, for deep-link share fallbacks
EXPO_TOKEN=...                      # optional, for eas/expo CLI auth (local-only)
```

## Scripts

- `npm run start` — Metro + Expo Dev Server
- `npm run ios` / `npm run android` / `npm run web`
- `npm run lint` — `expo lint`
- `npm run typecheck` — `tsc --noEmit`
- `npm run reset-project` — starter-template reset helper

## Deploying

Use [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
eas build:configure           # one-time, creates eas.json
eas build --platform ios
eas build --platform android
```

For CLI auth, prefer a Personal Access Token exported as `EXPO_TOKEN` instead
of `eas login` (more reliable, and bypasses special characters in passwords).

## Notes

- `EXPO_PUBLIC_*` env vars are inlined into the JS bundle at build time. Never
  put service-role keys or other secrets there.
- The `tricks` query in `app/(tabs)/tricks.tsx` is a placeholder — adjust the
  columns to match your schema.
- Native iOS/Android folders are intentionally gitignored; use EAS Build for
  store-ready binaries.
- The `legacy-nav` branch preserves the original React Navigation scaffold.
