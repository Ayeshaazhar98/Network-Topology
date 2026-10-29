
const topologies = {
  star: {
    title: "Star Topology",
    description:
      "All computers connect to a central switch. Data travels through the switch to reach its destination.",
    advantages:
      "Easy to manage and troubleshoot. Failure of one computer's link usually does not affect other computers.",
    disadvantages:
      "Failure of the central switch can disrupt communication across the network.",
    uses: "College computer labs, offices and home Ethernet networks.",
    fact: "The central switch is the key connection point in a star network.",
    nodes: [
      { x: 300, y: 55, label: "PC 1", type: "pc" },
      { x: 475, y: 125, label: "PC 2", type: "pc" },
      { x: 425, y: 280, label: "PC 3", type: "pc" },
      { x: 175, y: 280, label: "PC 4", type: "pc" },
      { x: 125, y: 125, label: "PC 5", type: "pc" },
      { x: 300, y: 175, label: "Switch", type: "switch" }
    ],
    edges: [[0,5],[1,5],[2,5],[3,5],[4,5]]
  },

  bus: {
    title: "Bus Topology",
    description:
      "All computers share a common backbone cable. The backbone carries communication between connected devices.",
    advantages:
      "A simple bus design can use less cable and is easy to demonstrate in a small model.",
    disadvantages:
      "A backbone failure can disrupt the entire network. Performance may decrease as traffic increases.",
    uses: "Older Ethernet LANs and educational network demonstrations.",
    fact: "Traditional bus networks use a shared backbone with terminators at both ends.",
    nodes: [
      { x: 90, y: 95, label: "PC 1", type: "pc" },
      { x: 195, y: 265, label: "PC 2", type: "pc" },
      { x: 300, y: 95, label: "PC 3", type: "pc" },
      { x: 405, y: 265, label: "PC 4", type: "pc" },
      { x: 510, y: 95, label: "PC 5", type: "pc" },
      { x: 300, y: 180, label: "Backbone", type: "backbone" }
    ],
    edges: [[0,5],[1,5],[2,5],[3,5],[4,5]]
  },

  ring: {
    title: "Ring Topology",
    description:
      "Each computer connects to two neighbouring devices, forming a closed loop.",
    advantages:
      "The connection structure is orderly. Some ring systems offer predictable data access.",
    disadvantages:
      "A basic ring may be disrupted by a failed link or device unless protection is provided.",
    uses: "Some industrial networks and ring-based fibre communication systems.",
    fact: "A ring connects back to its starting point, forming a closed loop.",
    nodes: [
      { x: 300, y: 55, label: "PC 1", type: "pc" },
      { x: 475, y: 125, label: "PC 2", type: "pc" },
      { x: 425, y: 275, label: "PC 3", type: "pc" },
      { x: 175, y: 275, label: "PC 4", type: "pc" },
      { x: 125, y: 125, label: "PC 5", type: "pc" }
    ],
    edges: [[0,1],[1,2],[2,3],[3,4],[4,0]]
  },

  mesh: {
    title: "Mesh Topology",
    description:
      "Devices have multiple connections to other devices. In a full mesh, every pair has a direct connection.",
    advantages:
      "Multiple paths can provide alternative routes when a connection fails.",
    disadvantages:
      "A full mesh requires many links, increasing installation costs and complexity.",
    uses: "Wireless mesh systems and critical communication networks.",
    fact: "A full mesh of five devices has ten unique pairwise connections.",
    nodes: [
      { x: 300, y: 55, label: "PC 1", type: "pc" },
      { x: 475, y: 125, label: "PC 2", type: "pc" },
      { x: 425, y: 275, label: "PC 3", type: "pc" },
      { x: 175, y: 275, label: "PC 4", type: "pc" },
      { x: 125, y: 125, label: "PC 5", type: "pc" }
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
      "Devices are arranged hierarchically, with upper-level devices connecting to lower-level branches.",
    advantages:
      "Easy to expand and organise large networks into departments or sections.",
    disadvantages:
      "Failure of an important upper-level device or link can affect devices in its branch.",
    uses: "Large offices, universities and campus networks.",
    fact: "Tree topology combines hierarchical organisation with branching connections.",
    nodes: [
      { x: 300, y: 55, label: "Core", type: "router" },
      { x: 175, y: 145, label: "Switch A", type: "switch" },
      { x: 425, y: 145, label: "Switch B", type: "switch" },
      { x: 100, y: 270, label: "PC 1", type: "pc" },
      { x: 230, y: 270, label: "PC 2", type: "pc" },
      { x: 370, y: 270, label: "PC 3", type: "pc" },
      { x: 500, y: 270, label: "PC 4", type: "pc" }
    ],
    edges: [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]]
  }
};

const diagram = document.getElementById("diagram");
const diagramTitle = document.getElementById("diagram-title");
const deviceCount = document.getElementById("device-count");

const topologyName = document.getElementById("topology-name");
const description = document.getElementById("description");
const advantages = document.getElementById("advantages");
const disadvantages = document.getElementById("disadvantages");
const uses = document.getElementById("uses");
const quickFact = document.getElementById("quick-fact");

const sourceSelect = document.getElementById("source");
const destinationSelect = document.getElementById("destination");
const sendButton = document.getElementById("send-data");
const transferStatus = document.getElementById("transfer-status");

let currentTopology = "star";
let transferInProgress = false;

// Create SVG elements safely.
function svgElement(tag, attributes = {}, textContent = "") {
  const element = document.createElementNS(
    "http://www.w3.org/2000/svg",
    tag
  );

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  if (textContent) {
    element.textContent = textContent;
  }

  return element;
}

// Get connections for the selected topology.
function getConnections(topology) {
  const graph = topology.nodes.map(() => []);

  topology.edges.forEach(([a, b]) => {
    graph[a].push(b);
    graph[b].push(a);
  });

  return graph;
}

// Find the shortest path through connected devices.
function findPath(graph, start, end) {
  const queue = [[start]];
  const visited = new Set([start]);

  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];

    if (current === end) {
      return path;
    }

    for (const next of graph[current]) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([...path, next]);
      }
    }
  }

  return null;
}

// Draw the current network.
function drawTopology(key) {
  currentTopology = key;

  const topology = topologies[key];

  diagram.replaceChildren();

  diagramTitle.textContent = topology.title;
  topologyName.textContent = topology.title;
  description.textContent = topology.description;
  advantages.textContent = topology.advantages;
  disadvantages.textContent = topology.disadvantages;
  uses.textContent = topology.uses;
  quickFact.textContent = topology.fact;

  deviceCount.textContent = `${topology.nodes.length} nodes`;

  document.querySelectorAll("[data-topology]").forEach(button => {
    const isActive = button.dataset.topology === key;

    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  // Draw the bus backbone as a long shared cable.
  if (key === "bus") {
    diagram.appendChild(svgElement("line", {
      x1: 55,
      y1: 180,
      x2: 545,
      y2: 180,
      class: "network-edge",
      "stroke-width": 5
    }));

    // Terminators at both ends of the backbone.
    [55, 545].forEach(x => {
      diagram.appendChild(svgElement("rect", {
        x: x - 4,
        y: 170,
        width: 8,
        height: 20,
        rx: 2,
        fill: "#8b7cff"
      }));
    });

    diagram.appendChild(svgElement("text", {
      x: 300,
      y: 204,
      fill: "#9ba9c5",
      "font-size": 11,
      "text-anchor": "middle"
    }, "Shared Backbone"));
  }

  // Draw all network links.
  topology.edges.forEach(([a, b]) => {
    const first = topology.nodes[a];
    const second = topology.nodes[b];

    if (key === "bus") {
      // Each computer connects to the shared backbone.
      const pc = first.type === "pc" ? first : second;

      diagram.appendChild(svgElement("line", {
        x1: pc.x,
        y1: pc.y,
        x2: pc.x,
        y2: 180,
        class: "network-edge"
      }));

      return;
    }

    diagram.appendChild(svgElement("line", {
      x1: first.x,
      y1: first.y,
      x2: second.x,
      y2: second.y,
      class: "network-edge",
      "data-edge": `${a}-${b}`
    }));
  });

  // Draw devices over the connections.
  topology.nodes.forEach((node, index) => {
    if (node.type === "backbone") return;

    const isPC = node.type === "pc";
    const width = isPC ? 66 : 84;
    const height = 38;

    const group = svgElement("g", {
      "data-node": index
    });

    group.appendChild(svgElement("rect", {
      x: node.x - width / 2,
      y: node.y - height / 2,
      width,
      height,
      rx: 9,
      class: isPC ? "node-box" : "node-box node-switch"
    }));

    group.appendChild(svgElement("circle", {
      cx: node.x - width / 2 + 10,
      cy: node.y - 5,
      r: 3,
      fill: isPC ? "#4ee5d5" : "#8b7cff"
    }));

    group.appendChild(svgElement("text", {
      x: node.x,
      y: node.y + 6,
      class: "node-label"
    }, node.label));

    diagram.appendChild(group);
  });

  // Populate computer dropdowns for this topology.
  const computers = topology.nodes
    .map((node, index) => ({ ...node, index }))
    .filter(node => node.type === "pc");

  sourceSelect.replaceChildren();
  destinationSelect.replaceChildren();

  computers.forEach(pc => {
    const sourceOption = document.createElement("option");
    sourceOption.value = pc.index;
    sourceOption.textContent = pc.label;
    sourceSelect.appendChild(sourceOption);

    const destinationOption = document.createElement("option");
    destinationOption.value = pc.index;
    destinationOption.textContent = pc.label;
    destinationSelect.appendChild(destinationOption);
  });

  // Default to two different computers.
  if (computers.length > 1) {
    sourceSelect.value = String(computers[0].index);
    destinationSelect.value = String(computers[1].index);
  }

  transferStatus.textContent = "Ready to send data.";
  sendButton.disabled = false;
}

// Topology selection.
document.querySelectorAll("[data-topology]").forEach(button => {
  button.addEventListener("click", () => {
    if (transferInProgress) return;

    drawTopology(button.dataset.topology);
  });
});

// Animate a packet along one connection.
function animatePacket(from, to) {
  return new Promise(resolve => {
    const packet = svgElement("circle", {
      cx: from.x,
      cy: from.y,
      r: 7,
      class: "packet"
    });

    diagram.appendChild(packet);

    const duration = 650;
    const startTime = performance.now();

    function frame(now) {
      // Stop safely if the diagram has changed.
      if (!packet.isConnected) {
        resolve();
        return;
      }

      const progress = Math.min((now - startTime) / duration, 1);
      const eased = progress * progress * (3 - 2 * progress);

      const x = from.x + (to.x - from.x) * eased;
      const y = from.y + (to.y - from.y) * eased;

      packet.setAttribute("cx", x);
      packet.setAttribute("cy", y);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        packet.remove();
        resolve();
      }
    }

    requestAnimationFrame(frame);
  });
}

// Send data through the topology's connection graph.
async function sendData() {
  if (transferInProgress) return;

  const topology = topologies[currentTopology];
  const source = Number(sourceSelect.value);
  const destination = Number(destinationSelect.value);

  if (source === destination) {
    transferStatus.textContent =
      "Please select two different computers.";
    return;
  }

  const graph = getConnections(topology);
  const path = findPath(graph, source, destination);

  if (!path) {
    transferStatus.textContent = "No available route found.";
    return;
  }

  transferInProgress = true;
  sendButton.disabled = true;
  transferStatus.textContent = "Sending packet through the network...";

  try {
    for (let i = 0; i < path.length - 1; i++) {
      const a = topology.nodes[path[i]];
      const b = topology.nodes[path[i + 1]];

      // For a bus, the shared backbone is drawn across the diagram.
      // Its graph node is placed at the centre of that cable.
      await animatePacket(a, b);

      transferStatus.textContent =
        `Packet travelling: ${a.label} → ${b.label}`;
    }

    transferStatus.textContent =
      `✓ Data delivered to ${topology.nodes[destination].label}!`;
  } catch (error) {
    transferStatus.textContent =
      "Simulation interrupted. Please try again.";
  } finally {
    transferInProgress = false;
    sendButton.disabled = false;
  }
}

sendButton.addEventListener("click", sendData);

// Quiz questions.
const questions = [
  {
    question: "Which topology uses a central switch?",
    answers: ["Bus", "Star", "Ring", "Mesh"],
    correct: 1,
    explanation: "Star topology connects devices to a central switch or hub."
  },
  {
    question: "Which topology has a shared backbone cable?",
    answers: ["Tree", "Mesh", "Bus", "Ring"],
    correct: 2,
    explanation: "Bus topology uses one shared main cable."
  },
  {
    question: "Which topology forms a closed loop?",
    answers: ["Ring", "Star", "Tree", "Bus"],
    correct: 0,
    explanation: "In ring topology, connections form a closed loop."
  },
  {
    question: "Which full topology offers a direct link between every pair of devices?",
    answers: ["Bus", "Star", "Tree", "Full Mesh"],
    correct: 3,
    explanation: "A full mesh connects every pair of devices directly."
  },
  {
    question: "Which topology organises devices in hierarchical branches?",
    answers: ["Ring", "Tree", "Bus", "Star"],
    correct: 1,
    explanation: "Tree topology uses a hierarchy of upper and lower-level devices."
  }
];

let currentQuestion = 0;
let totalScore = 0;
let answered = false;
let quizFinished = false;

const questionText = document.getElementById("question");
const answersBox = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const scoreText = document.getElementById("score");
const questionNumber = document.getElementById("question-number");
const progressText = document.getElementById("quiz-progress-text");
const progressBar = document.getElementById("quiz-progress");

function showQuestion() {
  answered = false;

  const item = questions[currentQuestion];
  const progress = (currentQuestion / questions.length) * 100;

  questionNumber.textContent =
    `QUESTION ${String(currentQuestion + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`;

  progressText.textContent = `${Math.round(progress)}% completed`;
  progressBar.style.width = `${progress}%`;

  questionText.textContent = item.question;
  answersBox.replaceChildren();
  feedback.textContent = "";
  scoreText.textContent = `Score: ${totalScore} / ${questions.length}`;

  nextButton.disabled = true;
  nextButton.textContent = "Next Question →";

  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-btn";
    button.textContent = answer;

    button.addEventListener("click", () => {
      if (answered) return;

      answered = true;

      const isCorrect = index === item.correct;

      if (isCorrect) {
        totalScore++;
        feedback.textContent = `✓ Correct! ${item.explanation}`;
      } else {
        feedback.textContent =
          `Not quite. Correct answer: ${item.answers[item.correct]}. ${item.explanation}`;
      }

      feedback.style.color = isCorrect ? "#65e6a7" : "#ff8292";

      answersBox.querySelectorAll("button").forEach((option, i) => {
        option.disabled = true;

        if (i === item.correct) {
          option.classList.add("correct");
        } else if (i === index) {
          option.classList.add("incorrect");
        }
      });

      scoreText.textContent =
        `Score: ${totalScore} / ${questions.length}`;

      nextButton.disabled = false;

      if (currentQuestion === questions.length - 1) {
        nextButton.textContent = "View Final Result";
      }
    });

    answersBox.appendChild(button);
  });
}

nextButton.addEventListener("click", () => {
  if (quizFinished) {
    currentQuestion = 0;
    totalScore = 0;
    quizFinished = false;
    progressBar.style.width = "0%";
    showQuestion();
    return;
  }

  if (!answered) return;

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion();
  } else {
    quizFinished = true;

    questionNumber.textContent = "QUIZ COMPLETED";
    progressText.textContent = "100% completed";
    progressBar.style.width = "100%";

    questionText.textContent = "Great work! 🎓";
    answersBox.replaceChildren();

    const percentage = Math.round(
      (totalScore / questions.length) * 100
    );

    feedback.style.color = "#4ee5d5";
    feedback.textContent =
      `You scored ${totalScore} out of ${questions.length} (${percentage}%).`;

    scoreText.textContent = "Final Result";
    nextButton.textContent = "Try Again";
    nextButton.disabled = false;
  }
});

// Start the website.
drawTopology("star");
showQuestion();
