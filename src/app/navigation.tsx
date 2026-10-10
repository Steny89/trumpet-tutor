import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

export default function NavigationScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const menuItems = [
    { title: "Lessons", route: "/lessons", icon: "book" },
    { title: "Daily Challenges / Goals", route: "/goals", icon: "flag" },
    { title: "Guide", route: "/guide", icon: "compass" },
    { title: "Explore", route: "/explore", icon: "globe" },
    { title: "Profile & XP", route: "/profile", icon: "person" },
  ];

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDarkMode ? "#130E20" : "#F5F7FA" },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            { color: isDarkMode ? "#FFFFFF" : "#2C3E50" },
          ]}
        >
          Explore & Hub
        </Text>
      </View>
      <View style={styles.container}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.card,
              { backgroundColor: isDarkMode ? "#1E1832" : "#FFFFFF" },
            ]}
            onPress={() => router.push(item.route)}
          >
            <View style={styles.cardContent}>
              <Text
                style={[
                  styles.cardText,
                  { color: isDarkMode ? "#FFFFFF" : "#2C3E50" },
                ]}
              >
                {item.title}
              </Text>
            </View>
            <Text
              style={{ color: "#2980B9", fontSize: 18, fontWeight: "bold" }}
            >
              →
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { padding: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 22, fontWeight: "bold" },
  container: { padding: 15, gap: 12 },
  card: {
    padding: 18,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: { flexDirection: "row", alignItems: "center" },
  cardText: { fontSize: 16, fontWeight: "600" },
});
