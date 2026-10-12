
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");
const root = document.documentElement;

function applyTheme(theme) {
    const isLight = theme === "light";

    root.dataset.theme = theme;
    themeIcon.textContent = isLight ? "☾" : "☀";
    themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
    );
}

const savedTheme = localStorage.getItem("quizzy-theme");
applyTheme(savedTheme === "light" ? "light" : "dark");

themeToggle.addEventListener("click", () => {
    const nextTheme =
        root.dataset.theme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
    localStorage.setItem("quizzy-theme", nextTheme);
});


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

        if (setupMessage) {
            setupMessage.textContent =
                `Difficulty selected: ${selectedDifficulty}.`;
        }
    });
});

const startQuizButton = document.querySelector("#start-quiz");

if (startQuizButton) {
    startQuizButton.addEventListener("click", () => {
        if (!selectedCategory) {
            setupMessage.textContent =
                "Choose a category before starting your quiz.";
            document.querySelector("#categories").scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            return;
        }

        setupMessage.textContent =
            `Ready to start ${selectedCategory} at ${selectedDifficulty} difficulty. Quiz integration is our next milestone.`;
    });
}
