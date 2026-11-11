const questions = [
  {
    id: "date",
    text: "Can I take you out on a date?",
    choices: ["Yes", "Maybe..", "No..."]
  },
  {
    id: "like",
    text: "我很喜欢你,你喜欢我吗?",
    choices: ["喜欢!", "一点点..", "🙂‍↔️"]
  },
  {
    id: "activity",
    text: "What would you like to do?",
    choices: ["Dessert", "Activity", "Movies", "Surprise me!"]
  },
  {
    id: "food",
    text: "I want to take you out for dinner.. what should we get?",
    choices: ["Chinese", "Japanese", "Korean", "Italian"]
  },
  {
    id: "day",
    text: "Pick a day for our date!",
    type: "calendar",
    choices: []
  }
];

const reactionMessages = ["Yay!", "尊嘟假嘟??", "Sounds fun 😊", "Yummy yummy", "So excited!"];
const GOOGLE_SHEET_URL = "";

const PASSWORD = "";

const state = {
  currentIndex: 0,
  answers: {},
  firstRejectedChoice: null,
  transitionTimeout: null,
  isTransitioning: false
};

const passwordScreen = document.getElementById("password-screen");
const passwordInput = document.getElementById("password-input");
const passwordSubmit = document.getElementById("password-submit");
const passwordError = document.getElementById("password-error");
const progressText = document.getElementById("progress-text");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options");
const questionArea = document.getElementById("question-area");
const resultPanel = document.getElementById("result-panel");
const summary = document.getElementById("summary");
const submitBtn = document.getElementById("submit-btn");
const restartBtn = document.getElementById("restart-btn");

function unlockExperience() {
  passwordScreen.classList.add("hidden");
  document.querySelector(".app-shell").classList.remove("hidden");
  renderQuestion();
}

function handlePasswordSubmit() {
  const value = passwordInput.value.trim();

  if (value === PASSWORD) {
    unlockExperience();
    return;
  }

  passwordError.classList.remove("hidden");
  passwordInput.value = "";
  passwordInput.focus();
}

function renderQuestion() {
  const currentQuestion = questions[state.currentIndex];

  state.isTransitioning = true;
  questionArea.classList.remove("is-transitioning");
  questionArea.classList.remove("card-enter");
  void questionArea.offsetWidth;
  questionArea.classList.add("card-enter");

  progressText.textContent = `Question ${state.currentIndex + 1} of ${questions.length}`;
  questionText.textContent = currentQuestion.text;
  optionsContainer.innerHTML = "";

  setTimeout(() => {
    state.isTransitioning = false;
  }, 1400);

  if (currentQuestion.type === "calendar") {
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.className = "date-input";
    dateInput.min = new Date().toISOString().split("T")[0];
    dateInput.value = dateInput.min;

    const submitButton = document.createElement("button");
    submitButton.type = "button";
    submitButton.className = "option-btn";
    submitButton.textContent = "I'm free that day!";
    submitButton.addEventListener("click", () => {
      submitButton.classList.remove("clicked");
      void submitButton.offsetWidth;
      submitButton.classList.add("clicked");
      handleAnswer(dateInput.value);
    });

    optionsContainer.appendChild(dateInput);
    optionsContainer.appendChild(submitButton);
    return;
  }

  const isFirstQuestion = state.currentIndex === 0;
  const isSecondQuestion = state.currentIndex === 1;

  currentQuestion.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";
    button.textContent = choice;

    if (isFirstQuestion && (choice === "Maybe.." || choice === "No...")) {
      button.classList.add("rejected-option");
    }

    if (isSecondQuestion && choice === "🙂‍↔️") {
      button.classList.add("rejected-option");
    }

    button.addEventListener("click", () => {
      if (state.isTransitioning) {
        return;
      }

      if (isFirstQuestion && (choice === "Maybe.." || choice === "No...")) {
        const otherRejectChoice = ["Maybe..", "No..."].find((value) => value !== choice);

        if (!state.firstRejectedChoice) {
          state.firstRejectedChoice = choice;
          button.classList.add("locked");
          button.disabled = true;
          button.textContent = "Please..";

          const otherButton = [...optionsContainer.querySelectorAll(".option-btn")].find(
            (option) => option.textContent === otherRejectChoice
          );

          if (otherButton) {
            otherButton.disabled = false;
            otherButton.classList.remove("locked");
            otherButton.textContent = otherRejectChoice;
          }
          return;
        }

        if (choice !== state.firstRejectedChoice) {
          button.classList.add("locked");
          button.disabled = true;
          button.textContent = "PLEAAAASEE?! 😭";
          return;
        }

        return;
      }

      if (isSecondQuestion && choice === "🙂‍↔️") {
        button.classList.add("locked");
        button.disabled = true;
        button.textContent = "🙄";
        return;
      }

      button.classList.remove("clicked");
      void button.offsetWidth;
      button.classList.add("clicked");
      handleAnswer(choice);
    });

    optionsContainer.appendChild(button);
  });
}

function handleAnswer(choice) {
  const currentQuestion = questions[state.currentIndex];
  state.answers[currentQuestion.id] = choice;

  const savedAnswers = JSON.stringify(state.answers);
  localStorage.setItem("dateQuestionnaire", savedAnswers);
  console.log("Saved answers:", savedAnswers);

  if (state.currentIndex < questions.length - 1) {
    state.isTransitioning = true;
    const reaction = reactionMessages[state.currentIndex] || "Yay!";
    progressText.textContent = "";
    questionText.textContent = reaction;
    questionText.classList.remove("reaction-enter");
    void questionText.offsetWidth;
    questionText.classList.add("reaction-enter");
    optionsContainer.innerHTML = "";

    if (state.transitionTimeout) {
      clearTimeout(state.transitionTimeout);
    }

    state.transitionTimeout = setTimeout(() => {
      questionArea.classList.add("is-transitioning");
    }, 2400);

    setTimeout(() => {
      state.isTransitioning = false;
      state.currentIndex += 1;
      renderQuestion();
    }, 3000);
    return;
  }

  state.isTransitioning = true;
  progressText.textContent = "";
  questionText.textContent = "Yesss!";
  questionText.classList.remove("reaction-enter");
  void questionText.offsetWidth;
  questionText.classList.add("reaction-enter");
  optionsContainer.innerHTML = "";

  if (state.transitionTimeout) {
    clearTimeout(state.transitionTimeout);
  }

  state.transitionTimeout = setTimeout(() => {
    questionArea.classList.add("is-transitioning");
  }, 2400);

  setTimeout(() => {
    questionArea.classList.add("is-transitioning");
  }, 2000);

  setTimeout(() => {
    state.isTransitioning = false;
    showSummary();
  }, 3000);
}

function showSummary() {
  questionArea.classList.add("hidden");
  resultPanel.classList.remove("hidden");

  summary.innerHTML = questions
    .map((question) => {
      const answer = state.answers[question.id] || "No answer yet";
      return `
        <div class="summary-item">
          <span>${question.text}</span>
          <strong>${answer}</strong>
        </div>
      `;
    })
    .join("");
}

function restartQuiz() {
  if (state.transitionTimeout) {
    clearTimeout(state.transitionTimeout);
    state.transitionTimeout = null;
  }

  state.isTransitioning = true;
  questionArea.classList.remove("hidden");
  resultPanel.classList.add("hidden");
  progressText.textContent = "";
  questionText.textContent = "公主 Tina 怎么这么纠结啊 🙃?";
  questionText.classList.remove("reaction-enter");
  void questionText.offsetWidth;
  questionText.classList.add("reaction-enter");
  optionsContainer.innerHTML = "";

  setTimeout(() => {
    questionArea.classList.add("is-transitioning");
  }, 1800);

  setTimeout(() => {
    state.currentIndex = 0;
    state.answers = {};
    state.firstRejectedChoice = null;
    state.isTransitioning = false;
    localStorage.removeItem("dateQuestionnaire");
    questionArea.classList.remove("is-transitioning");
    renderQuestion();
  }, 2600);
}

if (submitBtn) {
  submitBtn.addEventListener("click", async () => {
    const savedAnswers = JSON.stringify(state.answers);
    localStorage.setItem("dateQuestionnaire-final", savedAnswers);

    if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL.includes("PASTE_")) {
      alert("Add your Google Apps Script web app URL to the GOOGLE_SHEET_URL constant in script.js before submitting.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          answers: state.answers,
          submittedAt: new Date().toISOString()
        })
      });

      alert("You make me feel so luckyy!");
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Uh oh.. something went wrong. Please try again later.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
    }
  });
}

if (passwordSubmit) {
  passwordSubmit.addEventListener("click", handlePasswordSubmit);
}

if (passwordInput) {
  passwordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handlePasswordSubmit();
    }
  });

  passwordInput.focus();
}

if (restartBtn) {
  restartBtn.addEventListener("click", restartQuiz);
}
