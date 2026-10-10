import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext"; // adjust path if your settings file is located elsewhere in src/app/

export default function SettingsScreen() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetMsg, setResetMsg] = useState("");

  const resetProgress = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    const d = new Date();
    const todayQuest = `tt_quests_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    await Promise.all([
      AsyncStorage.removeItem("tt_xp"),
      AsyncStorage.removeItem("tt_days"),
      AsyncStorage.removeItem("completed_lessons"),
      AsyncStorage.removeItem(todayQuest),
      AsyncStorage.removeItem("tt_confetti"),
    ]);
    // also clear WebView-local quest/xp caches so screens re-sync
    setConfirmReset(false);
    setResetMsg("Progress reset — fresh start! 🌱");
  };

  const labelColor = { color: isDarkMode ? "#FFFFFF" : "#2C3E50" };
  const cardStyle = {
    backgroundColor: isDarkMode ? "#1E1832" : "#FFFFFF",
  };
  const subColor = { color: isDarkMode ? "#9AA0AE" : "#64748B" };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDarkMode ? "#130E20" : "#F5F7FA" },
      ]}
    >
      <View style={[styles.card, cardStyle]}>
        <Text style={[styles.label, labelColor]}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>

      <View style={[styles.cardColumn, cardStyle]}>
        <Text style={[styles.label, labelColor]}>Reset Progress</Text>
        <Text style={[styles.helper, subColor]}>
          Clears XP, streak, completed lessons, and today's quests. Your name,
          avatar, and color are kept.
        </Text>
        <TouchableOpacity
          style={[styles.resetButton, confirmReset && styles.resetArmed]}
          onPress={resetProgress}
        >
          <Text style={styles.resetButtonText}>
            {confirmReset ? "Tap again to confirm reset" : "Reset all progress"}
          </Text>
        </TouchableOpacity>
        {resetMsg ? <Text style={[styles.status, subColor]}>{resetMsg}</Text> : null}
      </View>

      <View style={[styles.card, cardStyle]}>
        <View>
          <Text style={[styles.label, labelColor]}>🎺 Trumpet Tutor</Text>
          <Text style={[styles.helper, subColor]}>Version 1.0.0 — made for young players.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  card: {
    margin: 15,
    marginBottom: 0,
    padding: 20,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  cardColumn: {
    margin: 15,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  helper: { fontSize: 12, lineHeight: 17, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  buttonRow: { flexDirection: "row", gap: 10 },
  saveButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  saveButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  clearButtonText: { color: "#EF4444", fontWeight: "700", fontSize: 14 },
  status: { fontSize: 12, marginTop: 8 },
  resetButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  resetArmed: { backgroundColor: "#991B1B" },
  resetButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
});
