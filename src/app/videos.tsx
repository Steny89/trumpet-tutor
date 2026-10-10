import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

const MAINTENANCE_TIPS = [
  {
    id: "1",
    title: "Monthly Full Instrument Bath",
    emoji: "🛁",
    category: "Cleaning",
    desc: "Remove all slides and valve caps. Soak the trumpet body in lukewarm (never hot) water with mild dish soap and a drop of vinegar. Use a flexible snake brush to clear buildup inside leadpipes and slides before rinsing thoroughly.",
  },
  {
    id: "2",
    title: "Weekly Valve Maintenance & Oiling",
    emoji: "⚙️",
    category: "Valves",
    desc: "Unscrew one valve at a time straight up without twisting. Apply 2–3 drops of synthetic valve oil directly onto the piston ports. Guide the valve back in until you hear and feel it click securely into its alignment guide.",
  },
  {
    id: "3",
    title: "Tuning Slide Grease Application",
    emoji: "🧴",
    category: "Slides",
    desc: "Wipe away old, gritty slide grease using a lint-free cloth or paper towel. Apply a thin, even layer of fresh slide grease to the inner slide tubes. Smoothly work the slide back and forth to distribute the lubricant evenly.",
  },
  {
    id: "4",
    title: "Post-Playing Hygiene & Moisture Removal",
    emoji: "💧",
    category: "Daily Care",
    desc: "Always empty your water keys (spit valves) before putting the trumpet back in its case. Run a pull-through cleaning swab through the leadpipe once a week to prevent mineral and saliva accumulation.",
  },
  {
    id: "5",
    title: "Mouthpiece Care & Sanitation",
    emoji: "🧽",
    category: "Hygiene",
    desc: "Clean your mouthpiece weekly using warm soapy water and a specialized mouthpiece brush. Never use sharp metallic objects to clear debris from the throat or shank, as scratching alters intonation and response.",
  },
  {
    id: "6",
    title: "Embouchure Pressure Control",
    emoji: "🎯",
    category: "Technique",
    desc: "Avoid pressing the mouthpiece hard against your teeth. Let your core air column and corner facial muscles provide the upward resistance. If a red ring forms around your lips after playing, reduce your pressure immediately.",
  },
  {
    id: "7",
    title: "Stuck Slide & Valve Safety",
    emoji: "⚠️",
    category: "Troubleshooting",
    desc: "Never force stuck slides with pliers or screwdrivers, which can easily dent or warp brass tubing. If a slide or bottom valve cap is firmly stuck, take it to a local repair technician for professional removal.",
  },
];

export default function TipsScreen() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDarkMode ? "#130E20" : "#F8FAFC" },
      ]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.backButton,
            { backgroundColor: isDarkMode ? "#1E1832" : "#E2E8F0" },
          ]}
        >
          <Text
            style={{
              color: isDarkMode ? "#3B82F6" : "#1E293B",
              fontWeight: "bold",
            }}
          >
            ← Back to Explore
          </Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text
            style={[
              styles.headerTitle,
              { color: isDarkMode ? "#F1F5F9" : "#1E293B" },
            ]}
          >
            Trumpet Care & Tips 🧰
          </Text>
          <Text
            style={[
              styles.headerSub,
              { color: isDarkMode ? "#A79BD0" : "#64748B" },
            ]}
          >
            Tap any card below to expand and view step-by-step maintenance
            instructions.
          </Text>
        </View>

        {MAINTENANCE_TIPS.map((tip) => {
          const isExpanded = expandedId === tip.id;
          return (
            <TouchableOpacity
              key={tip.id}
              activeOpacity={0.8}
              onPress={() => toggleExpand(tip.id)}
              style={[
                styles.card,
                {
                  backgroundColor: isDarkMode ? "#1E1832" : "#FFFFFF",
                  borderColor: isExpanded
                    ? "#3B82F6"
                    : isDarkMode
                      ? "#3A2F5C"
                      : "#E2E8F0",
                },
              ]}
            >
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardEmoji}>{tip.emoji}</Text>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text
                    style={[
                      styles.cardTitle,
                      { color: isDarkMode ? "#F1F5F9" : "#1E293B" },
                    ]}
                  >
                    {tip.title}
                  </Text>
                  <Text
                    style={[styles.categoryBadgeText, { color: "#3B82F6" }]}
                  >
                    {tip.category}
                  </Text>
                </View>
                <Text
                  style={{ color: "#3B82F6", fontSize: 14, fontWeight: "bold" }}
                >
                  {isExpanded ? "▲ Hide" : "▼ Expand"}
                </Text>
              </View>

              {isExpanded && (
                <View
                  style={[
                    styles.expandedContent,
                    { borderTopColor: isDarkMode ? "#3A2F5C" : "#E2E8F0" },
                  ]}
                >
                  <Text
                    style={[
                      styles.cardDesc,
                      { color: isDarkMode ? "#A79BD0" : "#64748B" },
                    ]}
                  >
                    {tip.desc}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20, paddingBottom: 90 },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: "800", marginBottom: 4 },
  headerSub: { fontSize: 13, fontWeight: "600" },
  card: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    elevation: 2,
  },
  cardHeaderRow: { flexDirection: "row", alignItems: "center" },
  cardEmoji: { fontSize: 28 },
  cardTitle: { fontSize: 15, fontWeight: "700", marginBottom: 2 },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  expandedContent: { marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
  cardDesc: { fontSize: 13, fontWeight: "500", lineHeight: 20 },
});
