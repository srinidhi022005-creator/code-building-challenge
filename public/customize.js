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

let questions = [];

const container = document.getElementById("questions-area");

/* ========================= */
/* LOAD QUESTIONS */
/* ========================= */

function loadQuestions() {

  container.innerHTML = "";

  questions.forEach((q, qi) => {

    const card = document.createElement("div");
    card.className = "card";
    card.style.width = "80%";
    card.style.margin = "20px auto";
    card.style.padding = "20px";
    card.style.display = "block";

    /* 🔥 QUESTION LABEL */
    const qLabel = document.createElement("p");
    qLabel.innerText = `Question ${qi + 1}`;
    qLabel.style.fontWeight = "bold";
    qLabel.style.color = "#a855f7";
    qLabel.style.marginBottom = "10px";

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
lineBox.style.padding = "15px";
lineBox.style.border = "1px solid #7c3aed";
lineBox.style.borderRadius = "10px";
lineBox.style.background = "rgba(255,255,255,0.03)";

      /* 🔥 LINE LABEL (UPDATED STYLE) */
      const lineLabel = document.createElement("p");
      lineLabel.innerText = `Line ${li + 1}`;
      lineLabel.style.color = "#a78bfa";
      lineLabel.style.fontSize = "22px";       // ✅ BIGGER
      lineLabel.style.fontWeight = "bold";
      lineLabel.style.marginBottom = "10px";

      lineBox.appendChild(lineLabel);

      /* OPTIONS */
      line.forEach((opt, oi) => {

        const optLabel = document.createElement("p");
        optLabel.innerText = `Option ${oi + 1}`;
        optLabel.style.fontSize = "13px";

        const optInput = document.createElement("textarea");
        optInput.value = opt.trim();
        optInput.style.display = "block";
        optInput.style.width = "90%";
        optInput.style.marginBottom = "8px";

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
const divider = document.createElement("hr");
divider.style.margin = "30px 0";
divider.style.border = "1px solid #7c3aed";

card.appendChild(divider);
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

async function saveQuestions() {

  try {

    await fetch("/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(questions)
    });

    alert("Questions saved permanently ✅");

  } catch {
    alert("Error saving questions ❌");
  }

}

/* ========================= */
/* INIT */
/* ========================= */

window.onload = async function () {
  try {
    const res = await fetch("/questions");
    const data = await res.json();

    if (data.length === 0) {
      questions = defaultQuestions;
    } else {
      questions = data;
    }

    loadQuestions();

  } catch {
    alert("Error loading questions");
  }
};