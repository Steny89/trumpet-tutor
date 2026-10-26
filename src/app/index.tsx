import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useTheme } from "../context/ThemeContext";
import { getStoredXP } from "../constants/xp";

const INSPIRATION = [
  "Every pro was once a beginner who wouldn't quit.",
  "Missed notes are just practice notes in disguise.",
  "Your trumpet doesn't care about yesterday — only today's effort.",
  "Small practice, big progress. Show up daily.",
  "The high notes come to those who warm up low.",
  "Be patient with yourself — brass takes time to bloom.",
  "Play it slow until you can't get it wrong.",
  "Today's squeak is tomorrow's song.",
  "Breathe deep, aim high, have fun.",
  "Consistency beats intensity — 10 minutes daily wins.",
  "Your sound is uniquely yours. Own it.",
  "Every scale you master unlocks ten songs.",
  "Courage is playing the hard part anyway.",
  "Music is a journey — enjoy every mile.",
];

const JOKES = [
  "Why did the trumpet player bring a ladder? To reach the high notes!",
  "What do you call a trumpet that tells jokes? A real brass act!",
  "Why are trumpet players great at baseball? They always know how to pitch!",
  "What did the trumpet say to the drums? Stop beating around the bush!",
  "Why did the music student get locked out? She forgot her key signature!",
  "How do you fix a wobbly note? With a little brass polish and a lot of practice!",
  "Why don't trumpets ever get lost? They always follow the right valves!",
  "What's a trumpet's favorite dessert? Toot-sie rolls!",
  "Why did the trumpet join the gym? To work on its embouchure!",
  "What do you get when you cross a trumpet with a bicycle? A brass cycle!",
  "Why was the trumpet player always calm? She knew how to keep her cool under brassure!",
  "How many trumpet players does it take to change a lightbulb? One — but she'll practice the approach for a week!",
  "Why did the metronome break up with the trumpet? Too much push and pull!",
  "What do trumpets eat for breakfast? Oat-mezzo!",
  "Why are trumpet lessons like pizza? Even the rough takes are worth another try!",
  "What did one valve say to the other? Stop pressing me!",
  "Why did the trumpet player sit in the front row? She wanted to be first chair!",
  "How does a trumpet say hello? Hi-C!",
  "Why don't skeletons play trumpet? No lips for the mouthpiece!",
  "What's a beginner's favorite ride? The learning curve!",
  "Why did the band director bring string? To tie up loose ends before the concert!",
  "What kind of music do balloons hate? Pop music!",
  "Why is the trumpet the funniest brass instrument? It always delivers the punch-line!",
  "What do you call twelve trumpets in a row? A brass bandwagon!",
  "Why don't eggs tell jokes? They'd crack each other up!",
  "What do you call cheese that isn't yours? Nacho cheese!",
  "Why did the scarecrow win an award? He was outstanding in his field!",
  "What do you call a fish with no eyes? A fsh!",
  "Why did the bicycle fall over? It was two-tired!",
  "What did the ocean say to the beach? Nothing — it just waved!",
  "Why don't scientists trust atoms? Because they make up everything!",
  "What do you call a sleeping bull? A bulldozer!",
  "Why did the math book look so sad? It had too many problems!",
  "What do you call a factory that makes okay products? A satisfactory!",
  "Why did the cookie go to the doctor? It was feeling crumby!",
  "How does a penguin build its house? Igloos it together!",
  "Why are golden retrievers such good friends? They're always retrieving your spirits!",
  "Why did the golden retriever sit in the shade? He didn't want to be a hot dog!",
  "Why are golden retrievers terrible at poker? Their tail gives away every good hand!",
  "Why did the golden retriever become a lifeguard? He was already in the water anyway!",
  "What's a golden retriever's favorite game? Fetch — it's not a game, it's a lifestyle!",
  "Why do golden retrievers smile so much? Every stick is the best stick they've ever seen!",
  "What do golden retrievers say after a great joke? That one's golden!",
  "What do you call a golden retriever with a map? Still lost — but having the best time ever!",
  "Why did the golden retriever bring a towel to the park? Just in case there was a pool party!",
  "What's golden, fluffy, and comes back every time you throw it? A golden retriever with a tennis ball!",
  "Why don't golden retrievers ever get in trouble? Nobody can stay mad at that face!",
];

const TIPS = [
  "Buzz your lips on the mouthpiece alone for 2 minutes — it builds your embouchure faster than anything.",
  "Take a deep belly breath before every phrase — your air is your sound's fuel.",
  "Keep your corners firm and the middle of your lips relaxed.",
  "Practice long tones: hold one note steady and listen for wobbles.",
  "Oil your valves once a week — a sticky valve ruins a good run.",
  "Always warm up low and slow before trying high notes.",
  "Use a metronome, even for 5 minutes — timing is half the battle.",
  "Rest as much as you play when starting out — tired lips learn bad habits.",
  "Sit or stand tall — good posture opens your lungs.",
  "Listen to great trumpet players every day — your ears teach your lips.",
  "Rinse your mouthpiece with warm water regularly.",
  "If a note cracks, slow down and try it softer — speed comes after control.",
  "Practice the hard 2 bars ten times, not the whole piece once.",
  "End every session with something you can already play well — finish on a win!",
];

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export default function HomeScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [profile, setProfile] = useState({
    name: "Trumpet Player",
    avatar: "🎺",
    color: "#3B82F6",
  });
  const [nativeXp, setNativeXp] = useState(0);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [n, a, c, xp] = await Promise.all([
          AsyncStorage.getItem("user_trumpet_name"),
          AsyncStorage.getItem("user_avatar"),
          AsyncStorage.getItem("user_theme_color"),
          getStoredXP(),
        ]);
        setNativeXp(xp);
        setProfile({
          name: n || "Trumpet Player",
          avatar: a || "🎺",
          color: c || "#3B82F6",
        });
      })();
    }, []),
  );

  const bgCol = isDarkMode ? "#130E20" : "#F8FAFC";
  const cardBg = isDarkMode ? "#1E1832" : "#FFFFFF";
  const textCol = isDarkMode ? "#F1F5F9" : "#1E293B";
  const subTextCol = isDarkMode ? "#A79BD0" : "#64748B";
  const inputBg = isDarkMode ? "#2B2145" : "#F1F5F9";
  const borderCol = isDarkMode ? "#3A2F5C" : "#E2E8F0";
  const accent = profile.color;

  const html = useMemo(() => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <style>
        html, body { margin: 0; padding: 12px; background-color: ${bgCol}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: ${textCol}; box-sizing: border-box; }
        * { box-sizing: border-box; }
        .hero { background: linear-gradient(135deg, ${accent}, ${isDarkMode ? "#1e2a4a" : "#dbeafe"}); border-radius: 16px; padding: 16px; margin-bottom: 10px; display: flex; align-items: center; gap: 12px; }
        .avatar { width: 58px; height: 58px; border-radius: 29px; background: rgba(255,255,255,0.9); display: flex; align-items: center; justify-content: center; font-size: 30px; flex-shrink: 0; }
        .greet { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.85); text-transform: uppercase; letter-spacing: 0.5px; }
        .pname { font-size: 20px; font-weight: 900; color: #fff; }
        .plevel { font-size: 12px; font-weight: 700; color: #fff; opacity: 0.9; margin-top: 2px; }
        .card { background: ${isDarkMode ? "rgba(58, 40, 108, 0.55)" : cardBg}; border: 1px solid ${borderCol}; border-radius: 14px; padding: 12px; margin-bottom: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
        .card-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: ${subTextCol}; margin-bottom: 8px; }
        .daily { font-size: 14px; font-weight: 600; line-height: 1.45; color: ${textCol}; }
        .daily-emoji { font-size: 20px; margin-right: 6px; }
        .xpbar { height: 10px; background: ${inputBg}; border-radius: 5px; overflow: hidden; border: 1px solid ${borderCol}; margin-top: 6px; }
        .xpfill { height: 100%; background: linear-gradient(90deg, ${accent}, #10B981); border-radius: 5px; }
        .statgrid { display: flex; gap: 8px; }
        .stat { flex: 1; background: ${inputBg}; border: 1px solid ${borderCol}; border-radius: 10px; padding: 10px 6px; text-align: center; }
        .stat-v { font-size: 20px; font-weight: 900; color: ${accent}; }
        .stat-l { font-size: 9px; font-weight: 700; color: ${subTextCol}; text-transform: uppercase; margin-top: 2px; }
        .qrow { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; padding: 6px 0; border-bottom: 1px solid ${borderCol}; }
        .qrow:last-child { border-bottom: none; }
        .qdone { color: #10B981; font-weight: 800; }
        .actions { display: flex; gap: 8px; }
        .abtn { flex: 1; padding: 14px 6px; border-radius: 12px; border: none; font-size: 13px; font-weight: 800; color: #fff; background: ${accent}; cursor: pointer; box-shadow: 0 3px 8px rgba(0,0,0,0.15); }
        .abtn.alt { background: ${inputBg}; color: ${textCol}; border: 1px solid ${borderCol}; box-shadow: none; }
        .jokebtn { margin-top: 10px; padding: 9px 16px; border-radius: 10px; border: 1px solid ${borderCol}; background: ${inputBg}; color: ${textCol}; font-size: 12px; font-weight: 800; cursor: pointer; -webkit-tap-highlight-color: transparent; transition: transform 0.12s ease, filter 0.12s ease; }
        .jokebtn:active { transform: scale(0.93); filter: brightness(1.15); }
        @keyframes riseIn { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: none; } }
        @keyframes heroShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.85); } 60% { transform: scale(1.03); } 100% { opacity: 1; transform: scale(1); } }
        .hero { background: linear-gradient(135deg, ${accent}, #7C3AED, #EC4899, ${accent}) !important; background-size: 300% 300% !important; animation: heroShift 9s ease infinite, popIn 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .card { animation: riseIn 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .actions { animation: riseIn 0.55s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.55s; }
        .abtn { transition: transform 0.12s ease, filter 0.12s ease; -webkit-tap-highlight-color: transparent; }
        .abtn:active { transform: scale(0.92); filter: brightness(1.12); }
        .xpfill { transition: width 0.8s cubic-bezier(0.22,1,0.36,1); }
        .stat-v { transition: transform 0.2s ease; }
      </style>
    </head>
    <body>
      <div class="hero">
        <div class="avatar">${esc(profile.avatar)}</div>
        <div>
          <div class="greet" id="greetWord">Hello</div>
          <div class="pname">${esc(profile.name)}</div>
          <div class="plevel" id="levelLine">Level 1 • 0 XP</div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">✨ Inspiration for today</div>
        <div class="daily" id="inspireLine"></div>
      </div>

      <div class="card">
        <div class="card-title">Your stats</div>
        <div class="statgrid">
          <div class="stat"><div class="stat-v" id="streakV">0</div><div class="stat-l">Day streak</div></div>
          <div class="stat"><div class="stat-v" id="xpV">0</div><div class="stat-l">Total XP</div></div>
          <div class="stat"><div class="stat-v" id="questV">0/3</div><div class="stat-l">Quests</div></div>
        </div>
        <div class="xpbar"><div class="xpfill" id="xpFill" style="width:0%"></div></div>
      </div>

      <div class="card">
        <div class="card-title">⭐ Today's quests</div>
        <div id="homeQuests"></div>
      </div>

      <div class="card">
        <div class="card-title">💡 Tip of the day</div>
        <div class="daily" id="tipLine"></div>
      </div>

      <div class="card">
        <div class="card-title">😂 Dad joke of the day</div>
        <div class="daily"><span class="daily-emoji">🤣</span><span id="jokeLine"></span></div>
        <button class="jokebtn" onclick="newJoke()">🎲 New joke</button>
      </div>

      <div class="actions">
        <button class="abtn" onclick="go('/games')">🎮 Games</button>
        <button class="abtn" onclick="go('/practice')">🎯 Practice</button>
        <button class="abtn" onclick="go('/lessons')">🎓 Lessons</button>
      </div>
      <div style="height:90px"></div>

      <script>
        var INSPIRE = ${JSON.stringify(INSPIRATION)};
        var JOKES = ${JSON.stringify(JOKES)};
        var TIPS = ${JSON.stringify(TIPS)};

        var NATIVE_XP = ${nativeXp};
        function daySeed() {
          var d = new Date();
          return d.getFullYear() * 372 + (d.getMonth() + 1) * 31 + d.getDate();
        }
        function pickDaily(arr) { return arr[daySeed() % arr.length]; }
        function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

        function getXP() { return parseInt(localStorage.getItem('tt_xp') || '0', 10); }
        function questKey() {
          var d = new Date();
          return 'tt_quests_' + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        }
        function calcStreak() {
          var days = [];
          try { days = JSON.parse(localStorage.getItem('tt_days') || '[]'); } catch (e) {}
          var set = {};
          days.forEach(function(d) { set[d] = true; });
          var key = function(dt) { return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate(); };
          var d = new Date();
          if (!set[key(d)]) d.setDate(d.getDate() - 1);
          var s = 0;
          while (set[key(d)]) { s++; d.setDate(d.getDate() - 1); }
          return s;
        }

        function go(route) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'nav', route: route }));
        }

        var jokeIdx = -1;
        function showJoke() {
          document.getElementById('jokeLine').innerText = JOKES[jokeIdx];
        }
        function newJoke() {
          if (JOKES.length < 2) return;
          var next = jokeIdx;
          while (next === jokeIdx) next = Math.floor(Math.random() * JOKES.length);
          jokeIdx = next;
          showJoke();
        }

        function confettiBurst() {
          var c = document.createElement('canvas');
          c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
          document.body.appendChild(c);
          var ctx = c.getContext('2d');
          c.width = innerWidth; c.height = innerHeight;
          var colors = ['#A78BFA','#10B981','#F59E0B','#EF4444','#3B82F6','#EC4899'];
          var parts = [];
          for (var i = 0; i < 130; i++) {
            parts.push({
              x: innerWidth / 2 + (Math.random() - 0.5) * 120,
              y: innerHeight * 0.32,
              vx: (Math.random() - 0.5) * 15,
              vy: Math.random() * -12 - 3,
              s: Math.random() * 8 + 4,
              r: Math.random() * Math.PI,
              vr: (Math.random() - 0.5) * 0.3,
              col: colors[i % colors.length],
              life: 1
            });
          }
          var frames = 0;
          (function tick() {
            ctx.clearRect(0, 0, c.width, c.height);
            var alive = false;
            parts.forEach(function(pt) {
              pt.vy += 0.35; pt.x += pt.vx; pt.y += pt.vy; pt.r += pt.vr; pt.life -= 0.009;
              if (pt.life > 0 && pt.y < c.height + 24) {
                alive = true;
                ctx.save(); ctx.translate(pt.x, pt.y); ctx.rotate(pt.r);
                ctx.globalAlpha = Math.max(0, pt.life);
                ctx.fillStyle = pt.col;
                ctx.fillRect(-pt.s / 2, -pt.s / 2, pt.s, pt.s * 0.62);
                ctx.restore();
              }
            });
            if (alive && frames++ < 420) requestAnimationFrame(tick);
            else { ctx.clearRect(0, 0, c.width, c.height); c.remove(); }
          })();
        }

        (function init() {
          var h = new Date().getHours();
          var greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
          document.getElementById('greetWord').innerText = greet;
          document.getElementById('inspireLine').innerText = pickRandom(INSPIRE);
          document.getElementById('tipLine').innerText = pickDaily(TIPS);
          jokeIdx = Math.floor(Math.random() * JOKES.length);
          showJoke();

          var xp = NATIVE_XP;
          var lvl = Math.floor(xp / 500) + 1;
          document.getElementById('levelLine').innerText = 'Level ' + lvl + ' • ' + xp + ' XP';
          document.getElementById('xpV').innerText = xp;
          document.getElementById('xpFill').style.width = ((xp % 500) / 500 * 100) + '%';
          document.getElementById('streakV').innerText = calcStreak();

          var names = ['🎺 Play 5 notes in the tuner', '🎯 Score 600 in Note Match', '🤖 Ask the coach 2 questions'];
          var targets = [5, 600, 2];
          var q = {};
          try { q = JSON.parse(localStorage.getItem(questKey()) || '{}'); } catch (e) {}
          var done = 0, html = '';
          for (var i = 0; i < 3; i++) {
            var id = ['warmup', 'sharp', 'curious'][i];
            var cur = Math.min(q[id] || 0, targets[i]);
            var isDone = cur >= targets[i];
            if (isDone) done++;
            html += '<div class="qrow"><span>' + names[i] + '</span><span class="' + (isDone ? 'qdone' : '') + '">' + (isDone ? '✓' : cur + '/' + targets[i]) + '</span></div>';
          }
          document.getElementById('homeQuests').innerHTML = html;
          document.getElementById('questV').innerText = done + '/3';

          // staggered entrance
          var cards = document.querySelectorAll('.card');
          for (var ci = 0; ci < cards.length; ci++) {
            cards[ci].style.animationDelay = (0.08 + ci * 0.09) + 's';
          }

          // confetti when all quests are newly complete
          var qk = questKey();
          if (done === 3 && localStorage.getItem('tt_confetti') !== qk) {
            localStorage.setItem('tt_confetti', qk);
            setTimeout(confettiBurst, 650);
          }
        })();
      </script>
    </body>
    </html>
  `, [profile.name, profile.avatar, isDarkMode, nativeXp, accent, bgCol, textCol, subTextCol, inputBg, borderCol, cardBg]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgCol }]}>
      <View style={styles.container}>
        <WebView
          source={{ html, baseUrl: "https://example.com" }}
          originWhitelist={["*"]}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onMessage={(event) => {
            try {
              const msg = JSON.parse(event.nativeEvent.data);
              if (msg?.type === "nav" && typeof msg.route === "string") {
                if (msg.route === "/games") router.push("/games");
                else if (msg.route === "/lessons") router.push("/lessons");
                else if (msg.route === "/practice") router.push("/practice");
                else if (msg.route === "/profile") router.push("/profile");
              }
            } catch {
              // ignore malformed WebView messages
            }
          }}
          style={styles.webview}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingBottom: 75 },
  webview: { opacity: 0.99, overflow: "hidden" },
});
