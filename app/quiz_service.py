import html
import random
import requests

API_URL = "https://opentdb.com/api.php"

CATEGORIES = {
    "science": 17,
    "technology": 18,
    "history": 23,
    "entertainment": 11,
}

def fetch_questions(category, difficulty, amount=10):
    if category not in CATEGORIES:
        raise ValueError("Invalid quiz category")

    if difficulty not in ("easy", "medium", "hard"):
        raise ValueError("Invalid difficulty")

    params = {
        "amount": amount,
        "category": CATEGORIES[category],
        "difficulty": difficulty,
        "type": "multiple",
    }

    response = requests.get(
        API_URL,
        params=params,
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

    if data.get("response_code") != 0:
        raise ValueError(
            "No questions available for this selection"
        )

    questions = []

    for item in data["results"]:
        correct_answer = html.unescape(
            item["correct_answer"]
        )

        incorrect_answers = [
            html.unescape(answer)
            for answer in item["incorrect_answers"]
        ]

        options = incorrect_answers + [correct_answer]
        random.shuffle(options)

        questions.append({
            "question": html.unescape(item["question"]),
            "options": options,
            "correct_answer": correct_answer,
        })

    return questions
