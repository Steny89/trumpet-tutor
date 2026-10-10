import AsyncStorage from "@react-native-async-storage/async-storage";

const XP_KEY = "tt_xp";

/** Single source of truth for XP. Everything (WebViews, lessons, games) adds via deltas. */
export async function awardXP(delta: number): Promise<number> {
  const cur = parseInt((await AsyncStorage.getItem(XP_KEY)) || "0", 10) || 0;
  const next = Math.max(0, cur + delta);
  await AsyncStorage.setItem(XP_KEY, String(next));
  return next;
}

export async function getStoredXP(): Promise<number> {
  return parseInt((await AsyncStorage.getItem(XP_KEY)) || "0", 10) || 0;
}

export function levelForXp(xp: number): number {
  return Math.floor(xp / 500) + 1;
}
