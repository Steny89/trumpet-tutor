import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { resetGamesHub } from "../constants/gameNav";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

function TabIcon({
  focused,
  color,
  filled,
  outline,
}: {
  focused: boolean;
  color: string;
  filled: keyof typeof Ionicons.glyphMap;
  outline: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View
      style={[styles.iconPill, focused && styles.iconPillActive]}
    >
      <Ionicons name={focused ? filled : outline} size={33} color={String(color)} />
    </View>
  );
}

function TabLayout() {
  const { isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkMode ? "rgba(30, 24, 50, 0.88)" : "#FFFFFF",
          borderTopColor: isDarkMode ? "rgba(167,139,250,0.25)" : "#E2E8F0",
          position: "absolute",
          bottom: insets.bottom > 0 ? insets.bottom : 10,
          left: 16,
          right: 16,
          elevation: 10,
          borderRadius: 20,
          height: 78,
          paddingHorizontal: 8,
          paddingBottom: 6,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          height: 78,
        },
        tabBarActiveTintColor: "#A78BFA",
        tabBarInactiveTintColor: isDarkMode ? "#A79BD0" : "#64748B",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
          textAlign: "center",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={String(color)} filled="home" outline="home-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: "Practice",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={String(color)}
              filled="musical-notes"
              outline="musical-notes-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="games"
        listeners={{ tabPress: () => resetGamesHub() }}
        options={{
          title: "Games",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={String(color)}
              filled="game-controller"
              outline="game-controller-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              focused={focused}
              color={String(color)}
              filled="compass"
              outline="compass-outline"
            />
          ),
        }}
      />
      {/* Hide all sub-routes from the bottom tab bar */}
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="guide" options={{ href: null }} />
      <Tabs.Screen name="lessons" options={{ href: null }} />
      <Tabs.Screen name="videos" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="goals" options={{ href: null }} />
      <Tabs.Screen name="navigation" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconPill: {
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: "transparent",
  },
  iconPillActive: {
    backgroundColor: "rgba(167, 139, 250, 0.22)",
  },
});

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TabLayout />
    </ThemeProvider>
  );
}
