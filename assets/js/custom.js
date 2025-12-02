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

