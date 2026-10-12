import uuid
import requests

from flask import (
    Blueprint,
    render_template,
    request,
    session,
    redirect,
    url_for,
    flash,
    jsonify,
)

from app.quiz_service import fetch_questions

main = Blueprint("main", __name__)

# Temporary server-side storage for active quizzes.
# We'll replace this with persistent storage if needed.
active_quizzes = {}

@main.route("/")
def home():
    return render_template("index.html")


@main.route("/health")
def health():
    return {"status": "ok"}

@main.route("/quiz", methods=["GET", "POST"])
def quiz():
    if request.method == "POST":
        category = request.form.get("category", "")
        difficulty = request.form.get("difficulty", "")

        if category not in {
            "science", "technology", "history", "entertainment"
        }:
            flash("Please select a valid category.")
            return redirect(url_for("main.home"))

        if difficulty not in {"easy", "medium", "hard"}:
            flash("Please select a valid difficulty.")
            return redirect(url_for("main.home"))

        try:
            questions = fetch_questions(category, difficulty)
        except (ValueError, requests.RequestException):
            flash("Couldn't load questions. Please try again.")
            return redirect(url_for("main.home"))

        quiz_id = uuid.uuid4().hex

        # Keep the answer key on the server.
        active_quizzes[quiz_id] = {
            "category": category,
            "difficulty": difficulty,
            "questions": questions,
            "current": 0,
            "score": 0,
            "history": [],
            "streak": 0,
            "best_streak": 0,
        }


        session["quiz_id"] = quiz_id
        return redirect(url_for("main.quiz"))

    quiz_id = session.get("quiz_id")
    quiz_data = active_quizzes.get(quiz_id)

    if not quiz_data:
        return redirect(url_for("main.home"))

    current = quiz_data["current"]
    questions = quiz_data["questions"]

    if current >= len(questions):
        return redirect(url_for("main.home"))

    question = questions[current]

    # Only send public question data to the template.
    safe_question = {
        "question": question["question"],
        "options": question["options"],
    }

    return render_template(
        "quiz.html",
        question=safe_question,
        question_number=current + 1,
        total_questions=len(questions),
        category=quiz_data["category"],
        difficulty=quiz_data["difficulty"],
    )

@main.route("/quiz/progress")
def quiz_progress():
    quiz_id = session.get("quiz_id")
    quiz_data = active_quizzes.get(quiz_id)

    if not quiz_data:
        return {"error": "Quiz session not found."}, 404

    total = len(quiz_data["questions"])
    answered = len(quiz_data["history"])
    score = quiz_data["score"]

    return {
        "answered": answered,
        "total": total,
        "remaining": total - answered,
        "score": score,
        "incorrect": answered - score,
        "accuracy": round((score / answered) * 100) if answered else 0,
        "completion": round((answered / total) * 100) if total else 0,
        "streak": quiz_data["streak"],
        "best_streak": quiz_data["best_streak"],
        "history": [
            {
                "question_number": index + 1,
                "is_correct": entry["is_correct"],
            }
            for index, entry in enumerate(quiz_data["history"])
        ],
    }

@main.route("/answer", methods=["POST"])
def answer():
    quiz_id = session.get("quiz_id")
    quiz_data = active_quizzes.get(quiz_id)

    if not quiz_data:
        flash("Your quiz session has expired. Please start again.")
        return redirect(url_for("main.home"))

    current = quiz_data["current"]
    questions = quiz_data["questions"]

    if current >= len(questions):
        return redirect(url_for("main.results"))

    selected_answer = request.form.get("answer")
    current_question = questions[current]
    options = current_question["options"]

    # Validate the submitted answer against this question's options.
    if selected_answer not in options:
        flash("Please select a valid answer.")
        return redirect(url_for("main.quiz"))

    correct_answer = current_question["correct_answer"]
    is_correct = selected_answer == correct_answer

    if is_correct:
        quiz_data["score"] += 1
        quiz_data["streak"] += 1
        quiz_data["best_streak"] = max(
            quiz_data["best_streak"],
            quiz_data["streak"],
        )
    else:
        quiz_data["streak"] = 0

    # Save the result for the live dashboard and final review.
    quiz_data["history"].append({
        "question": current_question["question"],
        "selected_answer": selected_answer,
        "correct_answer": correct_answer,
        "is_correct": is_correct,
    })

    quiz_data["current"] += 1

    if quiz_data["current"] >= len(questions):
        return redirect(url_for("main.results"))

    return redirect(url_for("main.quiz"))


@main.route("/results")
def results():
    quiz_id = session.get("quiz_id")
    quiz_data = active_quizzes.get(quiz_id)

    if not quiz_data:
        return redirect(url_for("main.home"))

    # Don't show results until every question has been answered.
    if quiz_data["current"] < len(quiz_data["questions"]):
        return redirect(url_for("main.quiz"))

    total = len(quiz_data["questions"])
    score = quiz_data["score"]

    return render_template(
        "results.html",
        score=score,
        total=total,
        percentage=round(score / total * 100) if total else 0,
        category=quiz_data["category"],
        difficulty=quiz_data["difficulty"],
        history=quiz_data["history"],
        best_streak=quiz_data["best_streak"],
    )
