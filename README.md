# Trickepedia Mobile

React Native (Expo SDK 54, TypeScript) companion app for
[Trickepedia](../trickepedia). Shares the same Supabase backend as the web app.

## Stack

- **Expo** (SDK 54) with the new architecture enabled
- **TypeScript** (strict)
- **React Navigation** (native stack + bottom tabs)
- **Supabase JS** with `AsyncStorage`-backed session persistence
- **TanStack Query** for server state
- **Zustand** for client state (auth)
- **NativeWind v4** (Tailwind CSS for React Native)

## Project layout

```
App.tsx                 # Root component, wires providers + navigator
index.ts                # Expo entry (registers root component)
app.json                # Expo config
babel.config.js         # babel-preset-expo + nativewind
metro.config.js         # withNativeWind wrapper
tailwind.config.js      # NativeWind preset + theme
global.css              # Tailwind directives (imported by App.tsx)
src/
  lib/
    supabase.ts         # Supabase client (AsyncStorage session)
    query-client.ts     # TanStack Query client
  providers/
    AppProviders.tsx    # Query + SafeArea + GestureHandler providers
  store/
    auth-store.ts       # Zustand auth store (init, session, signOut)
  navigation/
    RootNavigator.tsx   # Auth-gated stack (SignIn vs AppTabs)
    AppTabs.tsx         # Bottom tab navigator
  screens/
    SignInScreen.tsx
    HomeScreen.tsx
    TricksScreen.tsx    # Example TanStack Query + Supabase fetch
    ProfileScreen.tsx
```

## Getting started

1. Install deps:

   ```bash
   npm install
   ```

2. Copy env and fill in values (use the same Supabase project as the web app):

   ```bash
   cp .env.example .env
   ```

3. Run the app:

   ```bash
   npm run ios      # iOS simulator (requires Xcode)
   npm run android  # Android emulator (requires Android Studio)
   npm run start    # Metro + Expo Go on a physical device
   ```

## Notes

- `EXPO_PUBLIC_*` env vars are inlined into the JS bundle at build time. Never
  put service-role keys or other secrets there.
- The `tricks` query in `src/screens/TricksScreen.tsx` is a placeholder —
  adjust the columns to match your schema.
- Native iOS/Android folders are intentionally gitignored. Use
  `npx expo prebuild` locally if you need to eject, or rely on EAS Build.

## Deploying

Use [EAS Build](https://docs.expo.dev/build/introduction/) for App Store /
Play Store builds:

```bash
npm i -g eas-cli
eas login
eas build:configure
eas build --platform ios
eas build --platform android
```
