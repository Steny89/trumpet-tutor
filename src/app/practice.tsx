import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { PermissionsAndroid, Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useTheme } from "../context/ThemeContext";
import { awardXP, getStoredXP } from "../constants/xp";
import { COACH_PROXY_KEY, COACH_PROXY_URL } from "../constants/coach";


const FINGERING_CHART = [
  {
    note: "F#3 / Gb3",
    pitchHz: "185 Hz",
    valves: "1-2-3",
    execution: "Relax embouchure, fast cool air column.",
  },
  {
    note: "G3",
    pitchHz: "196 Hz",
    valves: "1-3",
    execution: "Slightly drop jaw, firm corners.",
  },
  {
    note: "A3",
    pitchHz: "220 Hz",
    valves: "1-2",
    execution: "Balanced lip tension, steady breath.",
  },
  {
    note: "Bb3",
    pitchHz: "233 Hz",
    valves: "1",
    execution: "Focus air stream downward into mouthpiece.",
  },
  {
    note: "B3",
    pitchHz: "246 Hz",
    valves: "2",
    execution: "Quick slight corner pinch for stability.",
  },
  {
    note: "C4 (Middle C)",
    pitchHz: "261 Hz",
    valves: "0 (Open)",
    execution: "Natural relaxed aperture, centered tone.",
  },
  {
    note: "D4",
    pitchHz: "293 Hz",
    valves: "1-3",
    execution: "Increase air speed slightly for second partial.",
  },
  {
    note: "E4",
    pitchHz: "329 Hz",
    valves: "1-2",
    execution: "Firm corners, keep tongue arch high.",
  },
  {
    note: "F4",
    pitchHz: "349 Hz",
    valves: "1",
    execution: "Focused air stream, stable intonation.",
  },
  {
    note: "G4",
    pitchHz: "392 Hz",
    valves: "0 (Open)",
    execution: "Open throat, fast compressed air.",
  },
  {
    note: "A4",
    pitchHz: "440 Hz",
    valves: "1-2",
    execution: "Firm aperture compression, steady support.",
  },
  {
    note: "Bb4",
    pitchHz: "466 Hz",
    valves: "1",
    execution: "Controlled velocity air column.",
  },
  {
    note: "C5 (High C)",
    pitchHz: "523 Hz",
    valves: "0 (Open)",
    execution: "High tongue arch ('ee' vowel), firm corners.",
  },
];

export default function App() {
  const [targetNote, setTargetNote] = useState("None");
  const [targetValves, setTargetValves] = useState("");
  const [targetExec, setTargetExec] = useState("");
  const webViewRef = useRef<WebView | null>(null);
  const { isDarkMode } = useTheme();
  const [nativeXp, setNativeXp] = useState(0);

  useFocusEffect(
    useCallback(() => {
      async function requestPermissionsAndLoad() {
        if (Platform.OS === "android") {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          );
        }
        const savedNote = await AsyncStorage.getItem("target_practice_note");
        const savedValves = await AsyncStorage.getItem(
          "target_practice_valves",
        );
        const savedExec = await AsyncStorage.getItem("target_practice_exec");

        if (savedNote) setTargetNote(savedNote);
        if (savedValves) setTargetValves(savedValves);
        if (savedExec) setTargetExec(savedExec);

        setNativeXp(await getStoredXP());
      }
      requestPermissionsAndLoad();
    }, []),
  );

  const injectAiMessage = useCallback((text: string) => {
    webViewRef.current?.injectJavaScript(
      `window.appendAiMessage(${JSON.stringify(text)}); true;`,
    );
  }, []);

  const handleChatMessage = useCallback(
    async (userText: string) => {
      webViewRef.current?.injectJavaScript(`window.showTyping(); true;`);

      // Preferred path: family proxy (key stays server-side)
      const proxyUrl = COACH_PROXY_URL.replace(/\/$/, "");
      if (proxyUrl) {
        try {
          const proxyHeaders: Record<string, string> = {
            "Content-Type": "application/json",
          };
          if (COACH_PROXY_KEY) proxyHeaders["x-proxy-key"] = COACH_PROXY_KEY;
          const res = await fetch(`${proxyUrl}/coach`, {
            method: "POST",
            headers: proxyHeaders,
            body: JSON.stringify({ message: userText }),
          });
          if (!res.ok) throw new Error(`Coach proxy returned ${res.status}`);
          const data = await res.json();
          const reply = (data?.reply || "").toString().trim();
          injectAiMessage(
            reply || "Hmm, I didn't catch that — try asking again.",
          );
        } catch {
          injectAiMessage(
            "Couldn't reach the AI coach. Check your connection and try again.",
          );
        }
        return;
      }

      // No proxy configured — the coach needs the family server set up.
      injectAiMessage("The AI coach isn't connected yet.");
    },
    [injectAiMessage],
  );

  const bgCol = isDarkMode ? "#130E20" : "#F8FAFC";
  const cardBg = isDarkMode ? "#1E1832" : "#FFFFFF";
  const textCol = isDarkMode ? "#F1F5F9" : "#1E293B";
  const subTextCol = isDarkMode ? "#A79BD0" : "#64748B";
  const inputBg = isDarkMode ? "#2B2145" : "#F1F5F9";
  const borderCol = isDarkMode ? "#3A2F5C" : "#E2E8F0";

  const htmlContent = useMemo(() => {
    const optionsHtml = FINGERING_CHART.map(
      (item) =>
        `<option value="${item.note}" ${targetNote === item.note ? "selected" : ""}>${item.note} (Valves: ${item.valves})</option>`,
    ).join("");
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <style>
        html, body { 
          height: 100%;
          margin: 0; 
          padding: 12px; 
          background-color: ${bgCol}; 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
          display: flex; 
          flex-direction: column; 
          color: ${textCol}; 
          box-sizing: border-box; 
          overflow-y: auto;
        }
        * { box-sizing: border-box; }
        .header { 
          display: flex; 
          width: 100%; 
          justify-content: space-between; 
          align-items: center; 
          background: linear-gradient(135deg, ${cardBg}, ${isDarkMode ? "#242B3D" : "#E2E8F0"}); 
          padding: 10px 14px; 
          border-radius: 12px; 
          box-shadow: 0 4px 10px rgba(0,0,0,0.06); 
          margin-bottom: 8px; 
          border: 1px solid ${borderCol};
        }
        .title { font-size: 15px; font-weight: 800; color: ${textCol}; letter-spacing: 0.3px; white-space: nowrap; }
        .badge { font-size: 9px; font-weight: 700; color: #10B981; background: ${isDarkMode ? "rgba(16,185,129,0.15)" : "#D1FAE5"}; padding: 3px 7px; border-radius: 20px; text-transform: uppercase; white-space: nowrap; }
        
        .card { 
          background-color: ${isDarkMode ? "rgba(58, 40, 108, 0.55)" : cardBg}; 
          padding: 12px; 
          border-radius: 14px; 
          width: 100%; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.04); 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          border: 1px solid ${borderCol};
          margin-bottom: 8px;
        }
        .dropdown { width: 100%; padding: 7px 10px; border-radius: 8px; border: 1px solid ${borderCol}; font-size: 12px; margin-bottom: 6px; background: ${inputBg}; color: ${textCol}; font-weight: 600; outline: none; }
        
        .guide-box { width: 100%; background: ${isDarkMode ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.06)"}; border-radius: 10px; padding: 8px 10px; margin-bottom: 8px; border: 1px solid rgba(59, 130, 246, 0.3); font-size: 11px; font-weight: 600; color: #3B82F6; }
        
        .note-display-box { width: 100%; background: ${isDarkMode ? "rgba(59, 130, 246, 0.08)" : "rgba(59, 130, 246, 0.05)"}; border-radius: 10px; padding: 6px; text-align: center; border: 1px dashed #3B82F6; margin-bottom: 6px; }
        .note-display { font-size: 32px; font-weight: 900; color: #3B82F6; line-height: 1.1; }
        .pitch-hz { font-size: 11px; color: ${subTextCol}; margin-top: 2px; font-weight: 600; text-transform: uppercase; }
        
        .stats-row { display: flex; gap: 6px; width: 100%; margin-bottom: 6px; }
        .stat-box { flex: 1; background: ${inputBg}; padding: 5px; border-radius: 8px; text-align: center; border: 1px solid ${borderCol}; }
        .stat-val { font-size: 13px; font-weight: 800; color: #3B82F6; }
        .stat-lbl { font-size: 8px; color: ${subTextCol}; text-transform: uppercase; font-weight: 700; }

        .btn-group { display: flex; gap: 6px; width: 100%; }
        .btn { background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; padding: 10px; font-size: 13px; border-radius: 10px; font-weight: 700; cursor: pointer; flex: 1; box-shadow: 0 3px 8px rgba(16, 185, 129, 0.3); text-align: center; }
        .btn-stop { background: linear-gradient(135deg, #EF4444, #DC2626); box-shadow: 0 3px 8px rgba(239, 68, 68, 0.3); }
        
        .chat-container { flex: 1; width: 100%; background: ${cardBg}; border-radius: 14px; padding: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); border: 1px solid ${borderCol}; display: flex; flex-direction: column; min-height: 140px; }
        .chat-header { font-size: 12px; font-weight: 800; color: #3B82F6; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
        .chat-log { flex: 1; overflow-y: auto; font-size: 11px; text-align: left; margin-bottom: 6px; padding-right: 4px; display: flex; flex-direction: column; gap: 4px; }
        .msg { margin: 0; padding: 6px 8px; border-radius: 6px; line-height: 1.3; }
        .ai { background: ${isDarkMode ? "#253342" : "#EFF6FF"}; border-left: 3px solid #3B82F6; color: ${isDarkMode ? "#93C5FD" : "#1E40AF"}; font-weight: 500; }
        .user { background: ${isDarkMode ? "#3A2F5C" : "#F1F5F9"}; text-align: right; color: ${textCol}; font-weight: 500; }
        .chat-input-row { display: flex; gap: 6px; }
        .chat-input { flex: 1; padding: 7px 10px; border: 1px solid ${borderCol}; border-radius: 8px; font-size: 11px; background: ${inputBg}; color: ${textCol}; outline: none; }
        .chat-btn { background: #3B82F6; color: white; border: none; padding: 7px 12px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 11px; }

        .hidden { display: none !important; }
        .mode-tabs { display: flex; gap: 6px; width: 100%; margin-bottom: 8px; }
        .mode-tab { flex: 1; padding: 9px 4px; border-radius: 10px; border: 1px solid ${borderCol}; background: ${cardBg}; color: ${subTextCol}; font-size: 11px; font-weight: 800; cursor: pointer; }
        .mode-tab.active { background: #3B82F6; border-color: #3B82F6; color: #fff; }

        .game-top { display: flex; gap: 6px; width: 100%; margin-bottom: 8px; }
        .game-top > div { flex: 1; background: ${inputBg}; border: 1px solid ${borderCol}; border-radius: 8px; padding: 5px; text-align: center; }
        .game-target { font-size: 64px; font-weight: 900; color: #3B82F6; text-align: center; line-height: 1.15; }
        .game-target.hit { animation: pop 0.45s ease; }
        @keyframes pop { 0% { transform: scale(1); } 40% { transform: scale(1.3); color: #10B981; } 100% { transform: scale(1); } }
        .game-hint { font-size: 11px; color: ${subTextCol}; text-align: center; margin: 4px 0 8px; font-weight: 600; min-height: 15px; }
        .game-result { font-size: 14px; font-weight: 800; text-align: center; margin-top: 8px; color: ${textCol}; min-height: 20px; }

        .highway { position: relative; width: 100%; height: 220px; background: ${inputBg}; border: 1px solid ${borderCol}; border-radius: 10px; overflow: hidden; margin-bottom: 8px; }
        .hit-line { position: absolute; left: 0; right: 0; top: 78%; height: 3px; background: #3B82F6; opacity: 0.7; }
        .hw-note { position: absolute; left: 50%; transform: translateX(-50%); background: #3B82F6; color: #fff; font-weight: 800; font-size: 14px; padding: 6px 16px; border-radius: 20px; white-space: nowrap; box-shadow: 0 2px 6px rgba(59,130,246,0.4); }
        .hw-note.hit { background: #10B981; box-shadow: 0 2px 6px rgba(16,185,129,0.4); }
        .hw-note.missed { background: #EF4444; opacity: 0.55; box-shadow: none; }

        .quest-head { font-size: 12px; font-weight: 800; color: ${textCol}; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
        .quest-head span:last-child { color: #3B82F6; font-size: 11px; }
        .quest { margin-bottom: 8px; }
        .quest:last-child { margin-bottom: 0; }
        .quest-row { display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: ${textCol}; margin-bottom: 3px; }
        .quest-row .done { color: #10B981; }
        .quest-bar { height: 8px; background: ${inputBg}; border-radius: 4px; overflow: hidden; border: 1px solid ${borderCol}; }
        .quest-fill { height: 100%; background: linear-gradient(90deg, #3B82F6, #10B981); border-radius: 4px; transition: width 0.3s; }
        .btn { transition: transform 0.12s ease; -webkit-tap-highlight-color: transparent; }
        .btn:active { transform: scale(0.94); }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">🎺 Trumpet Master</div>
        <div class="badge">Live Studio</div>
      </div>

      <div class="mode-tabs">
        <button class="mode-tab active" id="tabTuner" onclick="setMode('tuner')">🎯 Tuner</button>
        <button class="mode-tab" id="tabGame" onclick="setMode('game')">🎮 Note Match</button>
        <button class="mode-tab" id="tabSong" onclick="setMode('song')">🎵 Play-Along</button>
      </div>

      <div id="panelTuner">
      <div class="card">
        <div style="font-size:9px; font-weight:800; text-align:left; width: 100%; color:${subTextCol}; margin-bottom:3px; text-transform: uppercase;">Target Objective:</div>
        <select id="noteSelector" class="dropdown" onchange="onNoteChange(this)">
          <option value="None" ${targetNote === "None" ? "selected" : ""}>None (Free Practice)</option>
          ${optionsHtml}
        </select>

        <div class="guide-box" id="guideBox" style="display: ${targetNote === "None" ? "none" : "block"};">
          <b>Valves:</b> <span id="valvesText">${targetValves || "Open"}</span><br/>
          <b>Execution:</b> <span id="execText">${targetExec || "Keep air stream steady."}</span>
        </div>

        <div class="note-display-box">
          <div class="note-display" id="noteDisplay">--</div>
          <div class="pitch-hz" id="pitchDisplay">Awaiting Audio Input</div>
        </div>

        <div class="stats-row">
          <div class="stat-box">
            <div class="stat-val" id="notesHitCount">0</div>
            <div class="stat-lbl">Notes Hit</div>
          </div>
          <div class="stat-box">
            <div class="stat-val" id="sessionTime">00:00</div>
            <div class="stat-lbl">Session Time</div>
          </div>
          <div class="stat-box">
            <div class="stat-val" id="levelDisplay">1</div>
            <div class="stat-lbl">Level</div>
          </div>
        </div>

        <div class="btn-group">
          <button class="btn" id="startBtn" onclick="startAudio()">▶ Start Live Tuner</button>
          <button class="btn btn-stop" id="stopBtn" onclick="stopAudio()" style="display:none;">■ Stop Tuner</button>
        </div>
      </div>
      </div>

      <div id="panelGame" class="hidden">
      <div class="card">
        <div class="game-top">
          <div><div class="stat-lbl">Round</div><div class="stat-val" id="gameRound">–</div></div>
          <div><div class="stat-lbl">Score</div><div class="stat-val" id="gameScore">0</div></div>
          <div><div class="stat-lbl">Best</div><div class="stat-val" id="gameBest">0</div></div>
        </div>
        <div class="game-target" id="gameTarget">?</div>
        <div class="game-hint" id="gameHint">Tap Start and play the note you see!</div>
        <div class="btn-group">
          <button class="btn" id="gameStartBtn" onclick="startNoteGame()">▶ Start Game</button>
          <button class="btn btn-stop" id="gameQuitBtn" onclick="quitNoteGame()" style="display:none;">■ Quit</button>
        </div>
        <div class="game-result" id="gameResult"></div>
      </div>
      </div>

      <div id="panelSong" class="hidden">
      <div class="card">
        <select id="songSelector" class="dropdown"></select>
        <div class="highway" id="highway"><div class="hit-line"></div></div>
        <div class="stats-row">
          <div class="stat-box"><div class="stat-val" id="songScore">0</div><div class="stat-lbl">Score</div></div>
          <div class="stat-box"><div class="stat-val" id="songCombo">0</div><div class="stat-lbl">Combo</div></div>
          <div class="stat-box"><div class="stat-val" id="songAcc">–</div><div class="stat-lbl">Accuracy</div></div>
        </div>
        <div class="btn-group">
          <button class="btn" id="songStartBtn" onclick="startPlayAlong()">▶ Play Song</button>
          <button class="btn btn-stop" id="songStopBtn" onclick="stopPlayAlong()" style="display:none;">■ Stop</button>
        </div>
      </div>
      </div>

      <div class="card">
        <div class="quest-head"><span>⭐ Today's Quests</span><span id="xpTotal">0 XP</span></div>
        <div id="questList"></div>
      </div>

      <div class="chat-container">
        <div class="chat-header">🤖 AI Practice Coach</div>
        <div class="chat-log" id="chatLog">
          <div class="msg ai">Ready when you are! Fire up the tuner or ask me for embouchure tips.</div>
        </div>
        <div class="chat-input-row">
          <input type="text" id="chatInput" class="chat-input" placeholder="Ask your coach anything..." />
          <button class="chat-btn" onclick="sendChat()">Send</button>
        </div>
      </div>

      <script>
        const chartData = ${JSON.stringify(FINGERING_CHART)};

        function onNoteChange(sel) {
          const val = sel.value;
          const guideBox = document.getElementById('guideBox');
          const valvesText = document.getElementById('valvesText');
          const execText = document.getElementById('execText');

          if (val === "None") {
            guideBox.style.display = "none";
          } else {
            const match = chartData.find(item => item.note === val);
            if (match) {
              valvesText.innerText = match.valves;
              execText.innerText = match.execution;
              guideBox.style.display = "block";
            }
          }
        }

        let mediaStream = null;
        let audioCtx = null;
        let analyser = null;
        let isListening = false;
        let timerInterval = null;
        let secondsElapsed = 0;
        let notesHit = 0;
        let lastPitchNote = "";

        function formatTime(sec) {
          const m = Math.floor(sec / 60).toString().padStart(2, '0');
          const s = (sec % 60).toString().padStart(2, '0');
          return m + ':' + s;
        }

        function getNoteName(frequency) {
          const notes = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
          const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
          const midiNote = Math.round(noteNum) + 69;
          return notes[midiNote % 12];
        }

        function autoCorrelate(buf, sampleRate) {
          let SIZE = buf.length;
          let sumOfSquares = 0;
          for (let i = 0; i < SIZE; i++) sumOfSquares += buf[i] * buf[i];
          let rootMeanSquare = Math.sqrt(sumOfSquares / SIZE);
          if (rootMeanSquare < 0.01) return -1;

          let r1 = 0, r2 = SIZE - 1, threshold = 0.2;
          for (let i = 0; i < SIZE / 2; i++) { if (Math.abs(buf[i]) < threshold) { r1 = i; break; } }
          for (let i = 1; i < SIZE / 2; i++) { if (Math.abs(buf[SIZE - i]) < threshold) { r2 = SIZE - i; break; } }

          buf = buf.slice(r1, r2);
          SIZE = buf.length;
          let c = new Array(SIZE).fill(0);
          for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE - i; j++) { c[i] = c[i] + buf[j] * buf[j + i]; }
          }
          let d = 0;
          while (c[d] > c[d + 1]) d++;
          let maxval = -1, maxpos = -1;
          for (let i = d; i < SIZE; i++) { if (c[i] > maxval) { maxval = c[i]; maxpos = i; } }
          return sampleRate / maxpos;
        }

        function escapeHtml(s) {
          return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        window.sendChat = function() {
          const input = document.getElementById('chatInput');
          const log = document.getElementById('chatLog');
          const text = input.value.trim();
          if(!text) return;
          log.innerHTML += '<div class="msg user">' + escapeHtml(text) + '</div>';
          input.value = '';
          log.scrollTop = log.scrollHeight;
          bumpQuest('curious', 1);
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'chat', text: text }));
        }

        window.showTyping = function() {
          const log = document.getElementById('chatLog');
          if (document.getElementById('typingRow')) return;
          log.innerHTML += '<div class="msg ai" id="typingRow">Thinking…</div>';
          log.scrollTop = log.scrollHeight;
        }

        window.appendAiMessage = function(text) {
          const log = document.getElementById('chatLog');
          const typing = document.getElementById('typingRow');
          if (typing) typing.remove();
          log.innerHTML += '<div class="msg ai">' + escapeHtml(text) + '</div>';
          log.scrollTop = log.scrollHeight;
        }

        window.startAudio = async function() {
          try {
            document.getElementById('pitchDisplay').innerText = 'Requesting Microphone...';
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
              throw new Error("Microphone API not supported.");
            }
            mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') { await audioCtx.resume(); }

            const source = audioCtx.createMediaStreamSource(mediaStream);
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 2048;
            source.connect(analyser);

            document.getElementById('startBtn').style.display = 'none';
            document.getElementById('stopBtn').style.display = 'inline-block';
            isListening = true;
            document.getElementById('pitchDisplay').innerText = 'Listening actively...';

            secondsElapsed = 0;
            notesHit = 0;
            document.getElementById('notesHitCount').innerText = notesHit;
            timerInterval = setInterval(() => {
              secondsElapsed++;
              document.getElementById('sessionTime').innerText = formatTime(secondsElapsed);
            }, 1000);

            let lastDetected = "";
            const buf = new Float32Array(2048);
            function updatePitch() {
              if (!isListening) return;
              analyser.getFloatTimeDomainData(buf);
              let acPitch = autoCorrelate(buf, audioCtx.sampleRate);
              
              const selectedTarget = document.getElementById('noteSelector').value;

              if (acPitch !== -1 && acPitch > 50 && acPitch < 2000) {
                let currentNote = getNoteName(acPitch);
                lastPitchNote = currentNote;
                document.getElementById('noteDisplay').innerText = currentNote;
                document.getElementById('pitchDisplay').innerText = Math.round(acPitch) + ' Hz • Active Pitch';

                let targetNoteBase = selectedTarget.split(" ")[0].replace(/[^A-G#b]/gi, "");
                let matchesTarget = (selectedTarget === "None") || (currentNote.toUpperCase() === targetNoteBase.toUpperCase());

                if (matchesTarget && currentNote !== lastDetected) {
                  notesHit++;
                  document.getElementById('notesHitCount').innerText = notesHit;
                  lastDetected = currentNote;
                  bumpQuest('warmup', 1);
                }

                gamePitchHook(currentNote);
              }
              requestAnimationFrame(updatePitch);
            }
            updatePitch();
          } catch (err) {
            document.getElementById('pitchDisplay').innerText = 'Error: ' + err.message;
          }
        };

        window.stopAudio = function() {
          isListening = false;
          clearInterval(timerInterval);
          if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
          if (audioCtx) audioCtx.close();
          document.getElementById('noteDisplay').innerText = '--';
          document.getElementById('pitchDisplay').innerText = 'Awaiting Audio Input';
          document.getElementById('startBtn').style.display = 'inline-block';
          document.getElementById('stopBtn').style.display = 'none';
        };

        /* ================= Mode tabs ================= */
        function setMode(m) {
          var modes = ['tuner', 'game', 'song'];
          modes.forEach(function(k) {
            var cap = k.charAt(0).toUpperCase() + k.slice(1);
            document.getElementById('panel' + cap).classList.toggle('hidden', k !== m);
            document.getElementById('tab' + cap).classList.toggle('active', k === m);
          });
          if (m !== 'song') stopPlayAlong();
          if (m !== 'game') gameActive = false;
        }

        /* ================= XP & levels ================= */
        var NATIVE_XP = ${nativeXp};
        var sessionXP = 0;
        function getXP() { return NATIVE_XP + sessionXP; }
        function addXP(n) {
          sessionXP += n;
          renderLevel();
          touchDay();
          try { window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'xp', delta: n })); } catch (e) {}
        }
        function touchDay() {
          var d = new Date();
          var today = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
          var days = [];
          try { days = JSON.parse(localStorage.getItem('tt_days') || '[]'); } catch (e) {}
          if (days.indexOf(today) === -1) {
            days.push(today);
            localStorage.setItem('tt_days', JSON.stringify(days.slice(-90)));
          }
        }
        function renderLevel() {
          var lvl = Math.floor(getXP() / 500) + 1;
          var el = document.getElementById('levelDisplay');
          if (el) el.innerText = lvl;
          var xt = document.getElementById('xpTotal');
          if (xt) xt.innerText = getXP() + ' XP';
        }

        /* ================= Daily quests ================= */
        var QUEST_DEFS = [
          { id: 'warmup', icon: '🎺', text: 'Play 5 notes in the tuner', target: 5 },
          { id: 'sharp', icon: '🎯', text: 'Score 600 in Note Match', target: 600 },
          { id: 'curious', icon: '🤖', text: 'Ask the coach 2 questions', target: 2 }
        ];
        function questKey() {
          var d = new Date();
          return 'tt_quests_' + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        }
        function loadQuests() {
          try { return JSON.parse(localStorage.getItem(questKey()) || '{}'); }
          catch (e) { return {}; }
        }
        function saveQuests(q) { localStorage.setItem(questKey(), JSON.stringify(q)); }
        function confettiBurst() {
          var c = document.createElement('canvas');
          c.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
          document.body.appendChild(c);
          var ctx = c.getContext('2d');
          c.width = innerWidth; c.height = innerHeight;
          var colors = ['#A78BFA','#10B981','#F59E0B','#EF4444','#3B82F6','#EC4899'];
          var parts = [];
          for (var i = 0; i < 110; i++) {
            parts.push({
              x: innerWidth / 2 + (Math.random() - 0.5) * 120,
              y: innerHeight * 0.3,
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
        function bumpQuest(id, n) {
          var def = null;
          QUEST_DEFS.forEach(function(d) { if (d.id === id) def = d; });
          if (!def) return;
          var q = loadQuests();
          var cur = q[id] || 0;
          if (cur >= def.target) return;
          var next = (id === 'sharp') ? Math.max(cur, n) : cur + n;
          q[id] = Math.min(next, def.target);
          if (q[id] >= def.target && !q['done_' + id]) {
            q['done_' + id] = true;
            addXP(50);
            setTimeout(confettiBurst, 250);
          }
          saveQuests(q);
          renderQuests();
        }
        function renderQuests() {
          var q = loadQuests();
          var list = document.getElementById('questList');
          if (!list) return;
          var html = '';
          QUEST_DEFS.forEach(function(def) {
            var cur = Math.min(q[def.id] || 0, def.target);
            var pct = Math.round((cur / def.target) * 100);
            var done = cur >= def.target;
            html += '<div class="quest"><div class="quest-row"><span>' + def.icon + ' ' + def.text + '</span>' +
              '<span class="' + (done ? 'done' : '') + '">' + (done ? '✓ Done +50 XP' : cur + '/' + def.target) + '</span></div>' +
              '<div class="quest-bar"><div class="quest-fill" style="width:' + pct + '%"></div></div></div>';
          });
          list.innerHTML = html;
          renderLevel();
        }

        /* ================= Note Match game ================= */
        var GAME_POOL = ['C', 'D', 'E', 'F', 'G'];
        var gameActive = false, gameTargets = [], gameIdx = 0, gameScore = 0, gameNoteT0 = 0, gameLocked = false;

        function valveHintFor(letter) {
          var map = { C: 'C4 (Middle C)', D: 'D4', E: 'E4', F: 'F4', G: 'G4' };
          var found = null;
          chartData.forEach(function(x) { if (x.note === map[letter]) found = x; });
          return found ? found.valves : '';
        }

        async function startNoteGame() {
          if (!isListening) {
            document.getElementById('gameHint').innerText = 'Starting microphone…';
            await window.startAudio();
            if (!isListening) {
              document.getElementById('gameHint').innerText = 'Microphone needed to play!';
              return;
            }
          }
          gameTargets = [];
          for (var i = 0; i < 8; i++) gameTargets.push(GAME_POOL[Math.floor(Math.random() * GAME_POOL.length)]);
          gameIdx = 0; gameScore = 0; gameActive = true; gameLocked = false;
          document.getElementById('gameScore').innerText = '0';
          document.getElementById('gameRound').innerText = '1/8';
          document.getElementById('gameResult').innerText = '';
          document.getElementById('gameStartBtn').style.display = 'none';
          document.getElementById('gameQuitBtn').style.display = '';
          showGameTarget();
        }

        function showGameTarget() {
          var t = gameTargets[gameIdx];
          var el = document.getElementById('gameTarget');
          el.innerText = t;
          el.classList.remove('hit');
          void el.offsetWidth;
          document.getElementById('gameHint').innerText = 'Valves: ' + valveHintFor(t) + ' — play the note!';
          gameNoteT0 = Date.now();
          gameLocked = false;
        }

        function gamePitchHook(note) {
          if (!gameActive || gameLocked) return;
          if (note === gameTargets[gameIdx]) {
            gameLocked = true;
            var secs = (Date.now() - gameNoteT0) / 1000;
            var pts = Math.max(25, 100 - Math.round(secs * 5));
            gameScore += pts;
            document.getElementById('gameScore').innerText = gameScore;
            document.getElementById('gameTarget').classList.add('hit');
            document.getElementById('gameHint').innerText = '+' + pts + ' pts! Nice!';
            setTimeout(function() {
              gameIdx++;
              if (gameIdx >= gameTargets.length) { endNoteGame(); }
              else {
                document.getElementById('gameRound').innerText = (gameIdx + 1) + '/' + gameTargets.length;
                showGameTarget();
              }
            }, 650);
          }
        }

        function endNoteGame() {
          gameActive = false;
          var startBtn = document.getElementById('gameStartBtn');
          startBtn.style.display = '';
          startBtn.innerText = '▶ Play Again';
          document.getElementById('gameQuitBtn').style.display = 'none';
          var best = parseInt(localStorage.getItem('tt_best') || '0', 10);
          if (gameScore > best) localStorage.setItem('tt_best', String(gameScore));
          document.getElementById('gameBest').innerText = Math.max(best, gameScore);
          var stars = gameScore >= 700 ? '★★★' : gameScore >= 500 ? '★★☆' : '★☆☆';
          document.getElementById('gameResult').innerText = stars + '  Round over! Score: ' + gameScore;
          document.getElementById('gameHint').innerText = 'Tap Play Again for another round!';
          addXP(Math.round(gameScore / 10));
          bumpQuest('sharp', gameScore);
        }

        function quitNoteGame() {
          gameActive = false;
          window.stopAudio();
          document.getElementById('gameQuitBtn').style.display = 'none';
          var startBtn = document.getElementById('gameStartBtn');
          startBtn.style.display = '';
          startBtn.innerText = '▶ Start Game';
          document.getElementById('gameTarget').innerText = '?';
          document.getElementById('gameRound').innerText = '–';
          document.getElementById('gameHint').innerText = 'Tap Start and play the note you see!';
          document.getElementById('gameResult').innerText = '';
        }

        /* ================= Play-Along mode ================= */
        var SONGS = [
          { id: 'hcb', title: 'Hot Cross Buns', beat: 0.55,
            notes: ['E','D','C','E','D','C','C','C','C','D','D','D','D','E','D','C'] },
          { id: 'mary', title: 'Mary Had a Little Lamb', beat: 0.5,
            notes: ['E','D','C','D','E','E','E','D','D','D','E','G','G','E','D','C','D','E','E','E','E','D','D','E','D','C'] },
          { id: 'ode', title: 'Ode to Joy', beat: 0.5,
            notes: ['E','E','F','G','G','F','E','D','C','C','D','E','E','D','D'] }
        ];
        var songPlaying = false, songRAF = 0, songNotes = [], songT0 = 0;
        var songScore = 0, songCombo = 0, songHits = 0, songTotal = 0;

        function buildSongOptions() {
          document.getElementById('songSelector').innerHTML = SONGS.map(function(s) {
            return '<option value="' + s.id + '">' + s.title + '</option>';
          }).join('');
        }

        async function startPlayAlong() {
          if (!isListening) {
            await window.startAudio();
            if (!isListening) return;
          }
          var song = SONGS[0];
          SONGS.forEach(function(s) { if (s.id === document.getElementById('songSelector').value) song = s; });
          var hw = document.getElementById('highway');
          hw.querySelectorAll('.hw-note').forEach(function(n) { n.remove(); });
          songNotes = song.notes.map(function(n, i) {
            var el = document.createElement('div');
            el.className = 'hw-note';
            el.innerText = n;
            hw.appendChild(el);
            return { note: n, time: 1.5 + i * song.beat, el: el, judged: false };
          });
          songT0 = performance.now() / 1000;
          songScore = 0; songCombo = 0; songHits = 0; songTotal = songNotes.length;
          songPlaying = true;
          document.getElementById('songScore').innerText = '0';
          document.getElementById('songCombo').innerText = '0';
          document.getElementById('songAcc').innerText = '–';
          document.getElementById('songStartBtn').style.display = 'none';
          document.getElementById('songStopBtn').style.display = '';
          songLoop();
        }

        function songLoop() {
          if (!songPlaying) return;
          var now = performance.now() / 1000 - songT0;
          var hw = document.getElementById('highway');
          var lineY = hw.clientHeight * 0.78;
          var pxPerSec = hw.clientHeight * 0.55;
          songNotes.forEach(function(sn) {
            var dt = sn.time - now;
            var y = lineY - dt * pxPerSec;
            sn.el.style.top = y + 'px';
            if (!sn.judged && dt < 0.22 && dt > -0.35 && lastPitchNote === sn.note) {
              sn.judged = true;
              sn.el.classList.add('hit');
              songHits++;
              songCombo++;
              songScore += 100 + Math.min(50, songCombo * 5);
            } else if (!sn.judged && dt <= -0.35) {
              sn.judged = true;
              sn.el.classList.add('missed');
              songCombo = 0;
            }
            if (sn.judged && y < -30) sn.el.style.display = 'none';
          });
          document.getElementById('songScore').innerText = songScore;
          document.getElementById('songCombo').innerText = songCombo;
          var lastT = songNotes[songNotes.length - 1].time;
          if (now > lastT + 1.2) { endPlayAlong(); return; }
          songRAF = requestAnimationFrame(songLoop);
        }

        function endPlayAlong() {
          songPlaying = false;
          cancelAnimationFrame(songRAF);
          var startBtn = document.getElementById('songStartBtn');
          startBtn.style.display = '';
          startBtn.innerText = '▶ Play Again';
          document.getElementById('songStopBtn').style.display = 'none';
          var acc = songTotal ? Math.round((songHits / songTotal) * 100) : 0;
          document.getElementById('songAcc').innerText = acc + '%';
          addXP(Math.round(songScore / 20));
          bumpQuest('warmup', songHits);
        }

        function stopPlayAlong() {
          if (!songPlaying) return;
          songPlaying = false;
          cancelAnimationFrame(songRAF);
          document.getElementById('songStartBtn').style.display = '';
          document.getElementById('songStopBtn').style.display = 'none';
        }

        /* ================= init ================= */
        buildSongOptions();
        renderQuests();
        document.getElementById('gameBest').innerText = localStorage.getItem('tt_best') || '0';
        document.getElementById('chatInput').addEventListener('keydown', function(e) {
          if (e.key === 'Enter') window.sendChat();
        });
      </script>
    </body>
    </html>
  `;}, [isDarkMode, targetNote, targetValves, targetExec, bgCol, textCol, subTextCol, inputBg, borderCol, cardBg, nativeXp]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgCol }]}>
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          source={{ html: htmlContent, baseUrl: "https://example.com" }}
          originWhitelist={["*"]}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          androidLayerType="hardware"
          mixedContentMode="always"
          mediaCapturePermissionGrantType="grant"
          onMessage={(event) => {
            try {
              const msg = JSON.parse(event.nativeEvent.data);
              if (
                msg?.type === "chat" &&
                typeof msg.text === "string" &&
                msg.text.trim()
              ) {
                handleChatMessage(msg.text.trim());
              } else if (msg?.type === "xp" && typeof msg.delta === "number") {
                awardXP(msg.delta);
              }
            } catch {
              // ignore malformed WebView messages
            }
          }}
          style={[styles.webview, { backgroundColor: bgCol }]}
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
