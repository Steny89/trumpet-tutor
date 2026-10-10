// Lets the bottom tab bar tell the Games WebView to jump back to the hub
// when the Games tab is tapped while a game is open.
let resetter: (() => void) | null = null;

export function setGamesReset(fn: (() => void) | null) {
  resetter = fn;
}

export function resetGamesHub() {
  resetter?.();
}
