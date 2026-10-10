import { Colors } from "@/constants/theme";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "unspecified" ? "light" : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelVisibilityMode="labeled"
      labelStyle={{ selected: { color: colors.text } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Practice</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sfSymbol="music.note"
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="lessons">
        <NativeTabs.Trigger.Label>Lessons</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sfSymbol="book.fill"
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="guide">
        <NativeTabs.Trigger.Label>Note Guide</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sfSymbol="music.mic"
          renderingMode="template"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="goals">
        <NativeTabs.Trigger.Label>Goals</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sfSymbol="target" renderingMode="template" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>XP & Badges</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sfSymbol="rosette" renderingMode="template" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sfSymbol="gearshape"
          renderingMode="template"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
