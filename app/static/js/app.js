
/* ========================================
   Quizzy: Theme
======================================== */

const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");
const root = document.documentElement;

function applyTheme(theme) {
    const isLight = theme === "light";

    root.dataset.theme = theme;

    if (themeIcon) {
        themeIcon.textContent = isLight ? "☾" : "☀";
    }

    if (themeToggle) {
        themeToggle.setAttribute(
            "aria-label",
            isLight ? "Switch to dark theme" : "Switch to light theme"
        );
    }
}

const savedTheme = localStorage.getItem("quizzy-theme");
applyTheme(savedTheme === "light" ? "light" : "dark");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const nextTheme =
            root.dataset.theme === "dark" ? "light" : "dark";

        applyTheme(nextTheme);
        localStorage.setItem("quizzy-theme", nextTheme);
    });
}


/* ========================================
   Quiz setup: Category and difficulty
======================================== */

let selectedCategory = null;
let selectedDifficulty = "easy";

const categoryCards = document.querySelectorAll(".category-card");
const difficultyCards = document.querySelectorAll(".difficulty-card");
const setupMessage = document.querySelector("#setup-message");

categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
        categoryCards.forEach((item) => {
            item.classList.remove("is-selected");
            item.setAttribute("aria-pressed", "false");
        });

        card.classList.add("is-selected");
        card.setAttribute("aria-pressed", "true");

        selectedCategory = card.dataset.category;
        const categoryInput = document.querySelector("#selected-category");

        if (categoryInput) {
            categoryInput.value = selectedCategory;
        }

        if (setupMessage) {
            setupMessage.textContent =
                `Selected ${selectedCategory}. Now choose your difficulty.`;
        }
    });
});

difficultyCards.forEach((card) => {
    card.addEventListener("click", () => {
        difficultyCards.forEach((item) => {
            item.classList.remove("is-selected");
            item.setAttribute("aria-pressed", "false");
        });

        card.classList.add("is-selected");
        card.setAttribute("aria-pressed", "true");

        selectedDifficulty = card.dataset.difficulty;
        const difficultyInput = document.querySelector("#selected-difficulty");

        if (difficultyInput) {
            difficultyInput.value = selectedDifficulty;
        }

        if (setupMessage) {
            setupMessage.textContent =
                `Difficulty selected: ${selectedDifficulty}.`;
        }
    });
});

const quizSetupForm = document.querySelector("#quiz-setup-form");

if (quizSetupForm) {
    quizSetupForm.addEventListener("submit", (event) => {
        if (!selectedCategory) {
            event.preventDefault();

            if (setupMessage) {
                setupMessage.textContent =
                    "Choose a category before starting your quiz.";
            }

            document.querySelector("#categories")?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    });
}


/* ========================================
   Lucide icons
======================================== */

if (window.lucide) {
    window.lucide.createIcons();
}


/* ========================================
   Motion: purposeful interactions
======================================== */

(() => {
    if (window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches) {
        return;
    }

    if (!window.Motion) {
        console.warn(
            "Motion did not load. CSS interactions remain active."
        );
        return;
    }

    const { animate, inView, stagger } = window.Motion;

    document.querySelectorAll(".answer-option").forEach((option) => {
        const input = option.querySelector('input[type="radio"]');

        if (!input) return;

        input.addEventListener("change", () => {
            if (!input.checked) return;

            animate(
                option,
                { scale: [0.99, 1] },
                { duration: 0.18, ease: "easeOut" }
            );
        });
    });

    const answerForm = document.querySelector("#answer-form");

    if (answerForm) {
        answerForm.addEventListener("submit", (event) => {
            if (answerForm.dataset.submitting === "true") {
                return;
            }

            event.preventDefault();
            answerForm.dataset.submitting = "true";

            const panel = document.querySelector(".question-panel");

            if (!panel) {
                answerForm.submit();
                return;
            }

            animate(
                panel,
                { opacity: [1, 0], y: [0, -8] },
                { duration: 0.16, ease: "easeIn" }
            ).then(() => {
                answerForm.submit();
            });
        });
    }



    const heroContent = document.querySelector(".hero-content");
    const heroPanel = document.querySelector(".lab-panel");

    if (heroContent) {
        animate(
            heroContent,
            { opacity: [0, 1], y: [12, 0] },
            { duration: 0.45, ease: "easeOut" }
        );
    }

    if (heroPanel) {
        animate(
            heroPanel,
            { opacity: [0, 1], y: [8, 0] },
            { duration: 0.45, delay: 0.08, ease: "easeOut" }
        );
    }

    const categoryGrid = document.querySelector(".category-grid");

    if (categoryGrid && inView && stagger) {
        inView(categoryGrid, (element) => {
            const cards = element.querySelectorAll(".category-card");

            animate(
                cards,
                { opacity: [0, 1], y: [10, 0] },
                {
                    duration: 0.32,
                    delay: stagger(0.06),
                    ease: "easeOut"
                }
            );
        });
    }

    const setupPanel = document.querySelector(".setup-panel");

    if (setupPanel && inView) {
        inView(setupPanel, (element) => {
            animate(
                element,
                { opacity: [0, 1], y: [10, 0] },
                { duration: 0.35, ease: "easeOut" }
            );
        });
    }

    categoryCards.forEach((card) => {
        card.addEventListener("click", () => {
            animate(
                card,
                { scale: [0.985, 1] },
                { duration: 0.18, ease: "easeOut" }
            );
        });
    });
})();

(() => {
    const panel = document.querySelector("#live-stats");
    if (!panel) return;

    const scoreEl = document.querySelector("#live-score");
    const accuracyEl = document.querySelector("#live-accuracy");
    const streakEl = document.querySelector("#live-streak");
    const completedEl = document.querySelector("#live-completed");
    const historyEl = document.querySelector("#live-history");

    const updateProgress = async () => {
        try {
            const response = await fetch("/quiz/progress", {
                headers: { Accept: "application/json" },
                cache: "no-store"
            });

            if (!response.ok) return;

            const data = await response.json();

            scoreEl.textContent = `${data.score}/${data.total}`;
            accuracyEl.textContent = `${data.accuracy}%`;
            streakEl.textContent = data.streak;
            completedEl.textContent = `${data.completion}%`;

            historyEl.replaceChildren();

            data.history.forEach((entry) => {
                const dot = document.createElement("span");
                dot.className = `history-dot ${
                    entry.is_correct ? "correct" : "incorrect"
                }`;
                dot.textContent = entry.question_number;
                dot.title = `Question ${entry.question_number}: ${
                    entry.is_correct ? "Correct" : "Incorrect"
                }`;
                historyEl.appendChild(dot);
            });
        } catch (error) {
            console.error("Could not update quiz progress:", error);
        }
    };

    updateProgress();
    window.addEventListener("pageshow", updateProgress);
})();
