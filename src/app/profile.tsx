import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

const AVATAR_CHOICES = ["🎺", "🎷", "🎸", "🎻", "🥁", "🎹", "🎤", "🎧", "🦄", "🐱", "🐶", "🚀"];
const COLOR_CHOICES = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
const LEVEL_NAMES = ["Novice", "Rookie", "Player", "Skilled", "Star", "Pro", "Master", "Virtuoso", "Maestro", "Legend"];

const ALL_TROPHIES = [
  {
    id: "1",
    name: "First Note",
    emoji: "🎺",
    desc: "Successfully hit your first note in the live studio.",
  },
  {
    id: "2",
    name: "3-Day Streak",
    emoji: "🔥",
    desc: "Practice 3 days in a row.",
  },
  {
    id: "3",
    name: "7-Day Streak",
    emoji: "⚡",
    desc: "Maintain a full week practice streak.",
  },
  {
    id: "4",
    name: "30-Day Master",
    emoji: "🏆",
    desc: "Log 30 consecutive days of practice.",
  },
  {
    id: "5",
    name: "Open C4 Expert",
    emoji: "🎯",
    desc: "Hit 50 correct Middle C notes.",
  },
  {
    id: "6",
    name: "Valve Coordinator",
    emoji: "⚙️",
    desc: "Master all primary 1, 2, and 3 valve combinations.",
  },
  {
    id: "7",
    name: "Lip Slur Novice",
    emoji: "〰️",
    desc: "Execute a smooth harmonic slur between partials.",
  },
  {
    id: "8",
    name: "High Register Cadet",
    emoji: "🚀",
    desc: "Successfully sound a clean G4 or above.",
  },
  {
    id: "9",
    name: "High C Pioneer",
    emoji: "⭐",
    desc: "Unlock and hit C5 (High C).",
  },
  {
    id: "10",
    name: "Double Tonguing",
    emoji: "🗣️",
    desc: "Master 'Ta-Ka' sixteenth-note articulations.",
  },
  {
    id: "11",
    name: "Triple Tonguing",
    emoji: "🌊",
    desc: "Execute clean 'Ta-Ta-Ka' triplet passages.",
  },
  {
    id: "12",
    name: "Scale Master",
    emoji: "🎼",
    desc: "Complete all major and minor scale lessons.",
  },
  {
    id: "13",
    name: "Quiz Whiz",
    emoji: "💡",
    desc: "Pass 10 lesson spot quizzes on the first try.",
  },
  {
    id: "14",
    name: "Curriculum Grinder",
    emoji: "📚",
    desc: "Complete 25 total lessons across tiers.",
  },
  {
    id: "15",
    name: "Intermediate Graduate",
    emoji: "🎖️",
    desc: "Unlock all Intermediate tier modules.",
  },
  {
    id: "16",
    name: "Advanced Virtuoso",
    emoji: "👑",
    desc: "Access the Advanced professional curriculum.",
  },
  {
    id: "17",
    name: "Dynamic Control",
    emoji: "🔊",
    desc: "Maintain pitch stability during pianissimo practice.",
  },
  {
    id: "18",
    name: "Endurance Champ",
    emoji: "💪",
    desc: "Complete a continuous 20-minute live practice session.",
  },
  {
    id: "19",
    name: "Pitch Perfectionist",
    emoji: "🎨",
    desc: "Stay within 5 cents of target pitch for 10 seconds.",
  },
  {
    id: "20",
    name: "Jazz Bender",
    emoji: "🎷",
    desc: "Experiment with micro-tuning and lip bends.",
  },
  {
    id: "21",
    name: "AI Coach Seeker",
    emoji: "🤖",
    desc: "Ask the AI practice coach 15 embouchure questions.",
  },
  {
    id: "22",
    name: "Night Owl",
    emoji: "🌙",
    desc: "Complete a practice session after 9:00 PM.",
  },
  {
    id: "23",
    name: "Early Bird",
    emoji: "🌅",
    desc: "Complete a practice session before 7:00 AM.",
  },
  {
    id: "24",
    name: "Gear Head",
    emoji: "🔧",
    desc: "Explore all entries in the Fingering Guide.",
  },
  {
    id: "25",
    name: "Maestro of Brass",
    emoji: "🌟",
    desc: "Reach Level 10 and unlock all achievement trophies.",
  },
];

export default function ProfileScreen() {
  const { isDarkMode } = useTheme();
  const [userName, setUserName] = useState("Trumpet Player");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");
  const [avatar, setAvatar] = useState("🎺");
  const [themeColor, setThemeColor] = useState("#3B82F6");
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    async function loadProfileData() {
      const savedName = await AsyncStorage.getItem("user_trumpet_name");
      if (savedName) {
        setUserName(savedName);
        setTempName(savedName);
      }
      const savedAvatar = await AsyncStorage.getItem("user_avatar");
      if (savedAvatar) setAvatar(savedAvatar);
      const savedColor = await AsyncStorage.getItem("user_theme_color");
      if (savedColor) setThemeColor(savedColor);
      const savedXp = await AsyncStorage.getItem("tt_xp");
      if (savedXp) setXp(parseInt(savedXp, 10) || 0);
      const savedLessons = await AsyncStorage.getItem("completed_lessons");
      if (savedLessons) {
        setCompletedLessons(JSON.parse(savedLessons));
      }
    }
    loadProfileData();
  }, []);

  const saveName = async () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      await AsyncStorage.setItem("user_trumpet_name", tempName.trim());
    }
    setIsEditing(false);
  };

  const pickAvatar = async (emoji: string) => {
    setAvatar(emoji);
    await AsyncStorage.setItem("user_avatar", emoji);
  };

  const pickColor = async (color: string) => {
    setThemeColor(color);
    await AsyncStorage.setItem("user_theme_color", color);
  };

  // Check achievement unlock conditions dynamically
  const isUnlocked = (trophyId: string) => {
    if (trophyId === "1") return true; // First Note always unlocked
    if (trophyId === "2") return streak >= 3;
    if (trophyId === "3") return streak >= 7;
    if (trophyId === "14") return completedLessons.length >= 5;
    return false; // Other advanced trophies unlock as progress continues
  };

  const level = Math.floor(xp / 500) + 1;
  const levelName = LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)];
  const xpIntoLevel = xp % 500;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#130E20" : "#F8FAFC" },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.headerTitle,
              { color: isDarkMode ? "#F1F5F9" : "#1E293B" },
            ]}
          >
            XP & Profile 🏆
          </Text>
          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            style={styles.editButtonTouchable}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? "Done" : "Customize"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Level & Streak Card */}
        <View
          style={[
            styles.levelCard,
            {
              backgroundColor: isDarkMode ? "#1E1832" : "#FFFFFF",
              borderColor: isDarkMode ? "#3A2F5C" : "#E2E8F0",
            },
          ]}
        >
          <View style={styles.cardTopRow}>
            <View
              style={[
                styles.avatarPlaceholder,
                {
                  backgroundColor: isDarkMode ? "#2B2145" : "#EFF6FF",
                  borderColor: themeColor,
                },
              ]}
            >
              <Text style={{ fontSize: 26 }}>{avatar}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text
                style={[
                  styles.levelTitle,
                  { color: isDarkMode ? "#F1F5F9" : "#1E293B" },
                ]}
              >
                {userName}
              </Text>
              <Text style={[styles.xpText, { color: themeColor }]}>
                Level {level} {levelName} • {xp} XP • 🔥 {streak} Day Streak
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.progressBar,
              {
                backgroundColor: isDarkMode ? "#2B2145" : "#F1F5F9",
                marginTop: 14,
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                { width: `${(xpIntoLevel / 500) * 100}%`, backgroundColor: themeColor },
              ]}
            />
          </View>
        </View>

        {isEditing && (
          <View
            style={[
              styles.editCard,
              {
                backgroundColor: isDarkMode ? "#1E1832" : "#FFFFFF",
                borderColor: isDarkMode ? "#3A2F5C" : "#E2E8F0",
              },
            ]}
          >
            <Text
              style={[
                styles.editLabel,
                { color: isDarkMode ? "#A79BD0" : "#64748B" },
              ]}
            >
              Your Name:
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDarkMode ? "#2B2145" : "#F1F5F9",
                  color: isDarkMode ? "#F1F5F9" : "#1E293B",
                  borderColor: isDarkMode ? "#3A2F5C" : "#CBD5E1",
                },
              ]}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Your Name"
              placeholderTextColor={isDarkMode ? "#64748B" : "#A79BD0"}
            />
            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: themeColor }]} onPress={saveName}>
              <Text style={styles.saveBtnText}>Save Name</Text>
            </TouchableOpacity>

            <Text
              style={[
                styles.editLabel,
                { color: isDarkMode ? "#A79BD0" : "#64748B", marginTop: 14 },
              ]}
            >
              Pick Your Avatar:
            </Text>
            <View style={styles.avatarGrid}>
              {AVATAR_CHOICES.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  onPress={() => pickAvatar(emoji)}
                  style={[
                    styles.avatarChoice,
                    {
                      backgroundColor: isDarkMode ? "#2B2145" : "#F1F5F9",
                      borderColor: avatar === emoji ? themeColor : "transparent",
                    },
                  ]}
                >
                  <Text style={{ fontSize: 24 }}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text
              style={[
                styles.editLabel,
                { color: isDarkMode ? "#A79BD0" : "#64748B", marginTop: 14 },
              ]}
            >
              Favorite Color:
            </Text>
            <View style={styles.colorRow}>
              {COLOR_CHOICES.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => pickColor(color)}
                  style={[
                    styles.colorDot,
                    {
                      backgroundColor: color,
                      borderColor: themeColor === color ? (isDarkMode ? "#FFFFFF" : "#1E293B") : "transparent",
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {/* Trophies Grid */}
        <Text
          style={[
            styles.sectionTitle,
            { color: isDarkMode ? "#F1F5F9" : "#1E293B" },
          ]}
        >
          Achievement Trophies (25 Total)
        </Text>
        <View style={styles.trophyGrid}>
          {ALL_TROPHIES.map((trophy) => {
            const unlocked = isUnlocked(trophy.id);
            return (
              <View
                key={trophy.id}
                style={[
                  styles.trophyCard,
                  {
                    backgroundColor: isDarkMode ? "#1E1832" : "#FFFFFF",
                    borderColor: unlocked
                      ? "#10B981"
                      : isDarkMode
                        ? "#3A2F5C"
                        : "#E2E8F0",
                    opacity: unlocked ? 1 : 0.6,
                  },
                ]}
              >
                <Text style={styles.trophyEmoji}>{trophy.emoji}</Text>
                <Text
                  style={[
                    styles.trophyName,
                    { color: isDarkMode ? "#F1F5F9" : "#1E293B" },
                  ]}
                >
                  {trophy.name}
                </Text>
                <Text
                  style={[
                    styles.trophyDesc,
                    { color: isDarkMode ? "#A79BD0" : "#64748B" },
                  ]}
                >
                  {trophy.desc}
                </Text>
                <Text
                  style={[
                    styles.statusText,
                    { color: unlocked ? "#10B981" : "#A79BD0" },
                  ]}
                >
                  {unlocked ? "✅ Unlocked" : "🔒 Locked"}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 90 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  headerTitle: { fontSize: 22, fontWeight: "800" },
  editButtonTouchable: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "rgba(59, 130, 246, 0.12)",
  },
  editButtonText: { color: "#3B82F6", fontWeight: "bold", fontSize: 13 },
  levelCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    elevation: 2,
  },
  cardTopRow: { flexDirection: "row", alignItems: "center" },
  avatarPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  welcomeText: {
    fontSize: 11,
    color: "#A79BD0",
    marginBottom: 2,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  levelTitle: { fontSize: 18, fontWeight: "800", marginBottom: 2 },
  xpText: { fontSize: 12, fontWeight: "700" },
  progressBar: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%" },
  editCard: { padding: 14, borderRadius: 16, marginBottom: 16, borderWidth: 1 },
  editLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  saveBtn: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  saveBtnText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 13 },
  avatarGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  avatarChoice: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  colorRow: { flexDirection: "row", gap: 10 },
  colorDot: { width: 36, height: 36, borderRadius: 18, borderWidth: 2 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
    marginTop: 4,
  },
  trophyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  trophyCard: {
    width: "48%",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    elevation: 1,
  },
  trophyEmoji: { fontSize: 32, marginBottom: 6 },
  trophyName: {
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 4,
  },
  trophyDesc: {
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 15,
  },
  statusText: { fontSize: 10, fontWeight: "700", textTransform: "uppercase" },
});
