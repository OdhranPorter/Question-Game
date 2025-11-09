# 🧠 Quiz Game

A clean, simple, and dynamic **quiz game** built using **vanilla HTML, CSS, and JavaScript**.  
The application fetches questions and answers from an external `questions.json` file, presents them one by one, and calculates the player’s final score in real-time.

> 🎯 *A fun, lightweight project demonstrating DOM manipulation, event handling, and asynchronous JavaScript.*

---

## ✨ Features

### ❓ Dynamic Question Loading
- Questions are **not hard-coded**.
- Loaded **asynchronously** from an external `questions.json` file using the **Fetch API**.
- Makes the game easily extensible with new question sets.

### 🖥️ Interactive UI
- Clean, responsive interface built with **HTML & CSS**.
- The **DOM updates dynamically** as players progress through the quiz.
- Multiple-choice answers rendered from the data source.

### ✅ Instant Feedback
- Immediate color-coded feedback after selecting an answer:
  - 🟩 **Green** — Correct  
  - 🟥 **Red** — Incorrect

### 💯 Score Tracking
- Keeps track of the player’s correct answers.
- Displays total score at the end of the game.

### 🔄 Restart Functionality
- The **"Next"** button moves to the following question.
- Converts to a **"Restart"** button on the final screen, allowing users to replay instantly.

---

## 🧰 Tech Stack

| Component | Technology |
|------------|-------------|
| **Frontend** | 🎨 HTML, CSS, JavaScript (ES6+) |
| **Data Source** | 📄 JSON file (`questions.json`) |
| **Browser API** | 📡 Fetch API (for asynchronous loading) |
