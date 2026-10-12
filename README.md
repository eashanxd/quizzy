# ⚡ Quizzy

**A modern, interactive quiz application built with Flask and vanilla JavaScript.**

Quizzy turns trivia into a focused, real-time learning experience. Choose a category and difficulty, answer multiple-choice questions, track your performance, and review your answers when the session ends.

## ✨ Features

- **Multiple categories:** Science, Technology, History, and Entertainment.
- **Adjustable difficulty:** Easy, Medium, and Hard.
- **Live performance tracking:** Monitor your score, accuracy, completion percentage, and current streak during a quiz.
- **Question-by-question review:** See your selected answers and the correct answers after completing a session.
- **Randomized answer options:** Options are shuffled to keep each question engaging.
- **Responsive interface:** Designed to work across desktop and mobile screens.
- **Dark and light themes:** Switch between themes to suit your preference.
- **Smooth animations:** Motion-powered interactions and transitions.
- **Live trivia data:** Fetches questions from the Open Trivia Database.
- **Session-based quiz flow:** Keeps track of progress as you move through a quiz.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Python | Application logic |
| Flask | Web framework and routing |
| Jinja2 | Server-rendered HTML templates |
| HTML5 | Page structure |
| CSS3 | Styling, responsive layouts, and themes |
| Vanilla JavaScript | Interactions and dynamic UI |
| Motion | Interface animations |
| Lucide | Icons |
| Requests | HTTP requests to the trivia API |
| Open Trivia Database | Trivia questions |

## 📁 Project Structure

```text
quizzy/
├── app/
│   ├── __init__.py
│   ├── routes.py
│   ├── quiz_service.py
│   ├── templates/
│   │   ├── base.html
│   │   ├── index.html
│   │   ├── quiz.html
│   │   └── results.html
│   └── static/
│       ├── css/
│       │   └── style.css
│       └── js/
│           └── app.js
├── .gitignore
├── requirements.txt
└── run.py
```

## 🚀 Getting Started

### Prerequisites

- Python 3.10 or later
- pip
- An internet connection to fetch trivia questions

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd quizzy
```

Replace `<YOUR_REPOSITORY_URL>` with your GitHub repository URL.

### 2. Create a virtual environment

**Linux / macOS**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

**Windows**

```powershell
py -m venv .venv
.venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the application

```bash
python run.py
```

Open the local URL printed in your terminal, typically:

```text
http://127.0.0.1:5000
```

## 🎮 How It Works

1. Choose a quiz category.
2. Select a difficulty level.
3. Start a quiz session.
4. Select an answer and submit it to continue.
5. Track your performance as you progress.
6. View your final score and review your answers.

## 🧠 Architecture

Quizzy uses a lightweight, server-rendered architecture.

- **Routes:** Handle quiz creation, answer submissions, progress requests, and results.
- **Quiz service:** Fetches questions from the Open Trivia Database, decodes HTML entities, and randomizes answer options.
- **Templates:** Render the homepage, quiz interface, and results page using Jinja2.
- **Frontend JavaScript:** Handles theme selection, category and difficulty interactions, animations, and live progress updates.
- **Session tracking:** Associates the user's browser session with its active quiz.

The server calculates scores and validates submitted answers. The frontend displays the resulting progress data.

## 📊 Live Progress

During a quiz, the progress interface can display:

- Current score
- Accuracy percentage
- Completion percentage
- Current correct-answer streak
- Question-by-question correctness indicators

After the quiz, the results page displays the final performance summary and answer review.

## 🔌 API

Quizzy uses the [Open Trivia Database](https://opentdb.com/) to retrieve multiple-choice questions.

Questions are requested by category and difficulty. The application then decodes HTML entities and shuffles the answer options before rendering the quiz.

The progress endpoint is available at:

```text
GET /quiz/progress
```

It returns progress information for the active quiz session.

## 🔮 Future Improvements

- [ ] Persistent storage for quiz history and scores
- [ ] User accounts and personal statistics
- [ ] Detailed explanations for answers
- [ ] Leaderboards and achievements
- [ ] Timed quiz mode
- [ ] More categories and configurable question counts
- [ ] Automated tests for quiz logic and routes
- [ ] Production-ready deployment and session storage

## 🔒 Current Limitations

- Active quizzes are stored in application memory, so restarting the server clears ongoing sessions.
- Quiz history is not permanently stored in a database.
- Trivia availability depends on the external API.
- A production deployment should use secure configuration, appropriate session management, and persistent storage where required.

## 🙌 Acknowledgements

- [Open Trivia Database](https://opentdb.com/) for the trivia questions.
- [Lucide](https://lucide.dev/) for icons.
- [Motion](https://motion.dev/) for animations.

## 📄 License

No license has been specified yet. Add a `LICENSE` file before presenting the project as open source.
