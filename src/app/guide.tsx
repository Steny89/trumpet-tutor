import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

const FINGERING_CHART = [
  {
    note: "F#3 / Gb3",
    pitchHz: "185 Hz",
    valves: "1-2-3",
    execution: "Relax embouchure, fast cool air column.",
  },
  {
    note: "G3",
    pitchHz: "196 Hz",
    valves: "1-3",
    execution: "Slightly drop jaw, firm corners.",
  },
  {
    note: "A3",
    pitchHz: "220 Hz",
    valves: "1-2",
    execution: "Balanced lip tension, steady breath.",
  },
  {
    note: "Bb3",
    pitchHz: "233 Hz",
    valves: "1",
    execution: "Focus air stream downward into mouthpiece.",
  },
  {
    note: "B3",
    pitchHz: "246 Hz",
    valves: "2",
    execution: "Quick slight corner pinch for stability.",
  },
  {
    note: "C4 (Middle C)",
    pitchHz: "261 Hz",
    valves: "0 (Open)",
    execution: "Natural relaxed aperture, centered tone.",
  },
  {
    note: "D4",
    pitchHz: "293 Hz",
    valves: "1-3",
    execution: "Increase air speed slightly for second partial.",
  },
  {
    note: "E4",
    pitchHz: "329 Hz",
    valves: "1-2",
    execution: "Firm corners, keep tongue arch high.",
  },
  {
    note: "F4",
    pitchHz: "349 Hz",
    valves: "1",
    execution: "Focused air stream, stable intonation.",
  },
  {
    note: "G4",
    pitchHz: "392 Hz",
    valves: "0 (Open)",
    execution: "Open throat, fast compressed air.",
  },
  {
    note: "A4",
    pitchHz: "440 Hz",
    valves: "1-2",
    execution: "Firm aperture compression, steady support.",
  },
  {
    note: "Bb4",
    pitchHz: "466 Hz",
    valves: "1",
    execution: "Controlled velocity air column.",
  },
  {
    note: "C5 (High C)",
    pitchHz: "523 Hz",
    valves: "0 (Open)",
    execution: "High tongue arch ('ee' vowel), firm corners.",
  },
];

export default function GuideScreen() {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  const handlePracticeNote = async (item: (typeof FINGERING_CHART)[0]) => {
    await AsyncStorage.setItem("target_practice_note", item.note);
    await AsyncStorage.setItem("target_practice_valves", item.valves);
    await AsyncStorage.setItem("target_practice_exec", item.execution);
    router.push("/practice");
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDarkMode ? "#130E20" : "#F8FAFC" },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            { color: isDarkMode ? "#F1F5F9" : "#1E293B" },
          ]}
        >
          Trumpet Finger Placement and Notes 🎺
        </Text>
        <Text
          style={[
            styles.headerSub,
            { color: isDarkMode ? "#A79BD0" : "#64748B" },
          ]}
        >
          Select a note to load its instructions directly into your Live
          Practice Studio
        </Text>
      </View>

      <FlatList
        data={FINGERING_CHART}
        keyExtractor={(item) => item.note}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: isDarkMode ? "#1E1832" : "#FFFFFF",
                borderColor: isDarkMode ? "#3A2F5C" : "#E2E8F0",
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <Text
                style={[
                  styles.noteName,
                  { color: isDarkMode ? "#F1F5F9" : "#1E293B" },
                ]}
              >
                {item.note}
              </Text>
              <View style={styles.valveBadge}>
                <Text style={styles.valveText}>Valves: {item.valves}</Text>
              </View>
            </View>
            <Text
              style={[
                styles.execText,
                { color: isDarkMode ? "#A79BD0" : "#64748B" },
              ]}
            >
              💡 {item.execution}
            </Text>

            <TouchableOpacity
              style={styles.practiceBtn}
              onPress={() => handlePracticeNote(item)}
            >
              <Text style={styles.practiceBtnText}>Practice This Note 🎯</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { padding: 16, paddingBottom: 10 },
  headerTitle: { fontSize: 22, fontWeight: "800", marginBottom: 4 },
  headerSub: { fontSize: 12, fontWeight: "600" },
  listContainer: { padding: 16, paddingBottom: 90 },
  card: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  noteName: { fontSize: 16, fontWeight: "800" },
  valveBadge: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  valveText: { color: "#3B82F6", fontSize: 12, fontWeight: "700" },
  execText: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
    marginBottom: 12,
  },
  practiceBtn: {
    backgroundColor: "#10B981",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  practiceBtnText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 13 },
});
