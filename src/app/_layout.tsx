import { Tabs } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { resetGamesHub } from "../constants/gameNav";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

const TAB_ICONS: Record<string, string> = {
  home: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAABnklEQVR4nO3ZQXKDMBAFUUjl/lcmq1k4RWIjRuqR6HeBSL9NlXG2TZIkSZIkSZIkvXMcx0Gf4Y4v+gB3xPgzR5g2wO/RZ40wZYC/xp4xwnQB3o08W4SdPsCnWobd9738/aZ4Alo/1TM8DeUD3B2xeoTSAbLGqxyhbIDs0apGKBmg11gVI5QL0HukahFKBRg1TqUIJb4nk4PQ7wr4E0B/Gum/jwagLx/Ic2ABqowfqPMgAaqNH4hzDQ9Qdfww+nxDA1QfP4w857AAs4wfRp23+3fg2YY/0/NdoesTsML429b3Ht0CrDJ+6HWfLgFWGz/0uFd6gFXHD9n3Sw2w+vgh855pAZ4yfsi6b0qAp40fMu596/vtU4c/0/qu0PwEOP6r1j2aAjj+uZZdLgdw/P9d3edSAMf/zJWduvzItHKo7B/m8H/KP50BYAaAGQBmAJgBYAaAGQBmAJgBYN/0AT5x5/W/+s8iPgEwA8AMADMAzAAwA8AMADMAzAAwA8AMADMAzAAwA8AMADMAzAAwA8AMADMAzACSJEmSJEmSpAF+AEh3A6XBLB2uAAAAAElFTkSuQmCC",
  practice: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAABaElEQVR4nO3c0W6DIACGUVz2/q/sbmpClq7VTvgFz7lcmkz5BNZ0tBQAAAAAAAAAgBkt6Qt4ZV3X9d1rlmW59D2885W+gLsbPsD6kL6OT32nL+C/6iVoCzHSsjR8gNqIMaYKUNsGvl6erhhj2gCbq8+K6QPUrhjjVgFqV1mibhtg82xW/P55S7cP8JdeMQTYoWWM4d8Jj06AMAHCBAgTIEyAMAHCBAgTIEyAyvLQ83cK8ETPEAK80COEADu0DCHAAS0iCBAmQJgAYQKECRAmQJgAYQKECRAmQJgAYQKECRAmQJgAYQKEdf/39FdnetPHhRK6BNh7kDp9XCih6U32OME+eqhme8DIXx/QU5MABn+/0wMY/GP8GRp26gZm0z3ODAgTIEyAMAHCTg3QeoOcbQMuxQyIOz1Aq6d0xqe/lEYz4OzBmnXwS2m4BJ01aDMPfimdvrr4k3fIsw/8pvtN+kQMAAAAAIj4AeU4WNTYndacAAAAAElFTkSuQmCC",
  games: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAABc0lEQVR4nO3b0W7CMAwF0Hba//9y97BFQhWjJXEaUp/ziESLfZs4ILEsAAAAAAAAAAAAAAAANFmvvNm2bduV92uxruslvbnkJjM1fq93EF0vPnPj93oF0eWid2r8XnQQX5EXW5Z7N39Z4usLDeDuzS8i6wwLIEvzi6h6QwLI1vwiou7wGcB7mgPI+vQXrfVbAYM1nWlr0z86S8+4qmq/H3xHf5AZPDZrdNjVW9DoD15j/XP0Wo3afpgBg6UJ4Ogpv+rn572uM6C2qGfvm3HLOyPNCvhUaQI4WkGjVljKY+gZVx1VUwVQGvmquc/mT3mtRxCpAig+aaCnmQFnjDiqdl0B/z1pd/wtqFb1Chj1xeVT1fbDFvRgxFG1KQCr4FdLH1Kegl45c1SNFPIEZxqae627gBkwWEgAWWdBRN1hKyBbCFH1hm5BWUKIrDN8Btw9hOj6/D/gpKn+H7A3cxBT/0Nmb6Yg7r6VAgAAAAAAAAAAQB8/PZyUWHQiOKIAAAAASUVORK5CYII=",
  explore: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAACi0lEQVR4nO2c247DIAxEYbX//8vsyyJVKGm42J5xO+e5xYMHQ4IgpQghhBBCCCGEEEIIIYQQ7lS0gBVaa232t7XWFH2jFrmS8CdYDaETZZn0O5jMoBESkfgRBiPgAhCJH0EaAQvMkPgRhBE/0QFL4Ux+KRhd4QawJr8TrS+s5Cw6tjJFRMfbjuEdoJSzZFgkAR3/bfuejZey13nPTrPpcTVgtbM7HW2ttd3/rfzeywTIU9AV0Y+ADC9hpTgaELFx1mPszvHRi/oVLgbMiq3/eGiYZUWDhwnmBqwk3zr2CSgTIGsAW/I76bciIt8ix1jI2CeEVwDr6O9E6zMzYGZUsCe/M6PTqgrCKiBL8jtRek0MiN5BvIvHomOFkArINvo7EbpptiK+lWMD2MqeTc8T7hWQdfrpeOvXFARGBoA5MuBp/rMu39n51nodeOrHSTxVABgZACaNAatlzn7+qJPGgE8lhQG7o7n9Y63HkhQGnMD+IvjxBrAjA8DIADAyAMyRAZ6v6FZtRGg4WeipK6B3fOcE3et/mB9Ff9EC3jEmvdZaV09ffP1jKPPom8Fb/7EB7CPMm9P+U68BVzx1ONuACDEg6zQUodvEgGyjzgqLfodNQdmqIEqvmQGRB1rvYllVYuRBY92UH4jWZ2rAt6wFlv1M+7GOq7fk0zY/4mMdyBuHJ6AuF7pUwIoJaCNWNHhMsW5TUMQl6B7j9KL3SixraLYish0rt0JfS5nAU4++FxQQ/237no2/4vHoyRRvO4Z3gBGWufcdkS+Uuik/kPam/AqsJiB0wRPBMCUhBwTcgA7CCIZKhAsYiTCCIfEdGiFXWJrBlPRXKEXdwbB3I4QQQgghhBBCCCGEEGKHPyXfbHmDSthyAAAAAElFTkSuQmCC",
};

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
