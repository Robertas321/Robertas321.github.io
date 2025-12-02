/* ============================================================
   CUSTOM FORM HANDLER – 11 laboratorinis darbas
=============================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector(".contact-form");

  if (!form) return;

  // Sukuriame vietą rezultatams atvaizduoti
  const output = document.createElement("div");
  output.id = "form-result";
  output.style.marginTop = "20px";
  output.style.padding = "15px";
  output.style.border = "2px dashed #009688";
  output.style.borderRadius = "10px";
  output.style.background = "#f9f9f9";
  form.appendChild(output);


  form.addEventListener("submit", function (e) {
    e.preventDefault();

    /* ================= Surenkame duomenis ================= */

    const data = {
      vardas:    document.getElementById("firstName").value,
      pavarde:   document.getElementById("lastName").value,
      email:     document.getElementById("email").value,
      tel:       document.getElementById("phone").value,
      adresas:   document.getElementById("address").value,

      q1: Number(document.getElementById("q1").value),
      q2: Number(document.getElementById("q2").value),
      q3: Number(document.getElementById("q3").value)
    };

    console.log("Gauti formos duomenys:", data);


    /* ================= Vidurkio skaičiavimas ================= */

    const avg = ((data.q1 + data.q2 + data.q3) / 3).toFixed(1);


    /* ================= Rezultatų atvaizdavimas ================= */

    output.innerHTML = `
      <h4>Įvesti duomenys:</h4>
      <p><b>Vardas:</b> ${data.vardas}</p>
      <p><b>Pavardė:</b> ${data.pavarde}</p>
      <p><b>El. paštas:</b> ${data.email}</p>
      <p><b>Tel. numeris:</b> ${data.tel}</p>
      <p><b>Adresas:</b> ${data.adresas}</p>

      <p><b>Vertinimai:</b>
        ${data.q1}, ${data.q2}, ${data.q3}
      </p>

      <h5>${data.vardas} ${data.pavarde}: ${avg}</h5>
    `;


    /* ================= POPUP pranešimas ================= */

    createPopup("✅ Duomenys pateikti sėkmingai!");

    // Forma išvaloma
    form.reset();

  });
});


/* ================= POPUP FUNKCIJA ================= */

function createPopup(message) {

  const popup = document.createElement("div");
  popup.innerText = message;
  popup.classList.add("custom-popup");

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.classList.add("show");
  }, 100);

  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 500);
  }, 2500);
}

/* Papildoma uzd */

/* ============================================================
   CUSTOM FORM HANDLER – 11 laboratorinis + VALIDACIJA
=============================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector(".contact-form");
  if (!form) return;

  const submitBtn = form.querySelector("button[type='submit']");

  const fields = {
    firstName: document.getElementById("firstName"),
    lastName:  document.getElementById("lastName"),
    email:     document.getElementById("email"),
    phone:     document.getElementById("phone"),
    address:   document.getElementById("address"),
    q1:        document.getElementById("q1"),
    q2:        document.getElementById("q2"),
    q3:        document.getElementById("q3")
  };

  /* =============================
     ERROR FIELD HELPERS
  ============================== */

  function createError(field, msg) {
    let err = field.parentElement.querySelector(".error-text");
    if (!err) {
      err = document.createElement("div");
      err.className = "error-text";
      field.parentElement.appendChild(err);
    }
    err.textContent = msg;
    field.classList.add("invalid");
  }

  function clearError(field) {
    field.classList.remove("invalid");
    const err = field.parentElement.querySelector(".error-text");
    if (err) err.remove();
  }

  /* =============================
     REGEX RULES
  ============================== */

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex  = /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž]+$/;

  /* =============================
     FIELD VALIDATORS
  ============================== */

  function validateText(field) {
    if (!field.value.trim()) {
      createError(field, "Laukas negali būti tuščias");
      return false;
    }
    clearError(field);
    return true;
  }

  function validateName(field) {
    if (!validateText(field)) return false;

    if (!nameRegex.test(field.value.trim())) {
      createError(field, "Naudokite tik raides");
      return false;
    }
    clearError(field);
    return true;
  }

  function validateEmail(field) {
    if (!validateText(field)) return false;

    if (!emailRegex.test(field.value.trim())) {
      createError(field, "Neteisingas el. pašto formatas");
      return false;
    }
    clearError(field);
    return true;
  }

  function validateAddress(field) {
    return validateText(field);     // tekstinis, be spec. ribojimų
  }

  /* =============================
     PHONE FORMATTER
  ============================== */

  function formatPhone() {

    let raw = fields.phone.value.replace(/\D/g,'');
    raw = raw.slice(0,11); // limit length

    if (raw.startsWith("370")) raw = raw.slice(3);
    if (raw.startsWith("8"))   raw = raw.slice(1);

    let result = "+370 ";

    if(raw.length > 0) result += raw.slice(0,1);
    if(raw.length > 1) result += raw.slice(1,3);
    if(raw.length > 3) result += " " + raw.slice(3,8);

    fields.phone.value = result.trim();
  }

  function validatePhone() {
    if (fields.phone.value.length !== 13) {
      createError(fields.phone, "Tel.: +370 6xx xxxxx");
      return false;
    }
    clearError(fields.phone);
    return true;
  }

  /* =============================
     VALIDATION CHECKER
  ============================== */

  function validateForm() {
    const checks = [
      validateName(fields.firstName),
      validateName(fields.lastName),
      validateEmail(fields.email),
      validateAddress(fields.address),
      validatePhone()
    ];

    submitBtn.disabled = !checks.every(Boolean);
  }

  submitBtn.disabled = true;

  /* =============================
     REAL-TIME INPUT EVENTS
  ============================== */

  fields.firstName.addEventListener("input", () => {
    validateName(fields.firstName);
    validateForm();
  });

  fields.lastName.addEventListener("input", () => {
    validateName(fields.lastName);
    validateForm();
  });

  fields.email.addEventListener("input", () => {
    validateEmail(fields.email);
    validateForm();
  });

  fields.address.addEventListener("input", () => {
    validateAddress(fields.address);
    validateForm();
  });

  fields.phone.addEventListener("input", () => {
    formatPhone();
    validatePhone();
    validateForm();
  });

  /* =============================
     SUBMIT HANDLER
  ============================== */

  const output = document.getElementById("form-result");

  form.addEventListener("submit", e => {
    e.preventDefault();

    validateForm();
    if(submitBtn.disabled) return;

    const data = {
      vardas:  fields.firstName.value,
      pavarde: fields.lastName.value,
      email:   fields.email.value,
      tel:     fields.phone.value,
      adresas: fields.address.value,
      q1:  Number(fields.q1.value),
      q2:  Number(fields.q2.value),
      q3:  Number(fields.q3.value)
    };

    console.log(data);

    const avg = ((data.q1+data.q2+data.q3)/3).toFixed(1);

    output.innerHTML = `
      <p>Vardas: ${data.vardas}</p>
      <p>Pavardė: ${data.pavarde}</p>
      <p>El. paštas: ${data.email}</p>
      <p>Tel.: ${data.tel}</p>
      <p>Adresas: ${data.adresas}</p>

      <h4>${data.vardas} ${data.pavarde}: ${avg}</h4>
    `;

    createPopup("✅ Duomenys pateikti sėkmingai!");
    form.reset();
    submitBtn.disabled = true;
  });

});


/* =============================
   POPUP
============================= */

function createPopup(msg) {
  const p = document.createElement("div");
  p.className = "custom-popup";
  p.innerText = msg;
  document.body.appendChild(p);

  setTimeout(() => p.classList.add("show"), 100);
  setTimeout(() => {
    p.classList.remove("show");
    setTimeout(()=>p.remove(),400);
  }, 2500);
}

/* Zaidimas*/
/* Zaidimas*/
(() => {

  // 🍎 Vaisių duomenų rinkinys (bent 12 vaisių)
  const FRUITS = [
    "🍎", "🍌", "🍇", "🍒", "🍓", "🍍",
    "🥝", "🍑", "🍉", "🍐", "🥥", "🍊"
  ];

  // DOM elementai
  const gameBoard = document.getElementById("gameBoard");
  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");
  const movesEl = document.getElementById("moves");
  const matchesEl = document.getElementById("matches");
  const timerEl = document.getElementById("timer");
  const winMessage = document.getElementById("winMessage");
  const finalTime = document.getElementById("finalTime");
  const finalMoves = document.getElementById("finalMoves");

  // Sudėtingumo lygių nustatymai
  const DIFFICULTY = {
    easy: { cols: 4, rows: 3 }, // 12 kortelių → 6 poros
    hard: { cols: 6, rows: 4 }  // 24 kortelės → 12 porų
  };

  // LocalStorage raktai
  const BEST_KEYS = {
    easy: "memory_best_easy",
    hard: "memory_best_hard"
  };

  // Žaidimo būsena
  let difficulty = "easy";
  let deck = [];
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moves = 0;
  let matches = 0;
  let timerInterval = null;
  let seconds = 0;
  let gameStarted = false;

  function formatTime(s) {
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function getSelectedDifficulty() {
    return document.querySelector("input[name='difficulty']:checked").value;
  }

  // Sudaro kortelių rinkinį
  function buildDeck() {
    difficulty = getSelectedDifficulty();
    const size = DIFFICULTY[difficulty].cols * DIFFICULTY[difficulty].rows;
    const needed = size / 2;

    deck = [...FRUITS.slice(0, needed), ...FRUITS.slice(0, needed)];
    shuffle(deck);
  }

  // Sukuria žaidimo lentą
  function renderBoard() {
    gameBoard.innerHTML = "";
    gameBoard.className = "game-board " + difficulty;

    deck.forEach((fruit, index) => {
      const card = document.createElement("div");
      card.className = "game-card";
      card.dataset.fruit = fruit;
      card.dataset.index = index;

      const inner = document.createElement("div");
      inner.className = "card-inner";

      // BACK SIDE (visible by default)
      const back = document.createElement("div");
      back.className = "card-face card-back";
      back.textContent = "❓";

      // FRONT SIDE (fruit)
      const front = document.createElement("div");
      front.className = "card-face card-front";
      front.textContent = fruit;

      inner.append(back, front);
      card.appendChild(inner);

      card.addEventListener("click", onCardClick);
      gameBoard.appendChild(card);
    });
  }

  // Konkretus kortelės paspaudimas
  function onCardClick(e) {
    const card = e.currentTarget;
    const inner = card.querySelector(".card-inner");

    if (lockBoard || inner.classList.contains("flipped") || inner.classList.contains("matched")) {
      return;
    }

    if (!gameStarted) startGame();

    inner.classList.add("flipped");

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    lockBoard = true;

    moves++;
    movesEl.textContent = moves;

    checkMatch();
  }

  function checkMatch() {
    const fruit1 = firstCard.dataset.fruit;
    const fruit2 = secondCard.dataset.fruit;

    if (fruit1 === fruit2) {
      // Match
      firstCard.querySelector(".card-inner").classList.add("matched");
      secondCard.querySelector(".card-inner").classList.add("matched");

      matches++;
      matchesEl.textContent = matches;

      firstCard = null;
      secondCard = null;
      lockBoard = false;

      if (matches === deck.length / 2) {
        winGame();
      }
    } else {
      // No match
      setTimeout(() => {
        firstCard.querySelector(".card-inner").classList.remove("flipped");
        secondCard.querySelector(".card-inner").classList.remove("flipped");
        firstCard = null;
        secondCard = null;
        lockBoard = false;
      }, 1000);
    }
  }

  function startGame() {
    gameStarted = true;
    startTimer();
  }

  function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
      seconds++;
      timerEl.textContent = formatTime(seconds);
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function winGame() {
    stopTimer();
    gameStarted = false;

    winMessage.classList.remove("d-none");
    finalTime.textContent = formatTime(seconds);
    finalMoves.textContent = moves;

    saveBestScore();
    loadBestScores(); // Atnaujiname statistiką iškart po laimėjimo
  }

  function saveBestScore() {
    const key = BEST_KEYS[difficulty];
    const current = { moves, time: seconds };
    const previous = JSON.parse(localStorage.getItem(key));

    let isBetter = false;

    if (!previous) isBetter = true;
    else if (current.moves < previous.moves) isBetter = true;
    else if (current.moves === previous.moves && current.time < previous.time) isBetter = true;

    if (isBetter) {
      localStorage.setItem(key, JSON.stringify(current));
    }
  }

  // Funkcija, kuri nuskaito ir atvaizduoja geriausius rezultatus
  function loadBestScores() {
    const bestEasy = JSON.parse(localStorage.getItem(BEST_KEYS.easy));
    const bestHard = JSON.parse(localStorage.getItem(BEST_KEYS.hard));

    document.getElementById("best-easy").textContent = bestEasy
      ? `Ėjimai: ${bestEasy.moves} / Laikas: ${formatTime(bestEasy.time)}`
      : "--";

    document.getElementById("best-hard").textContent = bestHard
      ? `Ėjimai: ${bestHard.moves} / Laikas: ${formatTime(bestHard.time)}`
      : "--";
  }


  function resetGame(start = false) {
    stopTimer();
    seconds = 0;
    timerEl.textContent = "00:00";

    moves = 0;
    matches = 0;

    movesEl.textContent = "0";
    matchesEl.textContent = "0";

    firstCard = null;
    secondCard = null;
    lockBoard = false;
    gameStarted = false;
    winMessage.classList.add("d-none");

    buildDeck();
    renderBoard();

    if (start) startGame();
  }

  // Event listeners
  startBtn.addEventListener("click", () => resetGame(true));
  resetBtn.addEventListener("click", () => resetGame(true));

  document.querySelectorAll("input[name='difficulty']").forEach((radio) => {
    radio.addEventListener("change", () => resetGame(false));
  });

  // Inicializacija
  loadBestScores(); // Įkelti rezultatus puslapio užkrovimo metu
  resetGame(false);

})();

