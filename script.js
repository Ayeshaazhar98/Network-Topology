
const topologies = {
  star: {
    title: "Star Topology",
    description:
      "All computers connect to one central switch or hub. Data passes through this central device.",
    advantages:
      "Easy to manage, easy to troubleshoot, and one computer's link failure usually does not affect the others.",
    disadvantages:
      "If the central switch fails, communication between connected devices is disrupted.",
    uses:
      "Computer labs, offices, schools, and home networks.",
    nodes: [
      [300, 65, "PC 1"], [455, 120, "PC 2"],
      [420, 265, "PC 3"], [180, 265, "PC 4"],
      [145, 120, "PC 5"], [300, 170, "Switch"]
    ],
    edges: [[0,5],[1,5],[2,5],[3,5],[4,5]]
  },

  bus: {
    title: "Bus Topology",
    description:
      "All computers share one main communication cable called the backbone.",
    advantages:
      "Simple to set up for a small network and uses less cable than some other designs.",
    disadvantages:
      "A backbone failure can disrupt the entire network. Performance can decrease as traffic increases.",
    uses:
      "Older Ethernet LANs and basic network demonstrations.",
    nodes: [
      [100, 100, "PC 1"], [200, 240, "PC 2"],
      [300, 100, "PC 3"], [400, 240, "PC 4"],
      [500, 100, "PC 5"]
    ],
    edges: [],
    bus: true
  },

  ring: {
    title: "Ring Topology",
    description:
      "Each device connects to two neighbouring devices, forming a closed loop.",
    advantages:
      "Provides an orderly connection pattern; some ring systems use predictable access to the network.",
    disadvantages:
      "A single link or device failure can disrupt a basic ring unless protection is provided.",
    uses:
      "Some industrial networks and ring-based fibre communication systems.",
    nodes: [
      [300, 55, "PC 1"], [465, 125, "PC 2"],
      [420, 255, "PC 3"], [180, 255, "PC 4"],
      [135, 125, "PC 5"]
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,0]]
  },

  mesh: {
    title: "Mesh Topology",
    description:
      "Devices have multiple direct connections to other devices. A full mesh connects every pair.",
    advantages:
      "Multiple paths can improve reliability and provide alternative routes when a link fails.",
    disadvantages:
      "A full mesh needs many connections, increasing cost and complexity.",
    uses:
      "Wireless mesh networks, backbone networks, and critical communication systems.",
    nodes: [
      [300, 55, "PC 1"], [465, 125, "PC 2"],
      [420, 255, "PC 3"], [180, 255, "PC 4"],
      [135, 125, "PC 5"]
    ],
    edges: [
      [0,1],[0,2],[0,3],[0,4],
      [1,2],[1,3],[1,4],
      [2,3],[2,4],[3,4]
    ]
  },

  tree: {
    title: "Tree Topology",
    description:
      "Devices are arranged in levels, like branches of a tree, using a hierarchical structure.",
    advantages:
      "Easy to expand and organise into departments or groups.",
    disadvantages:
      "Failure of an important upper-level device or link can affect its downstream branches.",
    uses:
      "Large offices, campuses, and hierarchical enterprise networks.",
    nodes: [
      [300, 55, "Root"],
      [180, 145, "Switch A"], [420, 145, "Switch B"],
      [100, 255, "PC 1"], [230, 255, "PC 2"],
      [370, 255, "PC 3"], [500, 255, "PC 4"]
    ],
    edges: [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]]
  }
};

const diagram = document.getElementById("diagram");
const diagramTitle = document.getElementById("diagram-title");
const topologyName = document.getElementById("topology-name");
const description = document.getElementById("description");
const advantages = document.getElementById("advantages");
const disadvantages = document.getElementById("disadvantages");
const uses = document.getElementById("uses");

function drawTopology(key) {
  const topology = topologies[key];

  diagramTitle.textContent = topology.title;
  topologyName.textContent = topology.title;
  description.textContent = topology.description;
  advantages.textContent = topology.advantages;
  disadvantages.textContent = topology.disadvantages;
  uses.textContent = topology.uses;

  let svg = "";

  // Draw the shared backbone in Bus topology.
  if (topology.bus) {
    svg += `
      <line x1="55" y1="170" x2="545" y2="170"
        stroke="#64748b" stroke-width="5"
        stroke-linecap="round"/>
      <text x="300" y="198" text-anchor="middle"
        fill="#475569" font-size="13">Main Backbone Cable</text>
    `;

    topology.nodes.forEach((node) => {
      svg += `
        <line x1="${node[0]}" y1="${node[1] < 170 ? node[1] + 24 : node[1] - 24}"
          x2="${node[0]}" y2="170"
          stroke="#94a3b8" stroke-width="3"/>
      `;
    });
  }

  // Draw connections between nodes.
  topology.edges.forEach(([a, b]) => {
    const first = topology.nodes[a];
    const second = topology.nodes[b];

    svg += `
      <line x1="${first[0]}" y1="${first[1]}"
        x2="${second[0]}" y2="${second[1]}"
        stroke="#94a3b8" stroke-width="3"/>
    `;
  });

  // Draw computers and network devices.
  topology.nodes.forEach((node) => {
    const isSwitch = node[2].includes("Switch") ||
                     node[2] === "Root";

    const fill = isSwitch ? "#4338ca" : "#0f766e";
    const width = isSwitch ? 84 : 66;

    svg += `
      <g>
        <rect x="${node[0] - width / 2}"
          y="${node[1] - 20}"
          width="${width}" height="40"
          rx="10" fill="${fill}"
          stroke="white" stroke-width="2"/>
        <text x="${node[0]}" y="${node[1] + 5}"
          text-anchor="middle" fill="white"
          font-size="12" font-weight="bold">${node[2]}</text>
      </g>
    `;
  });

  diagram.innerHTML = svg;
}

// Change the diagram when a topology button is clicked.
document.querySelectorAll("[data-topology]").forEach((button) => {
  button.addEventListener("click", () => {
    drawTopology(button.dataset.topology);
  });
});

// Quiz questions.
const questions = [
  {
    question: "1. Which topology uses a central switch?",
    answers: ["Bus", "Star", "Ring", "Mesh"],
    correct: 1
  },
  {
    question: "2. Which topology connects every pair of devices in a full mesh?",
    answers: ["Tree", "Bus", "Mesh", "Star"],
    correct: 2
  },
  {
    question: "3. Which topology uses a main backbone cable?",
    answers: ["Ring", "Star", "Tree", "Bus"],
    correct: 3
  },
  {
    question: "4. Which topology has a hierarchical structure?",
    answers: ["Tree", "Ring", "Bus", "Star"],
    correct: 0
  }
];

let currentQuestion = 0;
let totalScore = 0;
let answered = false;

const questionText = document.getElementById("question");
const answersBox = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const scoreText = document.getElementById("score");

function showQuestion() {
  answered = false;
  const item = questions[currentQuestion];

  questionText.textContent = item.question;
  answersBox.innerHTML = "";
  feedback.textContent = "";
  nextButton.disabled = true;
  nextButton.textContent = "Next Question →";

  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer;

    button.addEventListener("click", () => {
      if (answered) return;

      answered = true;

      if (index === item.correct) {
        totalScore++;
        feedback.textContent = "Correct! Well done 🎉";
      } else {
        feedback.textContent =
          "Not quite. Correct answer: " +
          item.answers[item.correct];
      }

      scoreText.textContent =
        `Score: ${totalScore} / ${currentQuestion + 1}`;

      // Prevent changing the answer after selection.
      answersBox.querySelectorAll("button").forEach((b) => {
        b.disabled = true;
      });

      nextButton.disabled = false;

      if (currentQuestion === questions.length - 1) {
        nextButton.textContent = "See Final Result";
      }
    });

    answersBox.appendChild(button);
  });
}

nextButton.addEventListener("click", () => {
  if (!answered) return;

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion();
  } else {
    questionText.textContent = "Quiz Completed! 🎓";
    answersBox.innerHTML = "";
    feedback.textContent =
      `Your final score is ${totalScore} out of ${questions.length}.`;
    nextButton.textContent = "Try Again";
    nextButton.disabled = false;
    nextButton.onclick = () => {
      currentQuestion = 0;
      totalScore = 0;
      scoreText.textContent = "";
      nextButton.onclick = null;
      showQuestion();
    };
  }
});

// Show the first topology and quiz question.
drawTopology("star");
showQuestion();
