// --- Element Selection ---
const languageSelect = document.getElementById("language");
const inputText = document.getElementById("inputText");
const translatedOutput = document.getElementById("translatedOutput");
const scoreDisplay = document.getElementById("score");
const feedbackDisplay = document.getElementById("feedback");
const translateBtn = document.getElementById("translateBtn");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const sourceLanguageSelect = document.getElementById("sourceLanguage");

const feedbackButtons = document.getElementById("feedbackButtons");
const thumbsUp = document.getElementById("thumbsUp");
const thumbsDown = document.getElementById("thumbsDown");
const userResponse = document.getElementById("userResponse");

const videoSection = document.getElementById("videoSection");
const videoContainer = document.getElementById("videoContainer");

// --- State Variables ---
let recognition;
let isRecording = false;
let expectedText = "";
let spokenText = "";

// --- YouTube API ---
const YOUTUBE_API_KEY = "";

// --- Speech Recognition Setup ---
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        transcript += event.results[i][0].transcript;
      }
    }
    spokenText = transcript.trim();
  };

  recognition.onend = () => {
    isRecording = false;
    if (spokenText) calculateScore();
    else feedbackDisplay.innerText = "⚠️ No speech was detected.";
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    feedbackDisplay.innerText = `Error: ${event.error}`;
    isRecording = false;
  };
} else {
  alert("Speech Recognition not supported. Please use Google Chrome.");
}

// --- Event Listeners ---
translateBtn.addEventListener("click", translateAndSpeak);
startBtn.addEventListener("click", startRecording);
stopBtn.addEventListener("click", stopRecording);

thumbsUp.addEventListener("click", () => {
  userResponse.innerText = "👍 Thanks for your feedback!";
});
thumbsDown.addEventListener("click", () => {
  userResponse.innerText = "👎 We’ll try to improve the translations!";
});

// --- Translation Function (with Fallback API) ---
async function translate(text, targetLangValue) {
  const sourceLangValue = sourceLanguageSelect.value;
  const sourceLangCode = sourceLangValue.split('-')[0];
  const targetLangCode = targetLangValue.split('-')[0];

  if (sourceLangCode === targetLangCode) {
    translatedOutput.innerText = "⚠️ Please select two different languages.";
    return;
  }

  translatedOutput.innerText = "📝 Translating...";
  const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLangCode}|${targetLangCode}`;

  try {
    // --- Primary API: MyMemory ---
    const response = await fetch(myMemoryUrl);
    const data = await response.json();

    if (data.responseData && data.responseData.translatedText && !data.responseData.translatedText.includes("MYMEMORY")) {
      return data.responseData.translatedText;
    }

    // --- Fallback: LibreTranslate (if MyMemory fails) ---
    const libreResponse = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: sourceLangCode,
        target: targetLangCode,
        format: "text"
      })
    });

    const libreData = await libreResponse.json();
    if (libreData.translatedText) {
      return libreData.translatedText;
    } else {
      throw new Error("Fallback failed.");
    }

  } catch (error) {
    console.error("Translation error:", error);
    return "Translation failed. Please try again.";
  }
}

// --- YouTube Video Fetch Function ---
async function fetchYouTubeVideos(query, langCode) {
  const searchQuery = `${query} pronunciation ${langCode}`;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=2&q=${encodeURIComponent(searchQuery)}&key=${YOUTUBE_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      videoContainer.innerHTML = "⚠️ No pronunciation videos found.";
      return;
    }
    videoContainer.innerHTML = data.items
      .map(
        item => `
        <iframe src="https://www.youtube.com/embed/${item.id.videoId}" allowfullscreen></iframe>
        <p><strong>${item.snippet.title}</strong></p>
      `
      )
      .join("");
    videoSection.classList.remove("hidden");
  } catch (err) {
    console.error("YouTube fetch error:", err);
    videoContainer.innerHTML = "⚠️ Could not load videos. Please try again later.";
  }
}

// --- Main Translate & Speak Function ---
async function translateAndSpeak() {
  const textToTranslate = inputText.value;
  const fullLangCode = languageSelect.value;
  const shortLangCode = fullLangCode.split('-')[0];

  if (!textToTranslate) {
    translatedOutput.innerText = "⚠️ Please enter text first!";
    return;
  }

  const translated = await translate(textToTranslate, fullLangCode);
  translatedOutput.innerText = `📝 Translation: ${translated}`;
  expectedText = translated;

  // ✅ Speak translation
  const utterance = new SpeechSynthesisUtterance(translated);
  utterance.lang = fullLangCode;
  speechSynthesis.speak(utterance);

  // ✅ Enable feedback buttons
  feedbackButtons.classList.remove("hidden");

  // ✅ Fetch pronunciation videos
  await fetchYouTubeVideos(translated, shortLangCode);
}

// --- Recording Functions ---
function startRecording() {
  if (!expectedText || expectedText.includes("not found")) {
    alert("⚠️ Please translate a phrase first before recording!");
    return;
  }
  if (isRecording) return;

  spokenText = "";
  feedbackDisplay.innerText = "";
  recognition.lang = languageSelect.value;
  recognition.start();
  isRecording = true;
  scoreDisplay.innerHTML = "🎤 <strong>Listening...</strong>";
}

function stopRecording() {
  if (isRecording) recognition.stop();
}

// --- Pronunciation Score Calculation ---
function calculateScore() {
  const targetWords = expectedText.trim().toLowerCase().split(" ");
  const userWords = spokenText.trim().toLowerCase().split(" ");

  const dp = Array(targetWords.length + 1).fill(null).map(() =>
    Array(userWords.length + 1).fill(0)
  );

  for (let i = 1; i <= targetWords.length; i++) {
    for (let j = 1; j <= userWords.length; j++) {
      if (targetWords[i - 1] === userWords[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const matches = dp[targetWords.length][userWords.length];
  const score = Math.round((matches / targetWords.length) * 100);

  scoreDisplay.innerHTML = `Your Score: <strong>${score}/100</strong>`;
  feedbackDisplay.innerText = `Expected: "${expectedText}"\nYou said: "${spokenText}"`;

}
