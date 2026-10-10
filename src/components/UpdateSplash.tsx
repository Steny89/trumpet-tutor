import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Branded launch screen: pulsing trumpet, status text, and a progress bar.
 * Checks for an OTA update on every launch — downloads and applies it
 * automatically, then hands off to the main app.
 */
export default function UpdateSplash({ onReady }: { onReady: () => void }) {
  const [status, setStatus] = useState("Tuning up...");
  const [pct, setPct] = useState(0);
  const [pulse] = useState(() => new Animated.Value(1));
  const [progress] = useState(() => new Animated.Value(0));

  // trumpet breathe animation
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.28,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  // mirror animated progress into a percentage label (only on change)
  useEffect(() => {
    const id = progress.addListener(({ value }) => {
      const p = Math.round(value * 100);
      setPct((prev) => (prev === p ? prev : p));
    });
    return () => progress.removeListener(id);
  }, [progress]);

  // launch sequence: splash -> check update -> download -> apply -> app
  useEffect(() => {
    let cancelled = false;
    const setP = (v: number) => {
      if (!cancelled)
        Animated.timing(progress, {
          toValue: v,
          duration: 450,
          useNativeDriver: false,
        }).start();
    };
    (async () => {
      setP(0.12);
      await sleep(600);
      if (cancelled) return;

      if (Updates.isEnabled) {
        setStatus("Checking for updates...");
        setP(0.32);
        try {
          const check = await Updates.checkForUpdateAsync();
          if (cancelled) return;
          if (check.isAvailable) {
            setStatus("Downloading update...");
            setP(0.62);
            await Updates.fetchUpdateAsync();
            if (cancelled) return;
            setStatus("Applying update...");
            setP(0.94);
            await sleep(500);
            await Updates.reloadAsync();
            return; // reload restarts the app
          }
        } catch {
          // offline or check failed — just open the app
        }
      }
      if (cancelled) return;
      setStatus("Ready!");
      setP(1);
      await sleep(500);
      if (!cancelled) onReady();
    })();
    return () => {
      cancelled = true;
    };
  }, [onReady, progress]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Animated.Text style={[styles.trumpet, { transform: [{ scale: pulse }] }]}>
          🎺
        </Animated.Text>
        <Text style={styles.title}>Trumpet Tutor</Text>
      </View>
      <View style={styles.bottom}>
        <Text style={styles.status}>{status}</Text>
        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, { width: barWidth }]} />
        </View>
        <Text style={styles.percent}>{pct}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#130E20",
    alignItems: "center",
    justifyContent: "center",
  },
  center: { alignItems: "center" },
  trumpet: { fontSize: 88 },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#F1F5F9",
    marginTop: 14,
    letterSpacing: 0.5,
  },
  bottom: {
    position: "absolute",
    bottom: 70,
    alignItems: "center",
    width: "100%",
  },
  status: { fontSize: 13, fontWeight: "600", color: "#A79BD0", marginBottom: 12 },
  barTrack: {
    width: 230,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(167,139,250,0.18)",
    overflow: "hidden",
  },
  barFill: { height: "100%", backgroundColor: "#A78BFA", borderRadius: 5 },
  percent: { fontSize: 12, fontWeight: "700", color: "#A79BD0", marginTop: 8 },
});
