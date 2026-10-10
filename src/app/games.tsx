import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { setGamesReset } from "../constants/gameNav";
import { awardXP, getStoredXP } from "../constants/xp";
import { useTheme } from "../context/ThemeContext";

export default function GamesScreen() {
  const { isDarkMode } = useTheme();
  const webViewRef = useRef<WebView>(null);
  const [nativeXp, setNativeXp] = useState(0);

  useEffect(() => {
    getStoredXP().then(setNativeXp);
    setGamesReset(() => {
      webViewRef.current?.injectJavaScript("show('hub');true;");
    });
    return () => setGamesReset(null);
  }, []);

  const bgCol = isDarkMode ? "#130E20" : "#F8FAFC";
  const cardBg = isDarkMode ? "#1E1832" : "#FFFFFF";
  const textCol = isDarkMode ? "#F1F5F9" : "#1E293B";
  const subTextCol = isDarkMode ? "#A79BD0" : "#64748B";
  const inputBg = isDarkMode ? "#2B2145" : "#F1F5F9";
  const borderCol = isDarkMode ? "#3A2F5C" : "#E2E8F0";

  const html = useMemo(() => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <style>
        html, body { margin: 0; padding: 12px; background-color: ${bgCol}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: ${textCol}; box-sizing: border-box; }
        * { box-sizing: border-box; }
        .hidden { display: none !important; }
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .title { font-size: 20px; font-weight: 900; }
        .back { background: ${inputBg}; border: 1px solid ${borderCol}; color: ${textCol}; font-weight: 800; font-size: 12px; padding: 8px 12px; border-radius: 10px; cursor: pointer; }
        .hub { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .gcard { background: ${cardBg}; border: 1px solid ${borderCol}; border-radius: 14px; padding: 14px 10px; text-align: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
        .gcard .e { font-size: 34px; }
        .gcard .n { font-size: 13px; font-weight: 800; margin-top: 6px; }
        .gcard .b { font-size: 10px; font-weight: 600; color: ${subTextCol}; margin-top: 3px; }
        @keyframes tileIn { from { opacity: 0; transform: translateY(16px) scale(0.94); } to { opacity: 1; transform: none; } }
        .gcard { transition: transform 0.12s ease; -webkit-tap-highlight-color: transparent; }
        .gcard:active { transform: scale(0.9); }
        .gcard.enter { animation: tileIn 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        .btn, .tapbtn, .qopt, .mcard { transition: transform 0.12s ease; -webkit-tap-highlight-color: transparent; }
        .btn:active, .tapbtn:active, .qopt:active, .mcard:active { transform: scale(0.94); }
        .card { background: ${isDarkMode ? "rgba(58, 40, 108, 0.55)" : cardBg}; border: 1px solid ${borderCol}; border-radius: 14px; padding: 12px; margin-bottom: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
        .big { font-size: 46px; font-weight: 900; text-align: center; color: #3B82F6; margin: 6px 0; }
        .msg { font-size: 13px; font-weight: 700; text-align: center; color: ${subTextCol}; margin: 6px 0; min-height: 18px; }
        .result { font-size: 15px; font-weight: 800; text-align: center; margin-top: 8px; }
        .btn { background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; padding: 12px; font-size: 14px; border-radius: 10px; font-weight: 800; cursor: pointer; width: 100%; margin-top: 8px; }
        .qopt { display: block; width: 100%; background: ${inputBg}; border: 1px solid ${borderCol}; color: ${textCol}; font-size: 14px; font-weight: 700; padding: 12px; border-radius: 10px; margin-bottom: 8px; cursor: pointer; }
        .statrow { display: flex; gap: 8px; margin-bottom: 8px; }
        .stat { flex: 1; background: ${inputBg}; border: 1px solid ${borderCol}; border-radius: 10px; padding: 8px 4px; text-align: center; }
        .stat-v { font-size: 18px; font-weight: 900; color: #3B82F6; }
        .stat-l { font-size: 9px; font-weight: 700; color: ${subTextCol}; text-transform: uppercase; }
        .mboard { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .mcard { background: #3B82F6; border-radius: 10px; aspect-ratio: 0.85; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .mcard span { font-size: 22px; font-weight: 900; color: #fff; }
        .mcard.open { background: ${inputBg}; border: 2px solid #3B82F6; }
        .mcard.open span { color: ${textCol}; font-size: 15px; }
        .mcard.done { background: #10B981; }
        .mcard.done span { color: #fff; font-size: 15px; }
        .staff { position: relative; height: 110px; background: ${inputBg}; border: 1px solid ${borderCol}; border-radius: 10px; margin-bottom: 10px; overflow: hidden; }
        .sline { position: absolute; left: 8px; right: 8px; height: 2px; background: ${subTextCol}; opacity: 0.6; }
        .nhead { position: absolute; left: 50%; transform: translateX(-50%); font-size: 22px; color: #3B82F6; }
        .ledger { position: absolute; left: 44%; right: 44%; height: 2px; background: ${subTextCol}; }
        .clef { position: absolute; left: 12px; top: 8px; font-size: 44px; color: ${subTextCol}; }
        .rhy-track { position: relative; height: 64px; background: ${inputBg}; border: 1px solid ${borderCol}; border-radius: 10px; margin-bottom: 10px; overflow: hidden; }
        .rhy-line { position: absolute; top: 0; bottom: 0; left: 50%; width: 4px; background: #3B82F6; transform: translateX(-50%); }
        .rhy-dot { position: absolute; top: 50%; width: 26px; height: 26px; margin-top: -13px; margin-left: -13px; border-radius: 13px; background: #F59E0B; box-shadow: 0 2px 6px rgba(245,158,11,0.5); }
        .tapbtn { background: linear-gradient(135deg, #3B82F6, #1D4ED8); color: #fff; border: none; width: 100%; padding: 22px; font-size: 18px; font-weight: 900; border-radius: 14px; cursor: pointer; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">🎮 Mini Games</div>
        <button class="back hidden" id="backBtn" onclick="show('hub')">← All games</button>
      </div>

      <div id="hub">
        <div class="hub">
          <div class="gcard" onclick="startMemory()"><div class="e">🃏</div><div class="n">Memory Match</div><div class="b">Notes ↔ valves</div></div>
          <div class="gcard" onclick="startQuiz()"><div class="e">⚡</div><div class="n">Valve Quiz Sprint</div><div class="b" id="bestQuiz">Best: 0</div></div>
          <div class="gcard" onclick="startStaff()"><div class="e">🎼</div><div class="n">Name That Note</div><div class="b">Read the staff</div></div>
          <div class="gcard" onclick="startSteady()"><div class="e">🎯</div><div class="n">Hold It Steady</div><div class="b">Mic required</div></div>
          <div class="gcard" onclick="startTrivia()"><div class="e">💡</div><div class="n">Trumpet Trivia</div><div class="b">Test your smarts</div></div>
          <div class="gcard" onclick="startRhythm()"><div class="e">🥁</div><div class="n">Rhythm Tap</div><div class="b">Feel the beat</div></div>
        </div>
        <div style="height:90px"></div>
      </div>

      <div id="g-memory" class="hidden">
        <div class="card">
          <div class="msg" id="memStatus">Match each NOTE with its VALVE combo!</div>
          <div class="mboard" id="memBoard"></div>
          <button class="btn" onclick="startMemory()">🔀 Shuffle & Restart</button>
        </div>
      </div>

      <div id="g-quiz" class="hidden">
        <div class="card">
          <div class="statrow">
            <div class="stat"><div class="stat-v" id="quizScore">0</div><div class="stat-l">Score</div></div>
            <div class="stat"><div class="stat-v" id="quizTime">60s</div><div class="stat-l">Time</div></div>
          </div>
          <div class="big" style="font-size:26px" id="quizQ">?</div>
          <div class="msg" id="quizMsg"></div>
          <div id="quizOpts"></div>
          <button class="btn" onclick="startQuiz()">▶ Play Again</button>
        </div>
      </div>

      <div id="g-notes" class="hidden">
        <div class="card">
          <div class="statrow">
            <div class="stat"><div class="stat-v" id="staffScore">0</div><div class="stat-l">Score</div></div>
            <div class="stat"><div class="stat-v" id="staffProg">1/10</div><div class="stat-l">Round</div></div>
          </div>
          <div id="staffDraw"></div>
          <div class="msg" id="staffMsg"></div>
          <div id="staffOpts"></div>
          <button class="btn" onclick="startStaff()">▶ Play Again</button>
        </div>
      </div>

      <div id="g-steady" class="hidden">
        <div class="card">
          <div class="statrow">
            <div class="stat"><div class="stat-v" id="steadyScore">0.0s</div><div class="stat-l">Held</div></div>
            <div class="stat"><div class="stat-v" id="steadyTime">30s</div><div class="stat-l">Left</div></div>
          </div>
          <div class="msg">Hold this note steady:</div>
          <div class="big" id="steadyTarget">?</div>
          <div class="msg">You are playing: <b id="steadyNow">–</b></div>
          <div class="msg" id="steadyStatus"></div>
          <button class="btn" onclick="startSteady()">▶ Play Again</button>
        </div>
      </div>

      <div id="g-trivia" class="hidden">
        <div class="card">
          <div class="statrow">
            <div class="stat"><div class="stat-v" id="trivScore">0</div><div class="stat-l">Score</div></div>
            <div class="stat"><div class="stat-v" id="trivProg">1/8</div><div class="stat-l">Question</div></div>
          </div>
          <div class="big" style="font-size:20px; line-height:1.35" id="trivQ">?</div>
          <div class="msg" id="trivMsg"></div>
          <div id="trivOpts"></div>
          <button class="btn" onclick="startTrivia()">▶ Play Again</button>
        </div>
      </div>

      <div id="g-rhythm" class="hidden">
        <div class="card">
          <div class="statrow">
            <div class="stat"><div class="stat-v" id="rhyScore">0</div><div class="stat-l">Score</div></div>
            <div class="stat"><div class="stat-v" id="rhyProg">1/8</div><div class="stat-l">Round</div></div>
          </div>
          <div class="rhy-track" id="rhyTrack"><div class="rhy-line"></div><div class="rhy-dot" id="rhyDot" style="left:0%"></div></div>
          <div class="msg" id="rhyMsg">Tap when the dot hits the line!</div>
          <button class="tapbtn" onclick="tapRhy()">TAP!</button>
          <button class="btn" onclick="startRhythm()">▶ Play Again</button>
        </div>
      </div>
      <div style="height:90px"></div>

      <script>
        var VIEWS = ['hub','g-memory','g-quiz','g-notes','g-steady','g-rhythm','g-trivia'];

        var NATIVE_XP = ${nativeXp};
        var sessionXP = 0;
        function getXP() { return NATIVE_XP + sessionXP; }
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
        function addXP(n) {
          sessionXP += n;
          touchDay();
          try { window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'xp', delta: n })); } catch (e) {}
        }

        function show(id) {
          stopSteady();
          clearInterval(quizTimer);
          cancelAnimationFrame(rhyRAF);
          VIEWS.forEach(function(v) { document.getElementById(v).classList.toggle('hidden', v !== id); });
          document.getElementById('backBtn').classList.toggle('hidden', id === 'hub');
          window.scrollTo(0, 0);
          if (id === 'hub') {
            renderBest();
            var tiles = document.querySelectorAll('.gcard');
            for (var ti = 0; ti < tiles.length; ti++) {
              tiles[ti].classList.remove('enter');
              tiles[ti].style.animationDelay = (ti * 0.07) + 's';
              void tiles[ti].offsetWidth;
              tiles[ti].classList.add('enter');
            }
          }
        }

        function renderBest() {
          var bq = localStorage.getItem('tt_quiz_best') || '0';
          document.getElementById('bestQuiz').innerText = 'Best: ' + bq;
        }

        /* ---------- pitch helpers (for Hold It Steady) ---------- */
        function getNoteName(frequency) {
          var notes = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
          var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
          var midiNote = Math.round(noteNum) + 69;
          return notes[midiNote % 12];
        }
        function autoCorrelate(buf, sampleRate) {
          var SIZE = buf.length, sumOfSquares = 0, i;
          for (i = 0; i < SIZE; i++) sumOfSquares += buf[i] * buf[i];
          var rootMeanSquare = Math.sqrt(sumOfSquares / SIZE);
          if (rootMeanSquare < 0.01) return -1;
          var r1 = 0, r2 = SIZE - 1, threshold = 0.2;
          for (i = 0; i < SIZE / 2; i++) { if (Math.abs(buf[i]) < threshold) { r1 = i; break; } }
          for (i = 1; i < SIZE / 2; i++) { if (Math.abs(buf[SIZE - i]) < threshold) { r2 = SIZE - i; break; } }
          buf = buf.slice(r1, r2);
          SIZE = buf.length;
          var c = new Array(SIZE).fill(0);
          for (i = 0; i < SIZE; i++) { for (var j = 0; j < SIZE - i; j++) { c[i] = c[i] + buf[j] * buf[j + i]; } }
          var d = 0;
          while (c[d] > c[d + 1]) d++;
          var maxval = -1, maxpos = -1;
          for (i = d; i < SIZE; i++) { if (c[i] > maxval) { maxval = c[i]; maxpos = i; } }
          return sampleRate / maxpos;
        }

        /* ---------- Memory Match ---------- */
        var MEM_PAIRS = [['C4','Open'],['D4','1 + 3'],['E4','1 + 2'],['F4','1'],['B3','2'],['F#3','1 + 2 + 3']];
        var memFirst = null, memLock = false, memMoves = 0, memMatched = 0;
        function startMemory() {
          memFirst = null; memLock = false; memMoves = 0; memMatched = 0;
          var cards = [];
          MEM_PAIRS.forEach(function(p, i) { cards.push({ t: p[0], k: i }); cards.push({ t: p[1], k: i }); });
          for (var i = cards.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = cards[i]; cards[i] = cards[j]; cards[j] = tmp;
          }
          window._memTexts = cards.map(function(c) { return c.t; });
          var html = '';
          cards.forEach(function(c, i) {
            html += '<div class="mcard" data-k="' + c.k + '" data-i="' + i + '" onclick="flipCard(this)"><span>?</span></div>';
          });
          document.getElementById('memBoard').innerHTML = html;
          document.getElementById('memStatus').innerText = 'Match each NOTE with its VALVE combo!';
          show('g-memory');
        }
        function flipCard(el) {
          if (memLock || el.classList.contains('open') || el.classList.contains('done')) return;
          el.classList.add('open');
          el.querySelector('span').innerText = window._memTexts[parseInt(el.dataset.i, 10)];
          if (!memFirst) { memFirst = el; return; }
          memMoves++;
          if (memFirst.dataset.k === el.dataset.k) {
            memFirst.classList.add('done'); el.classList.add('done');
            memFirst = null; memMatched++;
            if (memMatched === 6) {
              var bonus = Math.max(10, 60 - memMoves * 2);
              document.getElementById('memStatus').innerText = '🎉 All pairs found in ' + memMoves + ' moves! +' + (30 + bonus) + ' XP';
              addXP(30 + bonus);
            }
          } else {
            memLock = true;
            var a = memFirst, b = el; memFirst = null;
            setTimeout(function() {
              a.classList.remove('open'); b.classList.remove('open');
              a.querySelector('span').innerText = '?'; b.querySelector('span').innerText = '?';
              memLock = false;
            }, 700);
          }
        }

        /* ---------- Valve Quiz Sprint ---------- */
        var QUIZ_NOTES = [['C4','0 (Open)'],['D4','1-3'],['E4','1-2'],['F4','1'],['G4','0 (Open)'],['A4','1-2'],['B3','2'],['Bb3','1'],['C5 (High C)','0 (Open)'],['F#3','1-2-3']];
        var quizScore = 0, quizTime = 60, quizTimer = 0, quizStreak = 0, quizQ = null;
        function startQuiz() {
          quizScore = 0; quizTime = 60; quizStreak = 0;
          document.getElementById('quizScore').innerText = '0';
          document.getElementById('quizTime').innerText = '60s';
          show('g-quiz');
          nextQuizQ();
          clearInterval(quizTimer);
          quizTimer = setInterval(function() {
            quizTime--;
            document.getElementById('quizTime').innerText = Math.max(quizTime, 0) + 's';
            if (quizTime <= 0) endQuiz();
          }, 1000);
        }
        function nextQuizQ() {
          var q = QUIZ_NOTES[Math.floor(Math.random() * QUIZ_NOTES.length)];
          quizQ = q;
          var opts = [q[1]];
          var pool = ['0 (Open)','1','2','1-2','1-3','1-2-3'];
          while (opts.length < 4) {
            var o = pool[Math.floor(Math.random() * pool.length)];
            if (opts.indexOf(o) === -1) opts.push(o);
          }
          opts.sort(function() { return Math.random() - 0.5; });
          document.getElementById('quizQ').innerText = 'Valves for ' + q[0] + '?';
          window._quizOpts = opts;
          var html = '';
          opts.forEach(function(op, i) {
            var label = op === '0 (Open)' ? 'Open' : op.split('-').join(' + ');
            html += '<button class="qopt" onclick="answerQuizIdx(' + i + ')">' + label + '</button>';
          });
          document.getElementById('quizOpts').innerHTML = html;
        }
        function answerQuizIdx(i) { answerQuiz(window._quizOpts[i]); }
        function answerQuiz(o) {
          if (quizTime <= 0) return;
          var optsBox = document.getElementById('quizOpts');
          if (optsBox.dataset.locked === '1') return;
          optsBox.dataset.locked = '1';
          var btns = optsBox.querySelectorAll('.qopt');
          btns.forEach(function(b) { b.style.pointerEvents = 'none'; });
          var correctIdx = window._quizOpts.indexOf(quizQ[1]);
          if (btns[correctIdx]) { btns[correctIdx].style.background = '#10B981'; btns[correctIdx].style.color = '#fff'; }
          if (o === quizQ[1]) {
            quizStreak++;
            var pts = 100 + Math.min(50, quizStreak * 10);
            quizScore += pts;
            document.getElementById('quizScore').innerText = quizScore;
            document.getElementById('quizMsg').innerText = '✅ +' + pts;
          } else {
            quizStreak = 0;
            var pickedIdx = window._quizOpts.indexOf(o);
            if (btns[pickedIdx] && pickedIdx !== correctIdx) { btns[pickedIdx].style.background = '#EF4444'; btns[pickedIdx].style.color = '#fff'; }
            document.getElementById('quizMsg').innerText = '❌ It was ' + quizQ[1].split('-').join(' + ').replace('0 (Open)', 'Open');
          }
          setTimeout(function() {
            optsBox.dataset.locked = '';
            document.getElementById('quizMsg').innerText = '';
            if (quizTime > 0) nextQuizQ();
          }, 500);
        }
        function endQuiz() {
          clearInterval(quizTimer); quizTime = 0;
          document.getElementById('quizQ').innerText = '⏰ Time! Score: ' + quizScore;
          document.getElementById('quizOpts').innerHTML = '';
          var best = parseInt(localStorage.getItem('tt_quiz_best') || '0', 10);
          if (quizScore > best) localStorage.setItem('tt_quiz_best', String(quizScore));
          addXP(Math.round(quizScore / 10));
        }

        /* ---------- Name That Note ---------- */
        var STAFF_NOTES = [['C4',-2],['D4',-1],['E4',0],['F4',1],['G4',2],['A4',3],['B4',4],['C5',5]];
        var staffIdx = 0, staffScore = 0, staffQ = null;
        function startStaff() {
          staffIdx = 0; staffScore = 0;
          document.getElementById('staffScore').innerText = '0';
          show('g-notes');
          nextStaffQ();
        }
        function nextStaffQ() {
          if (staffIdx >= 10) { endStaff(); return; }
          staffQ = STAFF_NOTES[Math.floor(Math.random() * STAFF_NOTES.length)];
          var y = 50 - staffQ[1] * 10;
          var html = '<div class="staff">';
          for (var i = 0; i < 5; i++) html += '<div class="sline" style="top:' + (10 + i * 20) + 'px"></div>';
          if (staffQ[1] === -2) html += '<div class="ledger" style="top:' + y + 'px"></div>';
          html += '<div class="nhead" style="top:' + (y - 9) + 'px">●</div><div class="clef">𝄞</div></div>';
          document.getElementById('staffDraw').innerHTML = html;
          document.getElementById('staffProg').innerText = (staffIdx + 1) + '/10';
          var letters = ['C','D','E','F','G','A','B'];
          var opts = [staffQ[0].charAt(0)];
          while (opts.length < 4) {
            var o = letters[Math.floor(Math.random() * letters.length)];
            if (opts.indexOf(o) === -1) opts.push(o);
          }
          opts.sort(function() { return Math.random() - 0.5; });
          window._staffOpts = opts;
          var oh = '';
          opts.forEach(function(op, i) { oh += '<button class="qopt" onclick="answerStaffIdx(' + i + ')">' + op + '</button>'; });
          document.getElementById('staffOpts').innerHTML = oh;
        }
        function answerStaffIdx(i) {
          var optsBox = document.getElementById('staffOpts');
          if (optsBox.dataset.locked === '1') return;
          optsBox.dataset.locked = '1';
          var correct = staffQ[0].charAt(0);
          var picked = window._staffOpts[i];
          var btns = optsBox.querySelectorAll('.qopt');
          btns.forEach(function(b, bi) {
            b.style.pointerEvents = 'none';
            if (window._staffOpts[bi] === correct) {
              b.style.background = '#10B981';
              b.style.color = '#fff';
            }
          });
          if (picked === correct) {
            staffScore += 100;
            document.getElementById('staffScore').innerText = staffScore;
            document.getElementById('staffMsg').innerText = '✅ Correct! Nice reading!';
          } else {
            btns[i].style.background = '#EF4444';
            btns[i].style.color = '#fff';
            document.getElementById('staffMsg').innerText = '❌ Not quite — that was ' + correct + '!';
          }
          staffIdx++;
          setTimeout(function() {
            optsBox.dataset.locked = '';
            document.getElementById('staffMsg').innerText = '';
            nextStaffQ();
          }, 900);
        }
        function endStaff() {
          document.getElementById('staffDraw').innerHTML = '<div class="result">🎉 Score: ' + staffScore + '</div>';
          document.getElementById('staffOpts').innerHTML = '';
          document.getElementById('staffProg').innerText = 'Done!';
          addXP(Math.round(staffScore / 10));
        }

        /* ---------- Hold It Steady ---------- */
        var steadyRAF = 0, steadyListening = false, steadyStream = null, steadyCtx = null, steadyAn = null;
        var steadyTarget = 'G', steadySecs = 0, steadyLeft = 30;
        function startSteady() {
          show('g-steady');
          stopSteady();
          steadyTarget = ['C','D','E','F','G'][Math.floor(Math.random() * 5)];
          document.getElementById('steadyTarget').innerText = steadyTarget;
          document.getElementById('steadyNow').innerText = '–';
          steadySecs = 0; steadyLeft = 30;
          document.getElementById('steadyScore').innerText = '0.0s';
          document.getElementById('steadyTime').innerText = '30s';
          document.getElementById('steadyStatus').innerText = 'Starting mic…';
          startSteadyMic();
        }
        async function startSteadyMic() {
          try {
            steadyStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            steadyCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (steadyCtx.state === 'suspended') await steadyCtx.resume();
            var src = steadyCtx.createMediaStreamSource(steadyStream);
            steadyAn = steadyCtx.createAnalyser();
            steadyAn.fftSize = 2048;
            src.connect(steadyAn);
            steadyListening = true;
            document.getElementById('steadyStatus').innerText = 'Play ' + steadyTarget + ' and hold it steady!';
            var buf = new Float32Array(2048);
            var lastTick = performance.now();
            var loop = function() {
              if (!steadyListening) return;
              steadyAn.getFloatTimeDomainData(buf);
              var p = autoCorrelate(buf, steadyCtx.sampleRate);
              var now = performance.now();
              var dt = (now - lastTick) / 1000;
              lastTick = now;
              if (p !== -1 && p > 50 && p < 2000) {
                var n = getNoteName(p);
                document.getElementById('steadyNow').innerText = n;
                if (n === steadyTarget) steadySecs += dt;
              }
              steadyLeft -= dt;
              document.getElementById('steadyScore').innerText = steadySecs.toFixed(1) + 's';
              document.getElementById('steadyTime').innerText = Math.max(Math.ceil(steadyLeft), 0) + 's';
              if (steadyLeft <= 0) { endSteady(); return; }
              steadyRAF = requestAnimationFrame(loop);
            };
            loop();
          } catch (e) {
            document.getElementById('steadyStatus').innerText = 'Microphone needed: ' + e.message;
          }
        }
        function stopSteady() {
          steadyListening = false;
          cancelAnimationFrame(steadyRAF);
          if (steadyStream) steadyStream.getTracks().forEach(function(t) { t.stop(); });
          if (steadyCtx) steadyCtx.close();
          steadyStream = null; steadyCtx = null;
        }
        function endSteady() {
          stopSteady();
          var pts = Math.round(steadySecs * 10);
          document.getElementById('steadyStatus').innerText = '🎉 You held ' + steadyTarget + ' for ' + steadySecs.toFixed(1) + 's! +' + (20 + pts) + ' XP';
          addXP(20 + pts);
        }

        /* ---------- Trumpet Trivia ---------- */
        var TRIVIA = [
          { q: 'How many valves does a trumpet have?', o: ['2', '3', '4', '5'], a: 1 },
          { q: 'Which note is played with NO valves (open)?', o: ['D4', 'F4', 'C4', 'B3'], a: 2 },
          { q: 'What do trumpet players buzz into?', o: ['A reed', 'A mouthpiece', 'A straw', 'Their hands'], a: 1 },
          { q: 'Which of these is a famous trumpet player?', o: ['Mozart', 'Louis Armstrong', 'Elvis', 'Shakespeare'], a: 1 },
          { q: 'What instrument family is the trumpet in?', o: ['Woodwind', 'Strings', 'Brass', 'Percussion'], a: 2 },
          { q: 'Valves 1 + 2 play which note?', o: ['F4', 'E4', 'D4', 'G4'], a: 1 },
          { q: 'What should you do BEFORE trying high notes?', o: ['Warm up low and slow', 'Drink soda', 'Hold your breath', 'Play as loud as possible'], a: 0 },
          { q: 'How often should you oil your valves?', o: ['Once a year', 'Never', 'About once a week', 'Every hour'], a: 2 }
        ];
        var trivIdx = 0, trivScore = 0;
        function startTrivia() {
          trivIdx = 0; trivScore = 0;
          document.getElementById('trivScore').innerText = '0';
          show('g-trivia');
          nextTriv();
        }
        function nextTriv() {
          if (trivIdx >= TRIVIA.length) { endTriv(); return; }
          var t = TRIVIA[trivIdx];
          document.getElementById('trivQ').innerText = t.q;
          document.getElementById('trivProg').innerText = (trivIdx + 1) + '/' + TRIVIA.length;
          var html = '';
          t.o.forEach(function(o, i) { html += '<button class="qopt" onclick="answerTriv(' + i + ')">' + o + '</button>'; });
          document.getElementById('trivOpts').innerHTML = html;
        }
        function answerTriv(i) {
          var optsBox = document.getElementById('trivOpts');
          if (optsBox.dataset.locked === '1') return;
          optsBox.dataset.locked = '1';
          var t = TRIVIA[trivIdx];
          var btns = optsBox.querySelectorAll('.qopt');
          btns.forEach(function(b) { b.style.pointerEvents = 'none'; });
          if (btns[t.a]) { btns[t.a].style.background = '#10B981'; btns[t.a].style.color = '#fff'; }
          if (i === t.a) {
            trivScore += 100;
            document.getElementById('trivScore').innerText = trivScore;
            document.getElementById('trivMsg').innerText = '✅ Correct!';
          } else {
            if (btns[i]) { btns[i].style.background = '#EF4444'; btns[i].style.color = '#fff'; }
            document.getElementById('trivMsg').innerText = '❌ The answer was: ' + t.o[t.a];
          }
          trivIdx++;
          setTimeout(function() {
            optsBox.dataset.locked = '';
            document.getElementById('trivMsg').innerText = '';
            nextTriv();
          }, 1000);
        }
        function endTriv() {
          document.getElementById('trivQ').innerText = '🎉 Score: ' + trivScore;
          document.getElementById('trivOpts').innerHTML = '';
          document.getElementById('trivProg').innerText = 'Done!';
          addXP(Math.round(trivScore / 10) + 10);
        }

        /* ---------- Rhythm Tap ---------- */
        var rhyRAF = 0, rhyIdx = 0, rhyScore = 0, rhyT0 = 0, rhyHitDone = false;
        var rhyTravel = 2.0, rhyWindow = 0.6;
        function startRhythm() {
          cancelAnimationFrame(rhyRAF);
          rhyIdx = 0; rhyScore = 0;
          document.getElementById('rhyScore').innerText = '0';
          show('g-rhythm');
          nextRhyDot();
        }
        function nextRhyDot() {
          if (rhyIdx >= 8) { endRhythm(); return; }
          rhyHitDone = false;
          rhyTravel = Math.max(0.7, 1.7 - rhyIdx * 0.2);
          rhyWindow = Math.min(0.5, rhyTravel * 0.35);
          rhyT0 = performance.now() / 1000;
          document.getElementById('rhyProg').innerText = (rhyIdx + 1) + '/8';
          document.getElementById('rhyMsg').innerText = rhyIdx < 3 ? 'Tap when the dot hits the line!' : '⚡ Faster! Tap when the dot hits the line!';
          rhyLoop();
        }
        function rhyLoop() {
          var el = document.getElementById('rhyDot');
          var now = performance.now() / 1000 - rhyT0;
          var p = now / rhyTravel;
          if (p >= 1.15) {
            if (!rhyHitDone) {
              rhyHitDone = true;
              document.getElementById('rhyMsg').innerText = 'Missed!';
              rhyIdx++;
              setTimeout(nextRhyDot, 600);
            }
            return;
          }
          el.style.left = (p * 50) + '%';
          rhyRAF = requestAnimationFrame(rhyLoop);
        }
        function tapRhy() {
          if (rhyHitDone) return;
          var now = performance.now() / 1000 - rhyT0;
          var err = Math.abs(now - rhyTravel);
          if (err < rhyWindow) {
            rhyHitDone = true;
            cancelAnimationFrame(rhyRAF);
            var pts = Math.round(100 * (1 - err / rhyWindow));
            rhyScore += pts;
            document.getElementById('rhyScore').innerText = rhyScore;
            document.getElementById('rhyMsg').innerText = '+' + pts + ' ' + (err < rhyWindow * 0.2 ? 'PERFECT!' : err < rhyWindow * 0.5 ? 'Great!' : 'OK');
            rhyIdx++;
            setTimeout(nextRhyDot, 600);
          }
        }
        function endRhythm() {
          document.getElementById('rhyMsg').innerText = '🎉 Score: ' + rhyScore;
          addXP(Math.round(rhyScore / 10));
        }

        renderBest();
      </script>
    </body>
    </html>
  `, [isDarkMode, bgCol, textCol, subTextCol, inputBg, borderCol, cardBg, nativeXp]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgCol }]}>
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          source={{ html, baseUrl: "https://example.com" }}
          originWhitelist={["*"]}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mediaCapturePermissionGrantType="grant"
          onMessage={(event) => {
            try {
              const msg = JSON.parse(event.nativeEvent.data);
              if (msg?.type === "xp" && typeof msg.delta === "number") {
                awardXP(msg.delta);
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
