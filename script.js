// Elementos importantes del DOM
const startBtn = document.getElementById("start-btn");
const gameScreen = document.getElementById("game-screen");
const startScreen = document.getElementById("start-screen");
const questionEl = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const levelBanner = document.getElementById("level-banner");

let currentQuestionIndex = 0;
let score = 0;
let currentLevel = "easy";
let shuffledQuestions = [];
let questions = {};
let questionCount = 0;
let answerSelected = false;

// Carga las preguntas desde el archivo JSON
async function loadQuestions() {
  const response = await fetch("questions.json");
  const data = await response.json();
  return data;
}

// Inicia el juego, oculta la pantalla de inicio y muestra el juego
startBtn.addEventListener("click", async () => {
  questions = await loadQuestions();
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  setLevel("easy");
});

// Manejador para el boton "Siguiente"
nextBtn.addEventListener("click", () => {
  if (answerSelected) {
    currentQuestionIndex++;
    questionCount++;
    answerSelected = false; // Resetea el estado de seleccion

    // Cambia de nivel cada 10 preguntas
    if (questionCount % 10 === 0) {
      if (currentLevel === "easy") {
        setLevel("intermediate");
      } else if (currentLevel === "intermediate") {
        setLevel("professional");
      } else {
        endGame();
      }
    } else {
      if (currentQuestionIndex < shuffledQuestions.length) {
        setNextQuestion();
      }
    }
  }
});

// Reinicia el juego recargando la pagina
restartBtn.addEventListener("click", () => {
  location.reload();
});

// Configura el nivel actual y mezcla las preguntas
function setLevel(level) {
  currentLevel = level;
  shuffledQuestions = shuffleQuestions(questions[level]);
  currentQuestionIndex = 0;
  questionCount = 0;
  answerSelected = false;
  nextBtn.style.display = "none"; // Oculta el boton "Siguiente"
  displayLevelBanner();
  setNextQuestion();
}

// Muestra el banner del nivel
function displayLevelBanner() {
  levelBanner.textContent = `Nivel: ${
    currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)
  }`;
  levelBanner.style.display = "block";
  setTimeout(() => {
    levelBanner.style.display = "none";
  }, 2000);
}

// Prepara y muestra la siguiente pregunta
function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

// Muestra la pregunta y mezcla las opciones antes de mostrarlas
function showQuestion(question) {
  questionEl.textContent = question.question;
  optionsContainer.innerHTML = ""; // Limpia las opciones existentes
  const options = shuffleOptions(question.options); // Mezcla las opciones
  options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.textContent = option;
    button.addEventListener("click", selectAnswer);
    optionsContainer.appendChild(button);
  });
}

// Resetea el estado visual para la siguiente pregunta
function resetState() {
  Array.from(optionsContainer.children).forEach((button) => {
    button.classList.remove("correct");
    button.classList.remove("wrong");
    button.removeEventListener("click", selectAnswer);
  });
  nextBtn.style.display = "none"; // Oculta el boton "Siguiente"
}

// Maneja la seleccion de respuestas
function selectAnswer(e) {
  if (answerSelected) return; // Evita seleccionar multiples veces

  const selectedButton = e.target;
  const correct = shuffledQuestions[currentQuestionIndex].answer;

  answerSelected = true; // Marca que se selecciono una respuesta

  if (selectedButton.textContent === correct) {
    selectedButton.classList.add("correct");
    score++;
  } else {
    selectedButton.classList.add("wrong");
    showCorrectAnswer(); // Muestra la respuesta correcta si se falla
  }

  // Desactiva todas las opciones
  Array.from(optionsContainer.children).forEach((button) => {
    button.removeEventListener("click", selectAnswer);
  });

  // Muestra el boton "Siguiente" despues de la animacion
  setTimeout(() => {
    nextBtn.style.display = "block";
  }, 1000); // Ajusta el tiempo segun la duracion de la animacion
}

// Muestra la respuesta correcta con un brillo parpadeante
function showCorrectAnswer() {
  Array.from(optionsContainer.children).forEach((button) => {
    if (button.textContent === shuffledQuestions[currentQuestionIndex].answer) {
      button.classList.add("correct", "flash"); // Aplica las clases para parpadeo
    }
  });
}

// Finaliza el juego mostrando el puntaje
function endGame() {
  questionEl.textContent = `¡Juego terminado! Puntaje final: ${score} de 30`;
  optionsContainer.innerHTML = ""; // Limpia las opciones
  nextBtn.style.display = "none";
  restartBtn.style.display = "block"; // Muestra el boton para reiniciar
}

// Mezcla las preguntas aleatoriamente
function shuffleQuestions(questions) {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
  return questions;
}

// Mezcla las opciones aleatoriamente
function shuffleOptions(options) {
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return options;
}