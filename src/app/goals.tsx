import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

const ACHIEVEMENTS = [
  {
    id: "1",
    title: "First Note",
    desc: "Successfully detect your first pitched note.",
    icon: "🎺",
    unlocked: true,
  },
  {
    id: "2",
    title: "Scale Walker",
    desc: "Play a complete C Major scale.",
    icon: "🎼",
    unlocked: true,
  },
  {
    id: "3",
    title: "High C Milestone",
    desc: "Hit and hold a C5 clearly for 3 seconds.",
    icon: "🎯",
    unlocked: false,
  },
  {
    id: "4",
    title: "Consistent Air",
    desc: "Hold a single note steady for 10 seconds.",
    icon: "💨",
    unlocked: false,
  },
  {
    id: "5",
    title: "7-Day Streak",
    desc: "Practice for 7 consecutive days.",
    icon: "🔥",
    unlocked: false,
  },
  {
    id: "6",
    title: "30-Day Scholar",
    desc: "Practice for 30 consecutive days.",
    icon: "📅",
    unlocked: false,
  },
  {
    id: "7",
    title: "Perfect Pitch",
    desc: "Hit 5 notes in a row with 95% accuracy.",
    icon: "✨",
    unlocked: false,
  },
  {
    id: "8",
    title: "AI Apprentice",
    desc: "Ask the AI Coach 10 practice questions.",
    icon: "🤖",
    unlocked: false,
  },
  {
    id: "9",
    title: "Brass Lungs",
    desc: "Log over 10 hours of active playing time.",
    icon: "🫁",
    unlocked: false,
  },
  {
    id: "10",
    title: "Lip Slur Master",
    desc: "Successfully transition G4 to C5 without tonguing.",
    icon: "🌊",
    unlocked: false,
  },
];

export default function GoalsScreen() {
  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#130E20" : "#F5F7FA" },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text
          style={[
            styles.headerTitle,
            { color: isDarkMode ? "#FFFFFF" : "#2C3E50" },
          ]}
        >
          Achievements 🏆
        </Text>
        <Text
          style={[
            styles.headerSub,
            { color: isDarkMode ? "#AAAAAA" : "#64748B" },
          ]}
        >
          Track your practice milestones.
        </Text>

        {ACHIEVEMENTS.map((item) => (
          <View
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: isDarkMode
                  ? item.unlocked
                    ? "#1E1832"
                    : "#1A1A1A"
                  : item.unlocked
                    ? "#FFFFFF"
                    : "#E2E8F0",
                borderColor: isDarkMode ? "#333333" : "transparent",
                borderWidth: isDarkMode ? 1 : 0,
                opacity: item.unlocked ? 1 : 0.65,
              },
            ]}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={styles.textCol}>
              <Text
                style={[
                  styles.title,
                  { color: isDarkMode ? "#FFFFFF" : "#2C3E50" },
                ]}
              >
                {item.title}
              </Text>
              <Text
                style={[
                  styles.desc,
                  { color: isDarkMode ? "#AAAAAA" : "#64748B" },
                ]}
              >
                {item.desc}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20 },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  headerSub: { fontSize: 13, marginBottom: 15 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    elevation: 2,
  },
  icon: { fontSize: 30, marginRight: 15 },
  textCol: { flex: 1 },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  desc: { fontSize: 13 },
});
