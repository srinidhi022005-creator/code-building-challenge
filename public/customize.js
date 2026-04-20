/* ✅ DEFAULT QUESTIONS */

const defaultQuestions = [
  {
    question: "Print numbers from 0 to 2 using a loop",
    lines: [
      [
        "for i in range(3):\n",
        "while True:\n",
        "for(i=0;i<3;i++)\n",
        "loop 3 times\n"
      ],
      [
        "    print(i)\n",
        "    echo(i)\n",
        "    System.out.println(i);\n",
        "    cout << i;\n"
      ]
    ]
  }
];

/* ✅ SAFE LOAD */

let questions;

const saved = localStorage.getItem("questions");

if (saved) {
  questions = JSON.parse(saved);
} else {
  questions = defaultQuestions;
  localStorage.setItem("questions", JSON.stringify(defaultQuestions));
}

const container = document.getElementById("questions-area");

/* ========================= */
/* LOAD QUESTIONS */
/* ========================= */

function loadQuestions() {

  container.innerHTML = "";

  questions.forEach((q, qi) => {

    const card = document.createElement("div");
    card.className = "card";

    /* 🔥 QUESTION LABEL */
    const qLabel = document.createElement("p");
    qLabel.innerText = `Question ${qi + 1}`;
    qLabel.style.fontWeight = "bold";

    const qInput = document.createElement("textarea");
    qInput.value = q.question;

    qInput.oninput = () => {
      questions[qi].question = qInput.value;
    };

    card.appendChild(qLabel);
    card.appendChild(qInput);

    /* ========================= */
    /* 🔥 LINES LOOP */
    /* ========================= */

    q.lines.forEach((line, li) => {

      const lineBox = document.createElement("div");
      lineBox.style.marginTop = "15px";
      lineBox.style.padding = "10px";
      lineBox.style.border = "1px solid #7c3aed";
      lineBox.style.borderRadius = "10px";

      /* 🔥 LINE LABEL (UPDATED STYLE) */
      const lineLabel = document.createElement("p");
      lineLabel.innerText = `Line ${li + 1}`;
      lineLabel.style.color = "#a78bfa";
      lineLabel.style.fontSize = "22px";       // ✅ BIGGER
      lineLabel.style.fontWeight = "bold";
      lineLabel.style.marginBottom = "10px";

      lineBox.appendChild(lineLabel);

      /* ❌ REMOVED WHITE INPUT BOX COMPLETELY */

      /* OPTIONS */
      line.forEach((opt, oi) => {

        const optLabel = document.createElement("p");
        optLabel.innerText = `Option ${oi + 1}`;
        optLabel.style.fontSize = "13px";

        const optInput = document.createElement("textarea");
        optInput.value = opt.trim();

        optInput.oninput = () => {
          questions[qi].lines[li][oi] = optInput.value + "\n";
        };

        lineBox.appendChild(optLabel);
        lineBox.appendChild(optInput);
      });

      /* ➖ DELETE LINE */
      const deleteLineBtn = document.createElement("button");
      deleteLineBtn.innerText = "Delete Line";
      deleteLineBtn.className = "btn secondary";
      deleteLineBtn.style.marginTop = "8px";

      deleteLineBtn.onclick = () => {
        if (q.lines.length > 1) {
          questions[qi].lines.splice(li, 1);
          loadQuestions();
        } else {
          alert("At least one line required");
        }
      };

      lineBox.appendChild(deleteLineBtn);

      card.appendChild(lineBox);
    });

    /* ========================= */
    /* ➕ ADD LINE BUTTON */
    /* ========================= */

    const addLineBtn = document.createElement("button");
    addLineBtn.innerText = "+ Add Line";
    addLineBtn.className = "btn secondary";
    addLineBtn.style.marginTop = "15px";

    addLineBtn.onclick = () => {

      questions[qi].lines.push([
        "Option 1\n",
        "Option 2\n",
        "Option 3\n",
        "Option 4\n"
      ]);

      loadQuestions();
    };

    card.appendChild(addLineBtn);

    /* ❌ DELETE QUESTION */

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete Question";
    deleteBtn.className = "btn secondary";
    deleteBtn.style.marginTop = "10px";

    deleteBtn.onclick = () => {
      if (confirm("Delete this question?")) {
        questions.splice(qi, 1);
        loadQuestions();
      }
    };

    card.appendChild(deleteBtn);

    container.appendChild(card);
  });
}

/* ========================= */
/* ADD QUESTION */
/* ========================= */

function addQuestion() {

  questions.push({
    question: "",
    lines: [
      ["Option 1\n", "Option 2\n", "Option 3\n", "Option 4\n"]
    ]
  });

  loadQuestions();
}

/* ========================= */
/* SAVE */
/* ========================= */

function saveQuestions() {

  localStorage.setItem("questions", JSON.stringify(questions));

  alert("Questions Saved Successfully ✅");
}

/* ========================= */
/* INIT */
/* ========================= */

window.onload = loadQuestions;