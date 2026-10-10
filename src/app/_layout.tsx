import { Tabs } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { resetGamesHub } from "../constants/gameNav";
import UpdateSplash from "../components/UpdateSplash";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

const TAB_ICONS: Record<string, string> = {
  home: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAABeklEQVR4nO3ZQY7CQAwFUYLm/lcOK2+QZsIQu8tO6l0A9y+xgcdDkiRJkiRJkiRJ+su+7zt9wxlP+oAzYvzJEcYGeB99aoSRAX4be2KEcQGORp4WYVSAT8edFGFMgP+OOiXCiADfjjkhQvsAZ0fsHqF1gKzxOkdoGyB7tK4RWgaoGqtjhHYBqkfqFqFVgFXjdIrQJsDqUbpEaBGAGqNDBDwAPQL9+WgA+vGBvAML0GX8QN2DBOg2fiDuWh6g6/hh9X1LA3QfP6y8c1mAKeOHVfcuCTBt/LDi7vIAU8cP1feXBpg+fqh8R1mAq4wfqt5TEuBq44eKd6UHuOr4Ift9qQGuPn7IfGdagLuMH7LemxLgbuOHjHdvGYccmRxo27bSjfA/ZO7OADADwAwAMwDMADADwAwAMwDMADADwH7oAz71zW8yE36D8hsAMwDMADADwAwAMwDMADADwAwAMwDMADADwAwAMwDMADADwAwAM4AkSZIkSZIkSVKxF/LzA5H7aUZDAAAAAElFTkSuQmCC",
  practice: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAABQklEQVR4nO3a3U6DQBRG0Rnj+78yXtSJ2GitCnzzs9ZtkwZmc4BSSgEAAAAAAAAAAABgFjW9Ab+1bdv26PNa61D79JLegNVNF+CnCenNdAFqrXV7l96WZ7ymN+AM7TrQIvR8XZhuAvb2IXqdiqkDlHKLsJ+A3kJMH6DpNUS358bvHPU74KvvSVwrlpmAZySmQoAwAcIECBMgTIAwAcIECBMgbNkA948mUpYN0KRDLB+gSYUQ4M7VEQQIEyBMgDABwgQIEyBMgDABwgQIEyCsq3dDH70S0sOTyzN0sVNHvoszWqjoBPTwamBa7Bpg8W8iASz+B3dBYZcHcPR/1tVt6F+Nduez5xQUJkCYAGGXBzj6fD3y+b8UExAXCXDUUTv60V9KcAL+u3gzLH4pAz4NnWXhm652ZsX/AwAAAAAAAABO9AYGdWB6eXPtZgAAAABJRU5ErkJggg==",
  games: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAABSElEQVR4nO3awW7DIAwAUDLt/3+ZnXqpkrTKbAfIe8dWLbGNwZ3WGgAAAAAAAAAAAAAAAACz2u5YtPfe71j3G9u2leakbLGRk36kohg/2Qu0NmfyW6t57tQKz5r4PVndkNYBKyW/tbx4UgqwWvJfMuIquQM4Fl6AVXf/S3R8oQVYPfkvkXH+Rn3RFWeTxVOKeWsBKr0Xe5QChx1BowS0Z6/T/jvXR8W7/BR0lujqv/vsKTmCrgR69JmRO+2K5TtgdApws+WnoN57/+Y4u2tKekQH7CXzLPlHr2UIXeRo10QGE70zPz1bdkyP6ICRldwBV3bRauPmkdAOGOGHTYXIOMOPoNmKcNZpe+9Fx+cOaJ+npExpu3XFMzyju9M6YLaj6JOseEqSNHM3ZG+kkjtg1m6oeG7/G/pm1s0CAAAAAAAAAAAAAMCj/QFaSowq5XMy+wAAAABJRU5ErkJggg==",
  explore: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAACNElEQVR4nO3c226EMAyE4dD3f2d600goYkuA2DNe/d9tVzh4NmYPbFsDAAAAAAAAAAAAAHyrTb2AO/Z932cfu21biXOzXuSdhl9xDcRyUSsbP3ILwmoxkY0fuQRhsYjMxo/UQfwoi7embb5DfWkA6pPvpDtQUfTNCc+MjOjjr5QewJPmvGlKdr3btbIKtaZ/I6Wuf0Z+ET5z5+Qdm3pHWgAzjdr+RK5jtkbWhTklgNnmPz1u1JzPCCE8gKjmr+AQgvwaoJ7L6vqhAVw9e9Qn312tI3IXyHfAU2NTXN5V3xUWQJVnf6faBZId4Nb8TrGukACqjoMrEedV8hrwqREVg08PwHX8dNnrK7kDvsnyAKLHwNXx1fXvSt0B7uOny1wnI0iMAMRKBTA7fyu9HC0VwDciALHSAWwH49+qjKEyAYwNHZte5SXuqEQAvfnHJv/3fUB/XIVdkH7vzdtnasZ3zJnfZSzfAVVHwazV51diBB1dNaDaEyA9APe5nL2+cjvg24QEkHF7oVPdNyQ7wHUMKdYVFoDyZqcnVLfRcA0QCw0gches/ChCeROZfAeoR5G6fngADreAv6kb/coqZQdEhdCP++bHHTPHj5Q2gmZDyLitxKX5rRlcA85E/fBOPe/P8DvhxfVu18oqdMQv5Q/1MouNnEaC6mNs6TXA5bN75TrkF2F1CPL6yuKjzJGkbnxnsYhRZBAuje+sFjNaGYRb4zvLRX1S/T+jAAAAAAAAAAAAAECyXwsmOHZI+swNAAAAAElFTkSuQmCC",
}

function TabIcon({
  focused,
  color,
  icon,
}: {
  focused: boolean;
  color: string;
  icon: string;
}) {
  return (
    <View style={[styles.iconPill, focused && styles.iconPillActive]}>
      <Image
        source={{ uri: TAB_ICONS[icon] }}
        style={{ width: 30, height: 30, tintColor: color }}
        resizeMode="contain"
      />
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
            <TabIcon focused={focused} color={String(color)} icon="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: "Practice",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={String(color)} icon="practice" />
          ),
        }}
      />
      <Tabs.Screen
        name="games"
        listeners={{ tabPress: () => resetGamesHub() }}
        options={{
          title: "Games",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={String(color)} icon="games" />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused, color }) => (
            <TabIcon focused={focused} color={String(color)} icon="explore" />
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
    paddingHorizontal: 13,
    paddingVertical: 6,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  iconPillActive: {
    backgroundColor: "rgba(167, 139, 250, 0.22)",
  },
});

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  return (
    <ThemeProvider>
      {appReady ? <TabLayout /> : <UpdateSplash onReady={() => setAppReady(true)} />}
    </ThemeProvider>
  );
}
