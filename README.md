# AA-Multilingual-Accent-Tutoring-System-Using-Translation-APIs
A web-based multilingual accent tutoring system using speech recognition and translation APIs. Supports real-time translation, text-to-speech pronunciation, speech-based scoring, and accent improvement via YouTube videos. Designed with API fallback and caching for reliable demos.


##  Project Overview

The **AA Multilingual Accent Tutoring System** is designed to assist language learners in improving both **pronunciation accuracy** and **accent clarity** across multiple languages.  
It combines **speech recognition**, **text-to-speech synthesis**, **translation APIs**, and **intelligent scoring logic** to provide an interactive and reliable learning experience directly in the browser.

---

## 🚀 Key Features

- 🌐 **Multilingual Translation** (English, Hindi, French, Spanish, German)
- 🔊 **Text-to-Speech Pronunciation Playback**
- 🎤 **Real-Time Speech Recognition**
- 📊 **Position-Based Pronunciation Scoring**
- 🎥 **Accent & Pronunciation Videos via YouTube**
- 🔁 **Reliable Translation with API Fallback**
- 💾 **Client-Side Caching for Faster Responses**
- 👍👎 **User Feedback System**

---

## 🧠 How the System Works

1. User selects **source** and **target** languages.
2. Input text is translated using:
   - **Primary API:** MyMemory  
   - **Fallback API:** LibreTranslate (used if the primary API fails).
3. The translated sentence is:
   - Displayed on screen
   - Spoken aloud using Text-to-Speech.
4. The user records their voice while repeating the translated sentence.
5. Speech input is transcribed and compared with the expected sentence using **position-based word matching**.
6. A pronunciation score is calculated and displayed.
7. Relevant **YouTube pronunciation and accent training videos** are suggested.

---

## 🧮 Pronunciation Scoring Logic

- The translated sentence and spoken sentence are split into words.
- Words are compared **position by position**.
- Correct words at the correct position contribute to the score.

**Score Formula:**

Score = (Correctly Matched Words / Total Words) × 100

This ensures that **word order matters**, preventing incorrect sentence structures from receiving full scores.

---

## 🛠️ Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript
- **Speech Processing:** Web Speech API (SpeechRecognition, SpeechSynthesis)
- **Translation APIs:** MyMemory, LibreTranslate
- **Video Integration:** YouTube Data API v3
- **Caching:** localStorage / sessionStorage
- **Browser Support:** Google Chrome (recommended)

---

## 📷 Screenshots

<img width="1898" height="908" alt="Final Working Output Screenshot" src="https://github.com/user-attachments/assets/fb93c933-e54b-4e0a-9f18-9959ffb40f86" />

## 🎥 Demo Video


https://github.com/user-attachments/assets/a0851f82-fc89-41f7-8a28-9f011b6d98cb


## ✅ Advantages
- Fully browser-based (no backend required)
- Real-time pronunciation feedback
- Reliable even when translation APIs are rate-limited
- Designed for demos, presentations, and academic evaluation
- Easily extensible for AI-based pronunciation models

## 🔮 Future Enhancements
- Phoneme-level pronunciation analysis
- AI-based accent correction suggestions
- User performance tracking and analytics
- Offline mode with IndexedDB
- Gamified learning (badges, streaks, levels)

## 🎓 Academic Relevance
It is suitable for Semester 7 electives, mini-projects, demos, and viva presentations. This project aligns well with topics in:
- Speech Recognition
- Natural Language Processing (NLP)
- Human-Computer Interaction (HCI)
- Web-Based Intelligent Systems
