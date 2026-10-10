import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Updates from "expo-updates";
import { useState } from "react";
import {
  Modal,
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
  const [resetMsg, setResetMsg] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [updateStatus, setUpdateStatus] = useState("");
  const [checking, setChecking] = useState(false);

  const checkForUpdates = async () => {
    if (checking) return;
    try {
      setChecking(true);
      setUpdateStatus("Checking for updates...");
      const check = await Updates.checkForUpdateAsync();
      if (check.isAvailable) {
        setUpdateStatus("Downloading update...");
        await Updates.fetchUpdateAsync();
        setUpdateStatus("Update ready — restarting...");
        await Updates.reloadAsync();
      } else {
        setUpdateStatus("You're up to date ✓");
      }
    } catch {
      setUpdateStatus("Couldn't check for updates. Try again later.");
    } finally {
      setChecking(false);
    }
  };

  const resetProgress = async () => {
    setShowResetConfirm(false);
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
        <Text style={[styles.label, labelColor]}>App Updates</Text>
        {Updates.isEnabled ? (
          <>
            <Text style={[styles.helper, subColor]}>
              Channel: {Updates.channel ?? "—"} •{" "}
              {Updates.updateId
                ? `Update ${Updates.updateId.slice(0, 8)}`
                : "Built-in version"}
            </Text>
            <TouchableOpacity
              style={[styles.updateButton, checking && styles.updateBusy]}
              onPress={checkForUpdates}
              disabled={checking}
            >
              <Text style={styles.updateButtonText}>
                {checking ? "Working..." : "Check for updates"}
              </Text>
            </TouchableOpacity>
            {updateStatus ? (
              <Text style={[styles.status, subColor]}>{updateStatus}</Text>
            ) : null}
          </>
        ) : (
          <Text style={[styles.helper, subColor]}>
            Updates aren&apos;t available in this build — reinstall the latest version
            to enable them.
          </Text>
        )}
      </View>

      <View style={[styles.cardColumn, cardStyle]}>
        <Text style={[styles.label, labelColor]}>Reset Progress</Text>
        <Text style={[styles.helper, subColor]}>
          Clears XP, streak, completed lessons, and today&apos;s quests. Your name,
          avatar, and color are kept.
        </Text>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => setShowResetConfirm(true)}
        >
          <Text style={styles.resetButtonText}>Reset all progress</Text>
        </TouchableOpacity>
        {resetMsg ? <Text style={[styles.status, subColor]}>{resetMsg}</Text> : null}
      </View>

      <Modal
        visible={showResetConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResetConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, cardStyle]}>
            <Text style={[styles.label, labelColor]}>Are you sure?</Text>
            <Text style={[styles.helper, subColor]}>
              This will erase all XP, streaks, completed lessons, and today&apos;s
              quests. Your name, avatar, and color are kept. This can&apos;t be
              undone.
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowResetConfirm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={resetProgress}
              >
                <Text style={styles.confirmButtonText}>Yes, reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={[styles.card, cardStyle]}>
        <View>
          <Text style={[styles.label, labelColor]}>🎺 Trumpet Tutor</Text>
          <Text style={[styles.helper, subColor]}>Version {Constants.expoConfig?.version ?? "1.0.0"} — made for young players.</Text>
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
  updateButton: {
    backgroundColor: "#A78BFA",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  updateBusy: { opacity: 0.6 },
  updateButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: { borderRadius: 16, padding: 22, width: "100%", elevation: 5 },
  cancelButton: {
    flex: 1,
    backgroundColor: "rgba(148,163,184,0.25)",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButtonText: { fontWeight: "800", fontSize: 14, color: "#94A3B8" },
  confirmButton: {
    flex: 1,
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 14 },
});
