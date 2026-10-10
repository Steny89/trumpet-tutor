import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { awardXP } from "../constants/xp";
import { useTheme } from "../context/ThemeContext";

type LessonPage =
  | { kind: "info"; emoji: string; title: string; body: string }
  | {
      kind: "do";
      emoji: string;
      title: string;
      body: string;
      action: "practice" | "games";
      actionLabel: string;
    };

type QuizQ = { q: string; opts: string[]; correct: number };

type Lesson = {
  id: string;
  tier: string;
  title: string;
  emoji: string;
  desc: string;
  targetNote: string;
  pages: LessonPage[];
  quiz: QuizQ[];
};

const LESSONS: Lesson[] = [
  // ---------------- BEGINNER ----------------
  {
    id: "b1",
    tier: "Beginner",
    title: "Your First Buzz",
    emoji: "🎺",
    desc: "Build your embouchure and learn to buzz.",
    targetNote: "C4",
    pages: [
      {
        kind: "info",
        emoji: "👄",
        title: "What is an embouchure?",
        body: "Your embouchure is the shape your lips make on the mouthpiece. Keep the corners of your mouth firm, like you're saying 'mmm', and let the middle stay relaxed. This shape is the engine of every note you'll ever play.",
      },
      {
        kind: "info",
        emoji: "🐝",
        title: "The buzz",
        body: "Before the trumpet can sing, your lips have to buzz — just like blowing a raspberry, but smaller and more controlled. Take the mouthpiece off your trumpet, press it gently to your lips, and buzz a steady 'bzzzz' like a bee.",
      },
      {
        kind: "do",
        emoji: "⏱️",
        title: "Buzz battle",
        body: "Buzz into just the mouthpiece for 30 seconds without stopping. If your lips get tired, rest 10 seconds and go again. Do it 3 times!",
        action: "practice",
        actionLabel: "Open the Tuner",
      },
    ],
    quiz: [
      {
        q: "Where should most mouthpiece pressure rest?",
        opts: ["Mainly on the upper lip", "Evenly, slightly favoring the lower lip", "Pressed hard into the teeth", "On the chin"],
        correct: 1,
      },
      {
        q: "What actually makes the buzzing sound?",
        opts: ["The metal mouthpiece", "Your lips vibrating", "Your tongue", "The valves"],
        correct: 1,
      },
    ],
  },
  {
    id: "b2",
    tier: "Beginner",
    title: "First Open Notes",
    emoji: "🎵",
    desc: "Play C4 and G4 with no valves at all.",
    targetNote: "C4",
    pages: [
      {
        kind: "info",
        emoji: "⭕",
        title: "Open notes",
        body: "Some notes need no valves at all — your lips do all the work! C4 (middle C) and G4 are both 'open'. Press nothing, buzz, and let the horn ring.",
      },
      {
        kind: "info",
        emoji: "👅",
        title: "Starting a note",
        body: "Every note starts with your tongue. Say 'tah' — the tip of your tongue briefly touches behind your teeth, then releases the air. Try whispering 'tah-tah-tah' before you even pick up the horn.",
      },
      {
        kind: "do",
        emoji: "🎯",
        title: "Five clean C4s",
        body: "In the tuner, play C4 five times in a row. Each one should start with a crisp 'tah' and sound steady. Watch the tuner light up when you nail it!",
        action: "practice",
        actionLabel: "Practice in the Tuner",
      },
    ],
    quiz: [
      {
        q: "Which valves do you press for C4?",
        opts: ["1-2", "1-3", "Open (none)", "2-3"],
        correct: 2,
      },
      {
        q: "What syllable starts a clean note?",
        opts: ["Lah", "Tah", "Sah", "Mah"],
        correct: 1,
      },
    ],
  },
  {
    id: "b3",
    tier: "Beginner",
    title: "Down Low: Bb3",
    emoji: "🎶",
    desc: "Drop into the low register with warm, slow air.",
    targetNote: "Bb3",
    pages: [
      {
        kind: "info",
        emoji: "🌊",
        title: "Low notes love slow air",
        body: "High notes need fast air, but low notes want it slow and warm — like fogging up a mirror. Drop your jaw a little, relax, and let the air pour out wide and easy.",
      },
      {
        kind: "info",
        emoji: "☝️",
        title: "Valve 1 = Bb3",
        body: "Press down just your first valve (the one closest to you) and buzz low. That's Bb3! It's one of the mellowest notes on the trumpet.",
      },
      {
        kind: "do",
        emoji: "💨",
        title: "The 8-count hold",
        body: "Play Bb3 and hold it for a slow 8-count. Keep the air moving the whole time — if the note wobbles, you're doing it right by practicing!",
        action: "practice",
        actionLabel: "Hold it in the Tuner",
      },
    ],
    quiz: [
      {
        q: "Which valve do you press for Bb3?",
        opts: ["Valve 1", "Valve 2", "Valve 3", "Open"],
        correct: 0,
      },
      {
        q: "What kind of air do low notes need?",
        opts: ["Fast and tight", "Warm and slow", "Short bursts", "Through the nose"],
        correct: 1,
      },
    ],
  },
  {
    id: "b4",
    tier: "Beginner",
    title: "Long Tones",
    emoji: "💨",
    desc: "The not-so-secret secret of great tone.",
    targetNote: "C4",
    pages: [
      {
        kind: "info",
        emoji: "🧱",
        title: "Tone builders",
        body: "Every great trumpet player practices long tones — holding one note perfectly steady. It's boring-looking and magical-sounding. Long tones build your air, your ears, and your sound all at once.",
      },
      {
        kind: "info",
        emoji: "👂",
        title: "Listen for wobbles",
        body: "Play a C4 and hold it. Listen closely: does it waver or stay laser-straight? Your job is to keep it steady for longer each day. The tuner is your truth-teller here.",
      },
      {
        kind: "do",
        emoji: "🎮",
        title: "Steady game",
        body: "Play the Hold It Steady mini-game and keep your note locked in. Beat your own record!",
        action: "games",
        actionLabel: "Play Hold It Steady",
      },
    ],
    quiz: [
      {
        q: "What drives a steady trumpet tone?",
        opts: ["Squeezing your lips", "A fast, consistent air column", "Tensing your throat", "Holding your breath"],
        correct: 1,
      },
      {
        q: "Why practice long tones?",
        opts: ["They're fun to show off", "They build tone, air, and ears", "They make you play faster", "They clean the valves"],
        correct: 1,
      },
    ],
  },
  {
    id: "b5",
    tier: "Beginner",
    title: "Valve Combos",
    emoji: "⚙️",
    desc: "Three valves, seven combos — learn the moves.",
    targetNote: "B3",
    pages: [
      {
        kind: "info",
        emoji: "🔢",
        title: "Seven combos",
        body: "Three valves make 7 combinations: open, 2, 1, 1+2, 2+3, 1+3, and 1+2+3. Every note on the trumpet is one of these! B3 is just valve 2 — nice and easy.",
      },
      {
        kind: "info",
        emoji: "🤏",
        title: "Clean moves",
        body: "Press valves with your fingertips, straight down, like typing. Practice moving between B3 (valve 2) and C4 (open) without any blips between the notes.",
      },
      {
        kind: "do",
        emoji: "🃏",
        title: "Match them up",
        body: "Play the Memory Match mini-game and pair every note with its valve combo. Then try B3 → C4 → D4 in the tuner!",
        action: "games",
        actionLabel: "Play Memory Match",
      },
    ],
    quiz: [
      {
        q: "Which valve is pressed for B3?",
        opts: ["Valve 2", "Valve 1", "Valves 1-2", "Open"],
        correct: 0,
      },
      {
        q: "How many valves does a trumpet have?",
        opts: ["2", "3", "4", "5"],
        correct: 1,
      },
    ],
  },
  {
    id: "b6",
    tier: "Beginner",
    title: "Tonguing Basics",
    emoji: "👅",
    desc: "Make every note start clean with your tongue.",
    targetNote: "G4",
    pages: [
      {
        kind: "info",
        emoji: "🚦",
        title: "Your tongue is a traffic cop",
        body: "Your tongue starts and stops the air for every note. Say 'tah' — feel the tip touch just behind your teeth? That tiny touch is what makes notes begin crisply instead of splatting.",
      },
      {
        kind: "info",
        emoji: "🎵",
        title: "Legato vs staccato",
        body: "Legato means smooth and connected — 'tah' very gently. Staccato means short and bouncy — 'tut!' with a crisp stop. Same note, two totally different personalities!",
      },
      {
        kind: "do",
        emoji: "🎯",
        title: "Eight even tahs",
        body: "Play 8 G4s in a row in the tuner, evenly spaced like a clock ticking. Then try 4 smooth (legato) and 4 bouncy (staccato)!",
        action: "practice",
        actionLabel: "Tongue in the Tuner",
      },
    ],
    quiz: [
      {
        q: "What does your tongue do when you play?",
        opts: ["Presses the valves", "Starts and stops the air", "Holds the mouthpiece", "Nothing at all"],
        correct: 1,
      },
      {
        q: "Which syllable starts a clean note?",
        opts: ["Lah", "Tah", "Sah", "Wah"],
        correct: 1,
      },
    ],
  },
  {
    id: "b7",
    tier: "Beginner",
    title: "Your First Scale",
    emoji: "🪜",
    desc: "Climb the C major scale, step by step.",
    targetNote: "C4",
    pages: [
      {
        kind: "info",
        emoji: "🔤",
        title: "The musical alphabet",
        body: "A scale is the alphabet of music. C major goes C-D-E-F-G-A-B-C — eight notes climbing a ladder, then you're back home one octave higher!",
      },
      {
        kind: "info",
        emoji: "🏋️",
        title: "Why scales rule",
        body: "Scales train your fingers, your ears, AND your air all at once. Every song you ever learn is built from scales. Ten minutes of scales a day = superpowers.",
      },
      {
        kind: "do",
        emoji: "🧗",
        title: "Climb and descend",
        body: "Play C major up and down slowly in the tuner. Valves: C(open) D(1+3) E(1+2) F(1) G(open) A(1+2) B(2) C(open)!",
        action: "practice",
        actionLabel: "Climb in the Tuner",
      },
    ],
    quiz: [
      {
        q: "How many notes are in a C major scale going up one octave?",
        opts: ["7", "8", "5", "12"],
        correct: 1,
      },
      {
        q: "Which valves play D in the C major scale?",
        opts: ["Open", "1 + 3", "2", "1 + 2 + 3"],
        correct: 1,
      },
    ],
  },
  {
    id: "b8",
    tier: "Beginner",
    title: "Posture Power",
    emoji: "🧍",
    desc: "Stand tall, sound huge.",
    targetNote: "C4",
    pages: [
      {
        kind: "info",
        emoji: "🎈",
        title: "Your lungs need room",
        body: "Slouching squishes your lungs like a stepped-on balloon. Sitting or standing tall gives your air a full tank to draw from — and full tanks make full sounds!",
      },
      {
        kind: "info",
        emoji: "🎺",
        title: "Hold it right",
        body: "Left hand grips the valve section, right hand fingers rest curved on the valves. Elbows out and relaxed — not glued to your sides, not chicken-winging. Horn up, chin level!",
      },
      {
        kind: "do",
        emoji: "🪞",
        title: "Mirror check",
        body: "Play for 2 minutes in front of a mirror. Tall spine? Elbows out? Horn level? Fix one thing at a time until it feels natural.",
        action: "practice",
        actionLabel: "Posture Check in Tuner",
      },
    ],
    quiz: [
      {
        q: "Why does good posture matter?",
        opts: ["It looks cool", "It gives your lungs full room", "It makes valves faster", "It doesn't matter"],
        correct: 1,
      },
      {
        q: "Where should your elbows be?",
        opts: ["Glued to your sides", "Out and relaxed", "Straight up", "Behind your back"],
        correct: 1,
      },
    ],
  },
  // ---------------- INTERMEDIATE ----------------
  {
    id: "i1",
    tier: "Intermediate",
    title: "Smooth Slurs",
    emoji: "〰️",
    desc: "Connect notes with nothing but air.",
    targetNote: "G4",
    pages: [
      {
        kind: "info",
        emoji: "🌉",
        title: "What is a slur?",
        body: "A slur connects two notes with no tongue in between — just a smooth bridge of air. Your lips change the pitch while the air never stops. It should sound like one long singing note that bends.",
      },
      {
        kind: "info",
        emoji: "💪",
        title: "Lip flexibility",
        body: "Slurring builds lip flexibility: the ability to hop between notes cleanly. Start with C4 to G4 (both open!). If there's a bump in the middle, slow down and use more air.",
      },
      {
        kind: "do",
        emoji: "🎯",
        title: "Slur ladder",
        body: "Slur C4 → G4 → C4 five times without tonguing. Keep the air spinning the whole way!",
        action: "practice",
        actionLabel: "Practice in the Tuner",
      },
    ],
    quiz: [
      {
        q: "What do you NOT use during a slur?",
        opts: ["Air", "Lip tension changes", "Your tongue", "Your ears"],
        correct: 2,
      },
      {
        q: "Which two notes are both open and great for slur practice?",
        opts: ["C4 and G4", "D4 and F4", "Bb3 and B3", "E4 and A4"],
        correct: 0,
      },
    ],
  },
  {
    id: "i2",
    tier: "Intermediate",
    title: "Tonguing: Ta-Ka",
    emoji: "🗣️",
    desc: "Double your speed with double tonguing.",
    targetNote: "G4",
    pages: [
      {
        kind: "info",
        emoji: "👅",
        title: "Single tonguing",
        body: "You've been single tonguing all along: 'tah-tah-tah'. It's perfect until notes get really fast — then your tongue can't keep up!",
      },
      {
        kind: "info",
        emoji: "⚡",
        title: "Enter the Ka",
        body: "Double tonguing alternates 'tah-kah-tah-kah'. The 'kah' uses the back of your tongue, so each half does half the work. Say it out loud first: tah-kah-tah-kah, getting faster!",
      },
      {
        kind: "do",
        emoji: "🥁",
        title: "Speed drill",
        body: "On G4, double-tongue 8 notes in a row: tah-kah-tah-kah-tah-kah-tah-kah. Then try the Rhythm Tap game to feel the speed!",
        action: "games",
        actionLabel: "Play Rhythm Tap",
      },
    ],
    quiz: [
      {
        q: "What syllables make up double tonguing?",
        opts: ["Tah-tah", "Tah-kah", "Dah-lah", "Tee-hee"],
        correct: 1,
      },
      {
        q: "When is double tonguing useful?",
        opts: ["Slow sad songs", "Really fast passages", "Tuning", "Cleaning the horn"],
        correct: 1,
      },
    ],
  },
  {
    id: "i3",
    tier: "Intermediate",
    title: "Climbing High",
    emoji: "🚀",
    desc: "Reach for the upper register the right way.",
    targetNote: "C5",
    pages: [
      {
        kind: "info",
        emoji: "🎈",
        title: "Fast air, not force",
        body: "High notes come from faster air and firmer corners — NEVER from smashing the mouthpiece into your face. Think of the air getting thinner and quicker, like whistling higher.",
      },
      {
        kind: "info",
        emoji: "😴",
        title: "Rest like a pro",
        body: "High playing is a workout. Rest as long as you play up there. Tired lips + high notes = bad habits. Short tries, lots of rest, big results.",
      },
      {
        kind: "do",
        emoji: "🪜",
        title: "The climb",
        body: "Play G4 → A4 → B4 → C5, resting 10 seconds between each. Only go as high as sounds good today!",
        action: "practice",
        actionLabel: "Climb in the Tuner",
      },
    ],
    quiz: [
      {
        q: "What should the air do as you play higher?",
        opts: ["Get slower", "Get faster", "Stop completely", "Go through your nose"],
        correct: 1,
      },
      {
        q: "What's the best recovery after high playing?",
        opts: ["Play louder", "Rest and buzz low notes", "Press harder", "Skip warming down"],
        correct: 1,
      },
    ],
  },
  {
    id: "i4",
    tier: "Intermediate",
    title: "Minor Moods",
    emoji: "🎼",
    desc: "Scales that sound mysterious.",
    targetNote: "A4",
    pages: [
      {
        kind: "info",
        emoji: "🌙",
        title: "Major vs minor",
        body: "Major scales sound happy and bright. Minor scales sound mysterious, sad, or sneaky — like movie villain music! Same 8 notes concept, totally different mood.",
      },
      {
        kind: "info",
        emoji: "🎹",
        title: "Harmonic minor trick",
        body: "In a harmonic minor scale, the 7th note gets raised a half step. In A minor, that means G becomes G#. That one spicy note gives minor music its dramatic sound!",
      },
      {
        kind: "do",
        emoji: "🗺️",
        title: "A minor adventure",
        body: "Play an A minor scale slowly in the tuner: A-B-C-D-E-F-G#-A. Listen for that dramatic raised 7th!",
        action: "practice",
        actionLabel: "Play in the Tuner",
      },
    ],
    quiz: [
      {
        q: "What makes a harmonic minor scale special?",
        opts: ["The 7th note is raised", "The 3rd is raised", "Nothing changes", "It's played backwards"],
        correct: 0,
      },
      {
        q: "In A harmonic minor, which note is raised?",
        opts: ["F to F#", "G to G#", "C to C#", "A to A#"],
        correct: 1,
      },
    ],
  },
  {
    id: "i5",
    tier: "Intermediate",
    title: "Loud & Soft",
    emoji: "🔊",
    desc: "Dynamics: whisper and roar on command.",
    targetNote: "G4",
    pages: [
      {
        kind: "info",
        emoji: "🤫",
        title: "Piano and forte",
        body: "Piano means soft, forte means loud — and the magic is controlling both. Great players can whisper a note and then make it bloom huge without it cracking.",
      },
      {
        kind: "info",
        emoji: "💨",
        title: "The soft trap",
        body: "Here's the tricky part: when you play softly, your air wants to slow down — and slow air makes the pitch sag. Keep the air speed UP even when the volume goes down!",
      },
      {
        kind: "do",
        emoji: "🎚️",
        title: "The swell",
        body: "Play G4: start super soft, grow to loud, shrink back to soft — one long breath. Watch the tuner stay centered!",
        action: "practice",
        actionLabel: "Swell in the Tuner",
      },
    ],
    quiz: [
      {
        q: "What's the hardest part of playing very softly?",
        opts: ["Keeping air speed up", "Pressing valves harder", "Closing your throat", "Standing still"],
        correct: 0,
      },
      {
        q: "What does 'forte' mean?",
        opts: ["Soft", "Loud", "Fast", "Slow"],
        correct: 1,
      },
    ],
  },
  {
    id: "i6",
    tier: "Intermediate",
    title: "Flexibility Flows",
    emoji: "🌊",
    desc: "Siren slides across partials.",
    targetNote: "C5",
    pages: [
      {
        kind: "info",
        emoji: "🚨",
        title: "The siren",
        body: "A siren slides smoothly from low to high without stopping — like a fire truck! On trumpet, sirens train your lips to glide across partials (notes that share fingerings).",
      },
      {
        kind: "info",
        emoji: "🎢",
        title: "Partials playground",
        body: "C4, G4, and C5 are ALL open! The only thing changing is your lips and air. Sliding between them teaches your embouchure to shift gears smoothly.",
      },
      {
        kind: "do",
        emoji: "🎯",
        title: "Five sirens",
        body: "Siren from C4 up to G4 and back down, 5 times, all open. No bumps allowed — pure slide!",
        action: "practice",
        actionLabel: "Siren in the Tuner",
      },
    ],
    quiz: [
      {
        q: "What do C4, G4, and C5 have in common?",
        opts: ["Same valve combo (open)", "Same pitch", "Same volume", "Nothing"],
        correct: 0,
      },
      {
        q: "What does a siren exercise train?",
        opts: ["Finger speed", "Lip flexibility across partials", "Lung size", "Music reading"],
        correct: 1,
      },
    ],
  },
  {
    id: "i7",
    tier: "Intermediate",
    title: "Reading Rhythms",
    emoji: "🥁",
    desc: "Whole, half, quarter — count it!",
    targetNote: "G4",
    pages: [
      {
        kind: "info",
        emoji: "🍕",
        title: "The rhythm pizza",
        body: "Think of a whole note as a whole pizza (4 beats). Cut it in half: two half notes (2 beats each). Cut again: four quarter notes (1 beat each). Same pizza, more slices!",
      },
      {
        kind: "info",
        emoji: "👏",
        title: "Count out loud",
        body: "Before playing any rhythm, clap it while counting '1-2-3-4'. Your hands learn the pattern so your lips don't have to think about it. Pros still do this!",
      },
      {
        kind: "do",
        emoji: "🎮",
        title: "Tap it out",
        body: "Play the Rhythm Tap mini-game and feel those beats. Then clap a rhythm of your own invention!",
        action: "games",
        actionLabel: "Play Rhythm Tap",
      },
    ],
    quiz: [
      {
        q: "How many beats does a half note get?",
        opts: ["1", "2", "4", "Half a beat"],
        correct: 1,
      },
      {
        q: "What's the best first step with a new rhythm?",
        opts: ["Play it fast immediately", "Clap it while counting", "Skip it", "Guess"],
        correct: 1,
      },
    ],
  },
  {
    id: "i8",
    tier: "Intermediate",
    title: "First Performance",
    emoji: "🎭",
    desc: "Put it all together on stage.",
    targetNote: "C4",
    pages: [
      {
        kind: "info",
        emoji: "🎪",
        title: "You know enough!",
        body: "You can buzz, tongue, slur, and read rhythms — that's a whole performance toolkit! Hot Cross Buns only needs 3 notes (E, D, C). You've got this.",
      },
      {
        kind: "info",
        emoji: "😊",
        title: "Performer mindset",
        body: "Before you play: deep breath, smile, and decide to have fun. Audiences forgive wobbles but they never forget joy. Play like you mean it!",
      },
      {
        kind: "do",
        emoji: "🌟",
        title: "Showtime!",
        body: "Play Hot Cross Buns all the way through in Play-Along mode. That's your first recital piece — perform it for someone!",
        action: "games",
        actionLabel: "Perform in Play-Along",
      },
    ],
    quiz: [
      {
        q: "Which 3 notes does Hot Cross Buns need?",
        opts: ["C, D, E", "E, D, C", "G, A, B", "F, G, A"],
        correct: 1,
      },
      {
        q: "What's the best pre-performance routine?",
        opts: ["Panic quietly", "Deep breath, smile, have fun", "Play as fast as possible", "Skip warming up"],
        correct: 1,
      },
    ],
  },
  // ---------------- ADVANCED ----------------
  {
    id: "a1",
    tier: "Advanced",
    title: "Triple Tonguing",
    emoji: "🌊",
    desc: "Ta-ta-ka: the speed of the pros.",
    targetNote: "C5",
    pages: [
      {
        kind: "info",
        emoji: "3️⃣",
        title: "Triplets need three",
        body: "Double tonguing handles pairs, but triplets need three syllables: 'tah-tah-kah'. It fits the rhythm perfectly — one syllable per note of the triplet.",
      },
      {
        kind: "info",
        emoji: "🏛️",
        title: "Baroque power",
        body: "Triple tonguing powers the flashiest trumpet music ever written — baroque pieces with lightning-fast runs. Master this and you can play music that makes audiences gasp.",
      },
      {
        kind: "do",
        emoji: "⚡",
        title: "Triplet reps",
        body: "On G4, play 4 triplets: tah-tah-kah, tah-tah-kah, tah-tah-kah, tah-tah-kah. Start slow, then speed up!",
        action: "practice",
        actionLabel: "Drill in the Tuner",
      },
    ],
    quiz: [
      {
        q: "What syllables make triple tonguing?",
        opts: ["Tah-kah", "Tah-tah-kah", "Dah-dah", "La-la-la"],
        correct: 1,
      },
      {
        q: "Triple tonguing fits which rhythm best?",
        opts: ["Whole notes", "Triplets", "Rests", "Fermatas"],
        correct: 1,
      },
    ],
  },
  {
    id: "a2",
    tier: "Advanced",
    title: "Transposition",
    emoji: "🔀",
    desc: "Read any part, in any key.",
    targetNote: "Bb3",
    pages: [
      {
        kind: "info",
        emoji: "🎺",
        title: "Bb trumpet problems",
        body: "Your trumpet is in Bb, which means when you play a written C, the world hears Bb! Sometimes music is written for other trumpets (C, D, Eb) and YOU have to do the math in your head.",
      },
      {
        kind: "info",
        emoji: "🧮",
        title: "Down a step",
        body: "The most common trick: reading Bb trumpet music at concert pitch means playing everything a major 2nd (one whole step) lower. See a D? Play a C. Your brain becomes a calculator!",
      },
      {
        kind: "do",
        emoji: "🧠",
        title: "Brain transpose",
        body: "Look at the fingering guide, pick any 5 notes, and say out loud what they'd be one whole step lower. Then check yourself!",
        action: "games",
        actionLabel: "Quiz Yourself",
      },
    ],
    quiz: [
      {
        q: "To play Bb trumpet music at concert pitch, you sound...",
        opts: ["A major 2nd lower", "A minor 3rd higher", "A perfect 4th lower", "The same pitch"],
        correct: 0,
      },
      {
        q: "If you see a written D and transpose down a whole step, you play...",
        opts: ["E", "C", "Bb", "F"],
        correct: 1,
      },
    ],
  },
  {
    id: "a3",
    tier: "Advanced",
    title: "Upper Register Stamina",
    emoji: "💪",
    desc: "Own the notes above the staff.",
    targetNote: "C5",
    pages: [
      {
        kind: "info",
        emoji: "🏔️",
        title: "The pro zone",
        body: "Notes above C5 are where lead trumpet players live — screaming solos that cut through an entire band. Getting there takes months; STAYING there takes smart practice.",
      },
      {
        kind: "info",
        emoji: "⏸️",
        title: "Micro-rests",
        body: "The secret of high-note stamina: tiny rests. Play a high phrase, rest the same amount of time, repeat. Never grind tired lips up high — that's how bad habits (and sore faces) happen.",
      },
      {
        kind: "do",
        emoji: "🎯",
        title: "High C reps",
        body: "Play C5, rest 15 seconds, repeat 5 times. If rep 5 sounds worse than rep 1, you're done for today — that's smart training!",
        action: "practice",
        actionLabel: "Rep in the Tuner",
      },
    ],
    quiz: [
      {
        q: "What's the smartest high-register workout?",
        opts: ["Play as long as possible", "Short reps with equal rest", "Only play high", "Never rest"],
        correct: 1,
      },
      {
        q: "If your 5th rep sounds worse than your 1st, you should...",
        opts: ["Push harder", "Stop for today", "Play louder", "Skip warming down"],
        correct: 1,
      },
    ],
  },
  {
    id: "a4",
    tier: "Advanced",
    title: "Jazz Bends",
    emoji: "🎷",
    desc: "Make your trumpet talk.",
    targetNote: "G4",
    pages: [
      {
        kind: "info",
        emoji: "🗣️",
        title: "Talking trumpet",
        body: "Jazz trumpet players make their horns laugh, cry, and shout using bends — sliding the pitch down and back up. It's like the trumpet suddenly learned to speak!",
      },
      {
        kind: "info",
        emoji: "📉",
        title: "How to bend",
        body: "Play a G4, then slowly relax your jaw and air to let the pitch droop down — then bring it back up. Falls, doits, and scoops are all cousins of the bend.",
      },
      {
        kind: "do",
        emoji: "🎢",
        title: "Bend it",
        body: "Play G4 and bend it down a half step and back, 5 times. Watch the tuner dip and recover — that's you talking!",
        action: "practice",
        actionLabel: "Bend in the Tuner",
      },
    ],
    quiz: [
      {
        q: "How do you start a lip bend?",
        opts: ["Press a new valve", "Relax the jaw and air slightly", "There is no 4th valve", "Cover the bell"],
        correct: 1,
      },
      {
        q: "Bends, falls, and doits are most at home in...",
        opts: ["Marching band", "Jazz", "Tuning", "Cleaning"],
        correct: 1,
      },
    ],
  },
  {
    id: "a5",
    tier: "Advanced",
    title: "Orchestral Phrasing",
    emoji: "🌟",
    desc: "Play like the great concert halls.",
    targetNote: "C5",
    pages: [
      {
        kind: "info",
        emoji: "🎻",
        title: "Legendary solos",
        body: "Some of the most famous music ever written is trumpet solos — Mahler's 5th Symphony, 'Pictures at an Exhibition'. One trumpet, total silence, then THAT sound.",
      },
      {
        kind: "info",
        emoji: "🌬️",
        title: "Shaping a phrase",
        body: "Pros don't just play notes — they shape phrases like sentences, with breath direction carrying the line forward and tiny nuances coloring each note. Every phrase should go somewhere.",
      },
      {
        kind: "do",
        emoji: "🎭",
        title: "Say it with music",
        body: "Play a slow C major scale, but phrase it like you're telling an exciting story — get louder toward the top, gentle at the end.",
        action: "practice",
        actionLabel: "Phrase in the Tuner",
      },
    ],
    quiz: [
      {
        q: "What defines pro orchestral phrasing?",
        opts: ["Playing every note detached", "Shaping lines with breath direction and nuance", "Playing as loud as possible", "Never breathing"],
        correct: 1,
      },
      {
        q: "Which piece features a legendary trumpet solo?",
        opts: ["Mahler's 5th Symphony", "Twinkle Twinkle", "Happy Birthday", "Mary Had a Little Lamb"],
        correct: 0,
      },
    ],
  },
  {
    id: "a6",
    tier: "Advanced",
    title: "Vibrato",
    emoji: "〰️",
    desc: "Add warmth and shimmer to your sound.",
    targetNote: "G4",
    pages: [
      {
        kind: "info",
        emoji: "✨",
        title: "What is vibrato?",
        body: "Vibrato is a gentle, even wobble in pitch that makes long notes glow. Listen to any great soloist — their beautiful shimmering sound is vibrato at work.",
      },
      {
        kind: "info",
        emoji: "🦷",
        title: "Jaw vibrato",
        body: "The classic trumpet vibrato comes from the jaw: play a steady note, then pulse your jaw slightly 'yah-yah-yah' about 5-6 times per second. Start slow, keep it even!",
      },
      {
        kind: "do",
        emoji: "🎯",
        title: "Shimmer practice",
        body: "Hold G4 for 12 counts, adding gentle jaw vibrato on the last 6. Even pulses — no wild wobbling!",
        action: "practice",
        actionLabel: "Shimmer in the Tuner",
      },
    ],
    quiz: [
      {
        q: "Where does classic trumpet vibrato come from?",
        opts: ["Shaking the horn", "Jaw pulses", "Wiggling the valves", "Stomping your foot"],
        correct: 1,
      },
      {
        q: "About how fast should vibrato pulse?",
        opts: ["1 per second", "5-6 per second", "20 per second", "As fast as possible"],
        correct: 1,
      },
    ],
  },
  {
    id: "a7",
    tier: "Advanced",
    title: "Sight-Reading",
    emoji: "👀",
    desc: "Play it right the first time.",
    targetNote: "C4",
    pages: [
      {
        kind: "info",
        emoji: "📖",
        title: "First look",
        body: "Sight-reading means playing music you've never seen — perfectly, first try. Pros do it in auditions and recording studios. The secret? Scan BEFORE you play.",
      },
      {
        kind: "info",
        emoji: "🔍",
        title: "The 30-second scan",
        body: "Before playing: check the key signature, time signature, trickiest rhythm, and highest/lowest notes. Find the hard spots first — then they can't ambush you!",
      },
      {
        kind: "do",
        emoji: "🃏",
        title: "Note detective",
        body: "Play the Name That Note mini-game to sharpen instant note recognition — the core skill of sight-reading!",
        action: "games",
        actionLabel: "Play Name That Note",
      },
    ],
    quiz: [
      {
        q: "What should you check first when sight-reading?",
        opts: ["The composer's birthday", "Key and time signatures", "The page number", "Nothing — just play"],
        correct: 1,
      },
      {
        q: "What's the golden rule of sight-reading?",
        opts: ["Never stop, keep going", "Stop at every mistake", "Play as fast as possible", "Close your eyes"],
        correct: 0,
      },
    ],
  },
  {
    id: "a8",
    tier: "Advanced",
    title: "Audition Ready",
    emoji: "🏆",
    desc: "Prepare like a champion.",
    targetNote: "C5",
    pages: [
      {
        kind: "info",
        emoji: "🎯",
        title: "Auditions decoded",
        body: "An audition is just a performance with a purpose — honor band, jazz band, solos. Judges want to hear: steady rhythm, clean attacks, beautiful tone, and confidence.",
      },
      {
        kind: "info",
        emoji: "📋",
        title: "The prep formula",
        body: "Pick your piece 6 weeks out. Learn notes first, then rhythms, then style. Record yourself weekly. Do 3 full mock auditions for family before the real one!",
      },
      {
        kind: "do",
        emoji: "🎬",
        title: "Mock audition",
        body: "Record yourself playing your best piece all the way through, no stops. Listen back and pick ONE thing to improve. That's how pros prepare!",
        action: "practice",
        actionLabel: "Run it in the Tuner",
      },
    ],
    quiz: [
      {
        q: "What do audition judges listen for most?",
        opts: ["Fancy clothes", "Steady rhythm, clean attacks, tone, confidence", "The most expensive horn", "Speed only"],
        correct: 1,
      },
      {
        q: "How far ahead should you start preparing a piece?",
        opts: ["The night before", "About 6 weeks", "6 minutes", "Never — wing it"],
        correct: 1,
      },
    ],
  },
];

const TIER_META = [
  { tier: "Beginner", icon: "🌱", color: "#10B981" },
  { tier: "Intermediate", icon: "🌿", color: "#F59E0B" },
  { tier: "Advanced", icon: "🌳", color: "#A78BFA" },
];

function TrailSegment({
  march,
  done,
  active,
  dimmed,
}: {
  march: Animated.Value;
  done: boolean;
  active: boolean;
  dimmed: boolean;
}) {
  const dots = [0, 1, 2, 3, 4, 5];
  const color = done ? "#10B981" : active ? "#A78BFA" : "#3A2F5C";
  return (
    <View style={{ alignItems: "center", height: 46, justifyContent: "space-evenly" }}>
      {dots.map((i) => {
        if (active) {
          const opacity = march.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [0.2, 1, 0.2],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={i}
              style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: color, opacity }}
            />
          );
        }
        return (
          <View
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: color,
              opacity: done ? 1 : dimmed ? 0.3 : 0.6,
            }}
          />
        );
      })}
    </View>
  );
}

export default function LessonsScreen() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [pageIdx, setPageIdx] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrongPick, setWrongPick] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const [pulse] = useState(() => new Animated.Value(1));
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, [pulse]);

  // marching-ants dot that travels along the trail to the next lesson
  const [march] = useState(() => new Animated.Value(0));
  // lesson-complete celebration
  const [celebrate] = useState(() => new Animated.Value(0));
  const [emojiRow] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (finished) {
      celebrate.setValue(0);
      emojiRow.setValue(0);
      Animated.spring(celebrate, {
        toValue: 1,
        friction: 6,
        tension: 90,
        useNativeDriver: true,
      }).start();
      Animated.timing(emojiRow, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [finished, celebrate, emojiRow]);
  useEffect(() => {
    Animated.loop(
      Animated.timing(march, { toValue: 6, duration: 1400, useNativeDriver: false }),
    ).start();
  }, [march]);

  useEffect(() => {
    AsyncStorage.getItem("completed_lessons").then((saved) => {
      if (saved) setCompletedLessons(JSON.parse(saved));
    });
  }, []);

  const bg = isDarkMode ? "#130E20" : "#F8FAFC";
  const card = isDarkMode ? "#1E1832" : "#FFFFFF";
  const text = isDarkMode ? "#F1F5F9" : "#1E293B";
  const sub = isDarkMode ? "#A79BD0" : "#64748B";
  const border = isDarkMode ? "#3A2F5C" : "#E2E8F0";
  const input = isDarkMode ? "#2B2145" : "#F1F5F9";

  const isUnlocked = (idx: number) =>
    idx === 0 || completedLessons.includes(LESSONS[idx - 1].id);
  const isDone = (id: string) => completedLessons.includes(id);
  const firstIncomplete = LESSONS.findIndex((l) => !isDone(l.id));

  const openLesson = (lesson: Lesson, idx: number) => {
    if (!isUnlocked(idx)) return;
    setSelectedLesson(lesson);
    setPageIdx(0);
    setQuizIdx(0);
    setPicked(null);
    setWrongPick(null);
    setFinished(false);
  };

  const completeLesson = async () => {
    if (!selectedLesson || finished) return;
    setFinished(true);
    if (!completedLessons.includes(selectedLesson.id)) {
      const updated = [...completedLessons, selectedLesson.id];
      setCompletedLessons(updated);
      await AsyncStorage.setItem("completed_lessons", JSON.stringify(updated));
    }
    await awardXP(50);
  };

  const doAction = async (page: Extract<LessonPage, { kind: "do" }>) => {
    if (page.action === "practice") {
      await AsyncStorage.setItem("target_practice_note", selectedLesson?.targetNote || "C4");
      router.push("/practice");
    } else {
      router.push("/games");
    }
  };

  /* ---------------- Lesson player ---------------- */
  if (selectedLesson) {
    const inQuiz = pageIdx >= selectedLesson.pages.length;
    const q = inQuiz ? selectedLesson.quiz[quizIdx] : null;

    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
        <ScrollView contentContainerStyle={styles.playerScroll}>
          <TouchableOpacity
            onPress={() => setSelectedLesson(null)}
            style={[styles.backBtn, { backgroundColor: input }]}
          >
            <Text style={[styles.backText, { color: text }]}>← Lesson Map</Text>
          </TouchableOpacity>

          <Text style={[styles.lessonEmoji, { marginTop: 8 }]}>{selectedLesson.emoji}</Text>
          <Text style={[styles.lessonTitle, { color: text }]}>{selectedLesson.title}</Text>

          {/* progress dots */}
          <View style={styles.dots}>
            {[...Array(selectedLesson.pages.length + 1)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      i < pageIdx || (inQuiz && i === selectedLesson.pages.length)
                        ? "#10B981"
                        : i === pageIdx
                          ? "#A78BFA"
                          : border,
                  },
                ]}
              />
            ))}
          </View>

          {!inQuiz && !finished && (
            <View style={[styles.pageCard, { backgroundColor: card, borderColor: border }]}>
              {selectedLesson.pages[pageIdx].kind === "info" ? (
                <>
                  <Text style={styles.pageEmoji}>{selectedLesson.pages[pageIdx].emoji}</Text>
                  <Text style={[styles.pageTitle, { color: text }]}>
                    {(selectedLesson.pages[pageIdx] as { title: string }).title}
                  </Text>
                  <Text style={[styles.pageBody, { color: sub }]}>
                    {(selectedLesson.pages[pageIdx] as { body: string }).body}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.pageEmoji}>{selectedLesson.pages[pageIdx].emoji}</Text>
                  <Text style={[styles.pageTitle, { color: text }]}>
                    {(selectedLesson.pages[pageIdx] as { title: string }).title}
                  </Text>
                  <Text style={[styles.pageBody, { color: sub }]}>
                    {(selectedLesson.pages[pageIdx] as { body: string }).body}
                  </Text>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() =>
                      doAction(selectedLesson.pages[pageIdx] as Extract<LessonPage, { kind: "do" }>)
                    }
                  >
                    <Text style={styles.actionBtnText}>
                      {(selectedLesson.pages[pageIdx] as Extract<LessonPage, { kind: "do" }>).actionLabel} →
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              <View style={styles.navRow}>
                {pageIdx > 0 && (
                  <TouchableOpacity
                    style={[styles.navBtn, { backgroundColor: input }]}
                    onPress={() => setPageIdx(pageIdx - 1)}
                  >
                    <Text style={[styles.navBtnText, { color: text }]}>← Back</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.navBtn, styles.navNext]}
                  onPress={() => setPageIdx(pageIdx + 1)}
                >
                  <Text style={styles.navNextText}>
                    {pageIdx === selectedLesson.pages.length - 1 ? "Start Quiz →" : "Next →"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {inQuiz && !finished && q && (
            <View style={[styles.pageCard, { backgroundColor: card, borderColor: border }]}>
              <Text style={[styles.quizCount, { color: sub }]}>
                Question {quizIdx + 1} of {selectedLesson.quiz.length}
              </Text>
              <Text style={[styles.pageTitle, { color: text }]}>{q.q}</Text>
              {q.opts.map((opt, i) => {
                let b = { backgroundColor: input, borderColor: border };
                if (picked === i) b = { backgroundColor: "rgba(16,185,129,0.25)", borderColor: "#10B981" };
                else if (wrongPick === i) b = { backgroundColor: "rgba(239,68,68,0.25)", borderColor: "#EF4444" };
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.opt, b]}
                    onPress={() => {
                      if (i === q.correct) {
                        setPicked(i);
                        setWrongPick(null);
                      } else {
                        setWrongPick(i);
                      }
                    }}
                  >
                    <Text style={[styles.optText, { color: text }]}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
              {wrongPick !== null && picked === null && (
                <Text style={styles.tryAgain}>❌ Not quite — try again!</Text>
              )}
              {picked !== null && (
                <TouchableOpacity
                  style={[styles.navBtn, styles.navNext, { marginTop: 12 }]}
                  onPress={() => {
                    if (quizIdx + 1 >= selectedLesson.quiz.length) {
                      completeLesson();
                    } else {
                      setQuizIdx(quizIdx + 1);
                      setPicked(null);
                      setWrongPick(null);
                    }
                  }}
                >
                  <Text style={styles.navNextText}>
                    {quizIdx + 1 >= selectedLesson.quiz.length ? "Finish! 🎉" : "Next Question →"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {finished && (
            <Animated.View
              style={[
                styles.pageCard,
                {
                  backgroundColor: card,
                  borderColor: border,
                  alignItems: "center",
                  transform: [
                    {
                      scale: celebrate.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Animated.View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  opacity: emojiRow,
                  transform: [
                    {
                      translateY: emojiRow.interpolate({
                        inputRange: [0, 1],
                        outputRange: [24, 0],
                      }),
                    },
                  ],
                }}
              >
                {["🎉", "🎺", "⭐", "🎶", "🏆"].map((e) => (
                  <Text key={e} style={{ fontSize: 34 }}>
                    {e}
                  </Text>
                ))}
              </Animated.View>
              <Text style={[styles.pageTitle, { color: text, textAlign: "center", marginTop: 8 }]}>
                Lesson Complete!
              </Text>
              <Text style={[styles.pageBody, { color: sub, textAlign: "center" }]}>
                +50 XP earned. {firstIncomplete >= 0 && firstIncomplete < LESSONS.length - 1
                  ? "Next lesson unlocked!"
                  : "You're on fire!"}
              </Text>
              <TouchableOpacity
                style={[styles.navBtn, styles.navNext, { marginTop: 12 }]}
                onPress={() => setSelectedLesson(null)}
              >
                <Text style={styles.navNextText}>Back to Map →</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  /* ---------------- Lesson map ---------------- */
  const doneCount = LESSONS.filter((l) => isDone(l.id)).length;
  const tierHeaders = LESSONS.map(
    (l, i) => i === 0 || l.tier !== LESSONS[i - 1].tier,
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={styles.mapScroll}>
        <Text style={[styles.mapTitle, { color: text }]}>🗺️ Lesson Map</Text>
        <Text style={[styles.mapSub, { color: sub }]}>
          {doneCount} of {LESSONS.length} lessons complete
        </Text>
        <View style={[styles.progressBar, { backgroundColor: input }]}>
          <View
            style={[styles.progressFill, { width: `${(doneCount / LESSONS.length) * 100}%` }]}
          />
        </View>

        {LESSONS.map((lesson, idx) => {
          const done = isDone(lesson.id);
          const unlocked = isUnlocked(idx);
          const isCurrent = idx === firstIncomplete;
          const tierHeader = tierHeaders[idx];
          const meta = TIER_META.find((t) => t.tier === lesson.tier);

          return (
            <View key={lesson.id}>
              {tierHeader && (
                <Text style={[styles.tierHeader, { color: meta?.color || text }]}>
                  {meta?.icon} {lesson.tier} Trail
                </Text>
              )}
              {idx > 0 && (
                <TrailSegment
                  march={march}
                  done={isDone(LESSONS[idx - 1].id)}
                  active={idx === firstIncomplete}
                  dimmed={!unlocked}
                />
              )}
              <View style={[styles.nodeRow, { justifyContent: "center" }]}>
                <TouchableOpacity
                  disabled={!unlocked}
                  onPress={() => openLesson(lesson, idx)}
                  style={{
                    alignItems: "center",
                    maxWidth: 130,
                    transform: [{ translateX: idx % 2 === 0 ? -58 : 58 }],
                  }}
                >
                  <Animated.View
                    style={[
                      styles.node,
                      {
                        backgroundColor: done
                          ? "#10B981"
                          : unlocked
                            ? "#A78BFA"
                            : input,
                        borderColor: done ? "#10B981" : unlocked ? "#A78BFA" : border,
                        opacity: unlocked ? 1 : 0.55,
                        transform: isCurrent ? [{ scale: pulse }] : [],
                      },
                    ]}
                  >
                    <Text style={styles.nodeEmoji}>
                      {done ? "✓" : unlocked ? lesson.emoji : "🔒"}
                    </Text>
                  </Animated.View>
                  <Text
                    style={[
                      styles.nodeLabel,
                      { color: unlocked ? text : sub },
                    ]}
                    numberOfLines={2}
                  >
                    {lesson.title}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  mapScroll: { padding: 16, paddingBottom: 20 },
  mapTitle: { fontSize: 24, fontWeight: "900", marginTop: 8 },
  mapSub: { fontSize: 13, fontWeight: "600", marginTop: 2, marginBottom: 8 },
  progressBar: { height: 10, borderRadius: 5, overflow: "hidden", marginBottom: 8 },
  progressFill: { height: "100%", backgroundColor: "#10B981", borderRadius: 5 },
  tierHeader: { fontSize: 15, fontWeight: "800", marginTop: 18, marginBottom: 6, textAlign: "center" },
  nodeRow: { flexDirection: "row", marginVertical: 4 },
  node: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  nodeEmoji: { fontSize: 28 },
  nodeLabel: { fontSize: 11, fontWeight: "700", textAlign: "center", marginTop: 6 },
  playerScroll: { padding: 16, paddingBottom: 100 },
  backBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, alignSelf: "flex-start" },
  backText: { fontWeight: "800", fontSize: 13 },
  lessonEmoji: { fontSize: 52, textAlign: "center" },
  lessonTitle: { fontSize: 22, fontWeight: "900", textAlign: "center", marginTop: 6 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginVertical: 12 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  pageCard: { borderRadius: 18, padding: 18, borderWidth: 1 },
  pageEmoji: { fontSize: 44, textAlign: "center", marginBottom: 8 },
  pageTitle: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  pageBody: { fontSize: 14, lineHeight: 21, fontWeight: "500" },
  actionBtn: {
    backgroundColor: "#A78BFA",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 14,
  },
  actionBtnText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  navRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16, gap: 10 },
  navBtn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12, alignItems: "center", flex: 1 },
  navBtnText: { fontWeight: "800", fontSize: 14 },
  navNext: { backgroundColor: "#10B981" },
  navNextText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  quizCount: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", marginBottom: 6 },
  opt: { borderWidth: 1.5, borderRadius: 12, padding: 13, marginTop: 8 },
  optText: { fontSize: 14, fontWeight: "600" },
  tryAgain: { color: "#EF4444", fontWeight: "700", marginTop: 10, textAlign: "center" },
});
