import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

export default function ExploreScreen() {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDarkMode ? "#130E20" : "#F8FAFC" },
      ]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text
            style={[
              styles.headerTitle,
              { color: isDarkMode ? "#F1F5F9" : "#1E293B" },
            ]}
          >
            Explore Navigation 🧭
          </Text>
          <Text
            style={[
              styles.headerSub,
              { color: isDarkMode ? "#A79BD0" : "#64748B" },
            ]}
          >
            All application modules, guides, and practice tools.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: isDarkMode ? "#1E1832" : "#FFFFFF",
              borderColor: isDarkMode ? "#3A2F5C" : "#E2E8F0",
            },
          ]}
          onPress={() => router.push("/practice")}
        >
          <Text style={styles.cardEmoji}>🎵</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              style={[
                styles.cardTitle,
                { color: isDarkMode ? "#F1F5F9" : "#1E293B" },
              ]}
            >
              Live Practice Studio
            </Text>
            <Text
              style={[
                styles.cardDesc,
                { color: isDarkMode ? "#A79BD0" : "#64748B" },
              ]}
            >
              Real-time audio tuner, pitch tracking, and AI coach.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: isDarkMode ? "#1E1832" : "#FFFFFF",
              borderColor: isDarkMode ? "#3A2F5C" : "#E2E8F0",
            },
          ]}
          onPress={() => router.push("/games")}
        >
          <Text style={styles.cardEmoji}>🎮</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              style={[
                styles.cardTitle,
                { color: isDarkMode ? "#F1F5F9" : "#1E293B" },
              ]}
            >
              Mini Games Arcade
            </Text>
            <Text
              style={[
                styles.cardDesc,
                { color: isDarkMode ? "#A79BD0" : "#64748B" },
              ]}
            >
              Memory match, quizzes, trivia, and rhythm games.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: isDarkMode ? "#1E1832" : "#FFFFFF",
              borderColor: isDarkMode ? "#3A2F5C" : "#E2E8F0",
            },
          ]}
          onPress={() => router.push("/guide")}
        >
          <Text style={styles.cardEmoji}>📖</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              style={[
                styles.cardTitle,
                { color: isDarkMode ? "#F1F5F9" : "#1E293B" },
              ]}
            >
              Fingering Guide
            </Text>
            <Text
              style={[
                styles.cardDesc,
                { color: isDarkMode ? "#A79BD0" : "#64748B" },
              ]}
            >
              Valve charts, pitches, and execution tips for every note.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: isDarkMode ? "#1E1832" : "#FFFFFF",
              borderColor: isDarkMode ? "#3A2F5C" : "#E2E8F0",
            },
          ]}
          onPress={() => router.push("/lessons")}
        >
          <Text style={styles.cardEmoji}>🎓</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              style={[
                styles.cardTitle,
                { color: isDarkMode ? "#F1F5F9" : "#1E293B" },
              ]}
            >
              Lesson Modules
            </Text>
            <Text
              style={[
                styles.cardDesc,
                { color: isDarkMode ? "#A79BD0" : "#64748B" },
              ]}
            >
              Beginner, Intermediate, and Advanced tiers with spot quizzes.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: isDarkMode ? "#1E1832" : "#FFFFFF",
              borderColor: isDarkMode ? "#3A2F5C" : "#E2E8F0",
            },
          ]}
          onPress={() => router.push("/videos")}
        >
          <Text style={styles.cardEmoji}>🧰</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              style={[
                styles.cardTitle,
                { color: isDarkMode ? "#F1F5F9" : "#1E293B" },
              ]}
            >
              Care & Maintenance Tips
            </Text>
            <Text
              style={[
                styles.cardDesc,
                { color: isDarkMode ? "#A79BD0" : "#64748B" },
              ]}
            >
              Expert guides on cleaning, valve oiling, and slide greasing.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: isDarkMode ? "#1E1832" : "#FFFFFF",
              borderColor: isDarkMode ? "#3A2F5C" : "#E2E8F0",
            },
          ]}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.cardEmoji}>🏆</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              style={[
                styles.cardTitle,
                { color: isDarkMode ? "#F1F5F9" : "#1E293B" },
              ]}
            >
              Profile & Streaks
            </Text>
            <Text
              style={[
                styles.cardDesc,
                { color: isDarkMode ? "#A79BD0" : "#64748B" },
              ]}
            >
              Daily login tracker, XP progress, and achievement trophies.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: isDarkMode ? "#1E1832" : "#FFFFFF",
              borderColor: isDarkMode ? "#3A2F5C" : "#E2E8F0",
            },
          ]}
          onPress={() => router.push("/settings")}
        >
          <Text style={styles.cardEmoji}>⚙️</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text
              style={[
                styles.cardTitle,
                { color: isDarkMode ? "#F1F5F9" : "#1E293B" },
              ]}
            >
              Settings
            </Text>
            <Text
              style={[
                styles.cardDesc,
                { color: isDarkMode ? "#A79BD0" : "#64748B" },
              ]}
            >
              Dark mode preferences and application configurations.
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20, paddingBottom: 90 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: "800", marginBottom: 4 },
  headerSub: { fontSize: 13, fontWeight: "600" },
  card: {
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    elevation: 2,
  },
  cardEmoji: { fontSize: 28 },
  cardTitle: { fontSize: 15, fontWeight: "700", marginBottom: 2 },
  cardDesc: { fontSize: 12, fontWeight: "500", lineHeight: 16 },
});
