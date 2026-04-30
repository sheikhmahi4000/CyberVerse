/* =========================================================
   CYBERVERSE - SINGLE SCRIPT FILE
   Works for:
   index.html, password.html, phishing.html, toolkit.html,
   dashboard.html, career.html, about-contact.html
========================================================= */

/* =========================
   GLOBAL UI
========================= */

const loader = document.getElementById("loader");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

window.addEventListener("load", () => {
  if (loader) {
    setTimeout(() => {
      loader.classList.add("hide");
    }, 700);
  }
});

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();

    if (rect.top < window.innerHeight - 80) {
      el.classList.add("show");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

/* =========================
   ACTIVITY TRACKING
========================= */

function addActivityLog(action, risk = 0) {
  const logs = JSON.parse(localStorage.getItem("cyberverse_logs")) || [];

  logs.push({
    action,
    risk,
    time: new Date().toLocaleString()
  });

  localStorage.setItem("cyberverse_logs", JSON.stringify(logs.slice(-40)));

  const currentRisk = Number(localStorage.getItem("cyberverse_risk")) || 0;
  localStorage.setItem("cyberverse_risk", String(currentRisk + risk));
}

addActivityLog(`Visited ${document.title}`, 0);

/* =========================
   HOME TERMINAL
========================= */

const terminalText = document.getElementById("terminalText");

const terminalLines = [
  "[BOOT] CyberVerse security layer initialized...",
  "[OK] Password Intelligence module online",
  "[OK] Phishing Lab loaded",
  "[OK] Cyber Toolkit ready",
  "[OK] SOC Dashboard monitoring enabled",
  "[INFO] Career roadmap available",
  "[SYSTEM] Welcome to CyberVerse"
];

let terminalLineIndex = 0;
let terminalCharIndex = 0;
let terminalOutput = "";

function typeTerminal() {
  if (!terminalText) return;

  if (terminalLineIndex < terminalLines.length) {
    if (terminalCharIndex < terminalLines[terminalLineIndex].length) {
      terminalOutput += terminalLines[terminalLineIndex].charAt(terminalCharIndex);
      terminalText.textContent = terminalOutput;
      terminalCharIndex++;
      setTimeout(typeTerminal, 35);
    } else {
      terminalOutput += "\n";
      terminalText.textContent = terminalOutput;
      terminalLineIndex++;
      terminalCharIndex = 0;
      setTimeout(typeTerminal, 350);
    }
  }
}

window.addEventListener("load", () => {
  setTimeout(typeTerminal, 900);
});

/* =========================
   PASSWORD INTELLIGENCE
========================= */

const passwordInput = document.getElementById("passwordInput");
const togglePasswordBtn = document.getElementById("togglePasswordBtn");
const strengthLabel = document.getElementById("strengthLabel");
const strengthBar = document.getElementById("strengthBar");
const entropyValue = document.getElementById("entropyValue");
const crackTimeValue = document.getElementById("crackTimeValue");
const passwordRiskValue = document.getElementById("passwordRiskValue");
const passwordChecks = document.getElementById("passwordChecks");
const passwordSuggestions = document.getElementById("passwordSuggestions");

function calculateEntropy(password) {
  let pool = 0;

  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(password)) pool += 33;

  if (!password || pool === 0) return 0;

  return Math.round(password.length * Math.log2(pool));
}

function estimateCrackTime(entropy) {
  if (entropy < 28) return "Seconds";
  if (entropy < 36) return "Minutes";
  if (entropy < 50) return "Hours / Days";
  if (entropy < 65) return "Months / Years";
  if (entropy < 80) return "Many Years";
  return "Extremely Long";
}

function analyzePassword(password) {
  let score = 0;
  const checks = [];
  const suggestions = [];

  if (password.length >= 12) {
    score += 20;
    checks.push("✅ Good length: 12+ characters");
  } else {
    checks.push("❌ Too short: use at least 12 characters");
    suggestions.push("Increase password length to 12–16+ characters.");
  }

  if (/[a-z]/.test(password)) {
    score += 10;
    checks.push("✅ Contains lowercase letters");
  } else {
    checks.push("❌ Missing lowercase letters");
  }

  if (/[A-Z]/.test(password)) {
    score += 10;
    checks.push("✅ Contains uppercase letters");
  } else {
    checks.push("❌ Missing uppercase letters");
  }

  if (/[0-9]/.test(password)) {
    score += 10;
    checks.push("✅ Contains numbers");
  } else {
    checks.push("❌ Missing numbers");
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 15;
    checks.push("✅ Contains special symbols");
  } else {
    checks.push("❌ Missing symbols");
    suggestions.push("Add symbols like @, #, $, %, !.");
  }

  if (!/(.)\1{2,}/.test(password)) {
    score += 10;
    checks.push("✅ No repeated character pattern found");
  } else {
    checks.push("❌ Repeated characters detected");
    suggestions.push("Avoid repeated characters like aaa, 111, !!!.");
  }

  if (!/(1234|abcd|qwerty|password|admin|letmein)/i.test(password)) {
    score += 15;
    checks.push("✅ No common weak pattern detected");
  } else {
    checks.push("❌ Common weak pattern detected");
    suggestions.push("Avoid common words like password, admin, qwerty, 1234.");
  }

  if (password.length >= 16) score += 10;

  score = Math.min(score, 100);

  let label = "Weak";
  let risk = "High";

  if (score >= 80) {
    label = "Strong";
    risk = "Low";
  } else if (score >= 55) {
    label = "Moderate";
    risk = "Medium";
  }

  if (suggestions.length === 0) {
    suggestions.push("Great. Use this password only for one account.");
  }

  return {
    score,
    label,
    risk,
    entropy: calculateEntropy(password),
    checks,
    suggestions
  };
}

function updatePasswordUI() {
  if (!passwordInput) return;

  const password = passwordInput.value;
  const result = analyzePassword(password);

  strengthLabel.textContent = password ? result.label : "Waiting...";
  strengthBar.style.width = password ? `${result.score}%` : "0%";
  entropyValue.textContent = password ? `${result.entropy} bits` : "0 bits";
  crackTimeValue.textContent = password ? estimateCrackTime(result.entropy) : "N/A";
  passwordRiskValue.textContent = password ? result.risk : "N/A";

  passwordChecks.innerHTML = result.checks.map((item) => `<li>${item}</li>`).join("");
  passwordSuggestions.innerHTML = result.suggestions.map((item) => `<li>${item}</li>`).join("");

  if (password && result.score < 55) {
    addActivityLog("Weak password pattern tested", 8);
  }
}

if (passwordInput) {
  passwordInput.addEventListener("input", updatePasswordUI);
}

if (togglePasswordBtn && passwordInput) {
  togglePasswordBtn.addEventListener("click", () => {
    const hidden = passwordInput.type === "password";
    passwordInput.type = hidden ? "text" : "password";
    togglePasswordBtn.textContent = hidden ? "Hide" : "Show";
  });
}

const comparePasswordBtn = document.getElementById("comparePasswordBtn");
const compareOne = document.getElementById("compareOne");
const compareTwo = document.getElementById("compareTwo");
const compareResult = document.getElementById("compareResult");

if (comparePasswordBtn) {
  comparePasswordBtn.addEventListener("click", () => {
    const a = compareOne.value;
    const b = compareTwo.value;

    const scoreA = analyzePassword(a).score;
    const scoreB = analyzePassword(b).score;

    if (!a || !b) {
      compareResult.textContent = "[WARNING] Please enter both passwords.";
      return;
    }

    if (scoreA > scoreB) {
      compareResult.textContent = `[OK] Password A is stronger.\nPassword A Score: ${scoreA}%\nPassword B Score: ${scoreB}%`;
    } else if (scoreB > scoreA) {
      compareResult.textContent = `[OK] Password B is stronger.\nPassword A Score: ${scoreA}%\nPassword B Score: ${scoreB}%`;
    } else {
      compareResult.textContent = `[INFO] Both passwords have similar strength.\nScore: ${scoreA}%`;
    }

    addActivityLog("Compared two passwords", 1);
  });
}

/* =========================
   PHISHING TRAINER
========================= */

const phishingScenarios = [
  {
    title: "Bank Account Warning",
    text: "Your account will be suspended in 2 hours. Click this link to verify your login immediately.",
    answer: "phishing",
    explanation: "Urgency and credential verification links are common phishing signs."
  },
  {
    title: "University Notice",
    text: "Your class schedule has been updated. Please check your official student portal.",
    answer: "legit",
    explanation: "This message does not pressure you or request sensitive data."
  },
  {
    title: "Prize Claim",
    text: "Congratulations! You won a free iPhone. Submit your password and phone number to claim.",
    answer: "phishing",
    explanation: "Reward bait and password requests are dangerous phishing clues."
  }
];

const startTrainerBtn = document.getElementById("startTrainerBtn");
const legitBtn = document.getElementById("legitBtn");
const phishingBtn = document.getElementById("phishingBtn");
const trainerTitle = document.getElementById("trainerTitle");
const trainerText = document.getElementById("trainerText");
const trainerFeedback = document.getElementById("trainerFeedback");

let currentTrainer = null;

function loadTrainerScenario() {
  currentTrainer = phishingScenarios[Math.floor(Math.random() * phishingScenarios.length)];
  trainerTitle.textContent = currentTrainer.title;
  trainerText.textContent = currentTrainer.text;
  trainerFeedback.textContent = "[SYSTEM] Scenario loaded. Choose Legit or Phishing.";
}

function checkTrainerAnswer(choice) {
  if (!currentTrainer) {
    trainerFeedback.textContent = "[WARNING] Start trainer first.";
    return;
  }

  if (choice === currentTrainer.answer) {
    trainerFeedback.textContent = `[OK] Correct classification.\n${currentTrainer.explanation}`;
    addActivityLog("Correct phishing trainer answer", 0);
  } else {
    trainerFeedback.textContent = `[ALERT] Incorrect classification.\n${currentTrainer.explanation}`;
    addActivityLog("Incorrect phishing trainer answer", 5);
  }
}

if (startTrainerBtn) startTrainerBtn.addEventListener("click", loadTrainerScenario);
if (legitBtn) legitBtn.addEventListener("click", () => checkTrainerAnswer("legit"));
if (phishingBtn) phishingBtn.addEventListener("click", () => checkTrainerAnswer("phishing"));

/* =========================
   PHISHING EMAIL CHECKER
========================= */

const analyzeEmailBtn = document.getElementById("analyzeEmailBtn");
const emailSender = document.getElementById("emailSender");
const emailSubject = document.getElementById("emailSubject");
const emailBody = document.getElementById("emailBody");
const emailRiskScore = document.getElementById("emailRiskScore");
const emailVerdict = document.getElementById("emailVerdict");
const emailFlagCount = document.getElementById("emailFlagCount");
const emailAnalysisResult = document.getElementById("emailAnalysisResult");

function analyzeEmail(sender, subject, body) {
  let score = 0;
  const flags = [];
  const combined = `${sender} ${subject} ${body}`.toLowerCase();

  const urgentWords = ["urgent", "immediately", "final notice", "suspended", "locked", "expire", "verify now"];
  const credentialWords = ["password", "login", "verify your account", "otp", "pin", "security code"];
  const moneyWords = ["payment", "invoice", "refund", "bank", "prize", "winner", "reward"];
  const suspiciousDomains = ["paypa1", "g00gle", "micros0ft", "secure-login", "account-verify"];
  const shortLinks = ["bit.ly", "tinyurl", "t.co", "rebrand.ly"];

  urgentWords.forEach((word) => {
    if (combined.includes(word)) {
      score += 10;
      flags.push(`Urgency phrase detected: "${word}"`);
    }
  });

  credentialWords.forEach((word) => {
    if (combined.includes(word)) {
      score += 12;
      flags.push(`Sensitive credential request detected: "${word}"`);
    }
  });

  moneyWords.forEach((word) => {
    if (combined.includes(word)) {
      score += 7;
      flags.push(`Financial/reward bait detected: "${word}"`);
    }
  });

  suspiciousDomains.forEach((word) => {
    if (combined.includes(word)) {
      score += 15;
      flags.push(`Lookalike/fake domain pattern detected: "${word}"`);
    }
  });

  shortLinks.forEach((word) => {
    if (combined.includes(word)) {
      score += 12;
      flags.push(`Shortened link detected: "${word}"`);
    }
  });

  if (/@gmail\.com|@yahoo\.com|@outlook\.com/.test(sender.toLowerCase()) && /bank|paypal|microsoft|google|admin|support/i.test(subject + body)) {
    score += 15;
    flags.push("Free email sender pretending to represent an organization.");
  }

  if (/http:\/\//i.test(body)) {
    score += 10;
    flags.push("Non-HTTPS link detected.");
  }

  if (/\b\d{1,3}(\.\d{1,3}){3}\b/.test(body)) {
    score += 15;
    flags.push("IP-based URL or IP address detected.");
  }

  if (/click here|download attachment|open attachment|confirm identity/i.test(body)) {
    score += 10;
    flags.push("Action-pressure phrase detected.");
  }

  if (/dear customer|dear user/i.test(body)) {
    score += 5;
    flags.push("Generic greeting detected.");
  }

  score = Math.min(score, 100);

  let verdict = "Likely Safe";
  if (score >= 75) verdict = "High-Risk Phishing";
  else if (score >= 50) verdict = "Likely Phishing";
  else if (score >= 25) verdict = "Suspicious";

  return { score, verdict, flags };
}

if (analyzeEmailBtn) {
  analyzeEmailBtn.addEventListener("click", () => {
    const result = analyzeEmail(emailSender.value, emailSubject.value, emailBody.value);

    emailRiskScore.textContent = `${result.score}%`;
    emailVerdict.textContent = result.verdict;
    emailFlagCount.textContent = result.flags.length;

    if (result.flags.length === 0) {
      emailAnalysisResult.textContent = "[OK] No major phishing indicators detected. Still verify sender and links manually.";
    } else {
      emailAnalysisResult.textContent =
        `[SYSTEM] Email analysis complete.\nVerdict: ${result.verdict}\nRisk Score: ${result.score}%\n\nDetected Indicators:\n` +
        result.flags.map((flag) => `- ${flag}`).join("\n");
    }

    addActivityLog(`Email checked: ${result.verdict}`, result.score >= 50 ? 10 : 2);
  });
}

/* =========================
   QUIZ ENGINE
   150+ generated question bank
========================= */

const quizBank = [];

function createQuizBank() {
  const easyTemplates = [
    "What is phishing?",
    "Which sign is common in phishing emails?",
    "What should you do before clicking a link?",
    "Which password habit is safest?",
    "What does HTTPS help protect?",
    "What is a suspicious email attachment?",
    "Why should you check sender address?",
    "What is social engineering?",
    "What is a fake login page?",
    "What should you do with urgent unknown emails?"
  ];

  const mediumTemplates = [
    "Which URL looks suspicious?",
    "Why are shortened links risky?",
    "What is sender spoofing?",
    "How do phishing emails create pressure?",
    "Which email behavior indicates credential theft?",
    "Why is domain mismatch dangerous?",
    "What should you do if an email asks for OTP?",
    "How can fake invoices trick users?",
    "Why are generic greetings suspicious?",
    "What is spear phishing?"
  ];

  const hardTemplates = [
    "A CEO asks for urgent payment by email. What should you do?",
    "An email domain uses rn instead of m. What is this?",
    "A login page looks real but URL is different. What is the risk?",
    "An attachment claims to be invoice.exe. What should happen?",
    "A support email asks for MFA code. What is the best response?",
    "How should a SOC analyst treat repeated phishing reports?",
    "What indicates business email compromise?",
    "Why is credential harvesting dangerous?",
    "What is the best response to suspicious link redirection?",
    "How do attackers use urgency and authority together?"
  ];

  for (let i = 0; i < 55; i++) {
    quizBank.push({
      id: `E${i + 1}`,
      difficulty: "Easy",
      question: `${easyTemplates[i % easyTemplates.length]}`,
      options: [
        "A fake attempt to steal information",
        "A normal software update",
        "A safe login process",
        "A hardware problem"
      ],
      correct: 0,
      explanation: "Phishing is a deceptive attempt to steal data or trick users into unsafe actions."
    });
  }

  for (let i = 0; i < 55; i++) {
    quizBank.push({
      id: `M${i + 1}`,
      difficulty: "Medium",
      question: `${mediumTemplates[i % mediumTemplates.length]}`,
      options: [
        "Ignore all emails forever",
        "Check sender, links, tone, and request carefully",
        "Click quickly before it expires",
        "Send your password to confirm"
      ],
      correct: 1,
      explanation: "Medium-level phishing detection requires checking sender, URL, urgency, and requested action."
    });
  }

  for (let i = 0; i < 55; i++) {
    quizBank.push({
      id: `H${i + 1}`,
      difficulty: "Hard",
      question: `${hardTemplates[i % hardTemplates.length]}`,
      options: [
        "Follow the request immediately",
        "Verify through a trusted separate channel",
        "Reply with credentials",
        "Forward it to random contacts"
      ],
      correct: 1,
      explanation: "Advanced phishing defense requires independent verification before taking sensitive action."
    });
  }
}

createQuizBank();

const startQuizBtn = document.getElementById("startQuizBtn");
const quizStartBox = document.getElementById("quizStartBox");
const quizBox = document.getElementById("quizBox");
const quizResultBox = document.getElementById("quizResultBox");
const quizCounter = document.getElementById("quizCounter");
const quizDifficulty = document.getElementById("quizDifficulty");
const quizProgress = document.getElementById("quizProgress");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const quizExplanation = document.getElementById("quizExplanation");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const finalQuizScore = document.getElementById("finalQuizScore");
const finalQuizPercent = document.getElementById("finalQuizPercent");
const finalQuizLevel = document.getElementById("finalQuizLevel");
const quizSystemMessages = document.getElementById("quizSystemMessages");
const learnNextBtn = document.getElementById("learnNextBtn");
const retryQuizBtn = document.getElementById("retryQuizBtn");

let activeQuiz = [];
let currentQuestionIndex = 0;
let quizScore = 0;
let answered = false;

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function pickQuestions(difficulty, count) {
  const pool = quizBank.filter((q) => q.difficulty === difficulty);
  return shuffleArray(pool).slice(0, count);
}

function startQuiz() {
  const easy = pickQuestions("Easy", 8);
  const medium = pickQuestions("Medium", 10);
  const hard = pickQuestions("Hard", 12);

  activeQuiz = [...easy, ...medium, ...hard];
  currentQuestionIndex = 0;
  quizScore = 0;
  answered = false;

  quizStartBox.classList.add("hidden");
  quizResultBox.classList.add("hidden");
  quizBox.classList.remove("hidden");

  loadQuestion();
  addActivityLog("Started phishing quiz", 0);
}

function loadQuestion() {
  answered = false;
  nextQuestionBtn.classList.add("hidden");
  quizExplanation.textContent = "";

  const q = activeQuiz[currentQuestionIndex];

  quizCounter.textContent = `Question ${currentQuestionIndex + 1}/30`;
  quizDifficulty.textContent = q.difficulty;
  quizProgress.style.width = `${((currentQuestionIndex) / activeQuiz.length) * 100}%`;
  quizQuestion.textContent = q.question;

  quizOptions.innerHTML = "";

  const shuffledOptions = q.options.map((text, index) => ({ text, originalIndex: index }));
  shuffleArray(shuffledOptions).forEach((option) => {
    const btn = document.createElement("button");
    btn.textContent = option.text;
    btn.addEventListener("click", () => checkQuizAnswer(btn, option.originalIndex, q));
    quizOptions.appendChild(btn);
  });
}

function checkQuizAnswer(button, selectedIndex, question) {
  if (answered) return;
  answered = true;

  const buttons = quizOptions.querySelectorAll("button");

  buttons.forEach((btn) => {
    btn.disabled = true;
  });

  if (selectedIndex === question.correct) {
    quizScore++;
    button.classList.add("correct");
    quizExplanation.textContent = `[OK] Correct answer.\n${question.explanation}`;
  } else {
    button.classList.add("wrong");
    quizExplanation.textContent = `[ALERT] Incorrect answer.\n${question.explanation}`;

    buttons.forEach((btn) => {
      if (btn.textContent === question.options[question.correct]) {
        btn.classList.add("correct");
      }
    });
  }

  nextQuestionBtn.classList.remove("hidden");
}

function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex >= activeQuiz.length) {
    finishQuiz();
  } else {
    loadQuestion();
  }
}

function finishQuiz() {
  quizBox.classList.add("hidden");
  quizResultBox.classList.remove("hidden");

  const percent = Math.round((quizScore / activeQuiz.length) * 100);

  let level = "Beginner ⚠️";
  if (percent >= 75) level = "Advanced 🛡️";
  else if (percent >= 45) level = "Intermediate ⚡";

  finalQuizScore.textContent = `${quizScore}/30`;
  finalQuizPercent.textContent = `${percent}%`;
  finalQuizLevel.textContent = level;

  quizProgress.style.width = "100%";

  quizSystemMessages.textContent = "";
  learnNextBtn.classList.add("hidden");

  const messages = [
    "[INFO] Analyzing performance...",
    "[OK] Weak areas identified",
    "[INFO] Loading recommended pathway...",
    "[SYSTEM] Career guidance unlocked"
  ];

  let i = 0;
  const interval = setInterval(() => {
    quizSystemMessages.textContent += messages[i] + "\n";
    i++;

    if (i >= messages.length) {
      clearInterval(interval);
      learnNextBtn.classList.remove("hidden");
    }
  }, 700);

  localStorage.setItem("cyberverse_last_quiz_score", String(percent));
  addActivityLog(`Completed phishing quiz with ${percent}%`, percent < 45 ? 15 : 3);
}

if (startQuizBtn) startQuizBtn.addEventListener("click", startQuiz);
if (nextQuestionBtn) nextQuestionBtn.addEventListener("click", nextQuestion);
if (retryQuizBtn) retryQuizBtn.addEventListener("click", startQuiz);

/* =========================
   TOOLKIT
========================= */

const toolTabs = document.querySelectorAll(".tool-tab");
const toolScreens = document.querySelectorAll(".tool-screen");

toolTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tool;

    toolTabs.forEach((t) => t.classList.remove("active"));
    toolScreens.forEach((screen) => screen.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});

async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const buffer = await crypto.subtle.digest("SHA-256", data);

  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha1(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const buffer = await crypto.subtle.digest("SHA-1", data);

  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function simpleMd5Placeholder(text) {
  let hash = 0;

  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }

  return `demo-md5-${Math.abs(hash).toString(16)}`;
}

const generateHashBtn = document.getElementById("generateHashBtn");
const hashInput = document.getElementById("hashInput");
const hashOutput = document.getElementById("hashOutput");

if (generateHashBtn) {
  generateHashBtn.addEventListener("click", async () => {
    const text = hashInput.value;

    if (!text) {
      hashOutput.textContent = "[WARNING] Enter text first.";
      return;
    }

    const sha256Hash = await sha256(text);
    const sha1Hash = await sha1(text);
    const md5Hash = simpleMd5Placeholder(text);

    hashOutput.textContent =
      `[SHA-256]\n${sha256Hash}\n\n[SHA-1]\n${sha1Hash}\n\n[MD5 Demo]\n${md5Hash}`;

    addActivityLog("Generated hashes", 0);
  });
}

const encodeBase64Btn = document.getElementById("encodeBase64Btn");
const decodeBase64Btn = document.getElementById("decodeBase64Btn");
const base64Input = document.getElementById("base64Input");
const base64Output = document.getElementById("base64Output");

if (encodeBase64Btn) {
  encodeBase64Btn.addEventListener("click", () => {
    base64Output.textContent = btoa(unescape(encodeURIComponent(base64Input.value)));
    addActivityLog("Encoded Base64", 0);
  });
}

if (decodeBase64Btn) {
  decodeBase64Btn.addEventListener("click", () => {
    try {
      base64Output.textContent = decodeURIComponent(escape(atob(base64Input.value)));
      addActivityLog("Decoded Base64", 0);
    } catch {
      base64Output.textContent = "[ERROR] Invalid Base64 input.";
    }
  });
}

const generatePasswordBtn = document.getElementById("generatePasswordBtn");
const passwordLength = document.getElementById("passwordLength");
const generatedPassword = document.getElementById("generatedPassword");

if (generatePasswordBtn) {
  generatePasswordBtn.addEventListener("click", () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}";
    const len = Math.min(Math.max(Number(passwordLength.value) || 16, 8), 64);
    let pass = "";

    for (let i = 0; i < len; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }

    generatedPassword.textContent = pass;
    addActivityLog("Generated secure password", 0);
  });
}

const lookupIpBtn = document.getElementById("lookupIpBtn");
const ipInput = document.getElementById("ipInput");
const ipOutput = document.getElementById("ipOutput");

async function lookupIp(ip, outputEl) {
  try {
    const url = ip ? `https://ipapi.co/${ip}/json/` : "https://ipapi.co/json/";
    const res = await fetch(url);
    const data = await res.json();

    outputEl.textContent =
      `[IP INTELLIGENCE]\nIP: ${data.ip || "N/A"}\nCity: ${data.city || "N/A"}\nCountry: ${data.country_name || "N/A"}\nISP: ${data.org || "N/A"}\nTimezone: ${data.timezone || "N/A"}`;

    addActivityLog("Loaded IP intelligence", 0);
  } catch {
    outputEl.textContent = "[ERROR] Could not load IP information.";
  }
}

if (lookupIpBtn) {
  lookupIpBtn.addEventListener("click", () => {
    lookupIp(ipInput.value.trim(), ipOutput);
  });
}

const encodeUrlBtn = document.getElementById("encodeUrlBtn");
const decodeUrlBtn = document.getElementById("decodeUrlBtn");
const urlInput = document.getElementById("urlInput");
const urlOutput = document.getElementById("urlOutput");

if (encodeUrlBtn) {
  encodeUrlBtn.addEventListener("click", () => {
    urlOutput.textContent = encodeURIComponent(urlInput.value);
    addActivityLog("Encoded URL", 0);
  });
}

if (decodeUrlBtn) {
  decodeUrlBtn.addEventListener("click", () => {
    try {
      urlOutput.textContent = decodeURIComponent(urlInput.value);
      addActivityLog("Decoded URL", 0);
    } catch {
      urlOutput.textContent = "[ERROR] Invalid encoded URL.";
    }
  });
}

const decodeJwtBtn = document.getElementById("decodeJwtBtn");
const jwtInput = document.getElementById("jwtInput");
const jwtOutput = document.getElementById("jwtOutput");

if (decodeJwtBtn) {
  decodeJwtBtn.addEventListener("click", () => {
    try {
      const parts = jwtInput.value.split(".");

      if (parts.length < 2) {
        jwtOutput.textContent = "[ERROR] Invalid JWT format.";
        return;
      }

      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));

      jwtOutput.textContent =
        `[HEADER]\n${JSON.stringify(header, null, 2)}\n\n[PAYLOAD]\n${JSON.stringify(payload, null, 2)}`;

      addActivityLog("Decoded JWT token", 1);
    } catch {
      jwtOutput.textContent = "[ERROR] Could not decode JWT.";
    }
  });
}

const compareHashBtn = document.getElementById("compareHashBtn");
const hashCompareText = document.getElementById("hashCompareText");
const hashCompareValue = document.getElementById("hashCompareValue");
const compareHashOutput = document.getElementById("compareHashOutput");

if (compareHashBtn) {
  compareHashBtn.addEventListener("click", async () => {
    const hash = await sha256(hashCompareText.value);
    const match = hash.toLowerCase() === hashCompareValue.value.toLowerCase();

    compareHashOutput.textContent = match
      ? "[OK] SHA-256 hash matches."
      : `[ALERT] Hash does not match.\nGenerated SHA-256:\n${hash}`;

    addActivityLog("Compared SHA-256 hash", match ? 0 : 2);
  });
}

/* =========================
   SOC DASHBOARD
========================= */

const browserInfo = document.getElementById("browserInfo");
const osInfo = document.getElementById("osInfo");
const deviceTypeInfo = document.getElementById("deviceTypeInfo");
const screenInfo = document.getElementById("screenInfo");
const languageInfo = document.getElementById("languageInfo");
const timezoneInfo = document.getElementById("timezoneInfo");
const activityLog = document.getElementById("activityLog");
const activityCount = document.getElementById("activityCount");
const socRiskLevel = document.getElementById("socRiskLevel");
const alertList = document.getElementById("alertList");
const loadIpIntelBtn = document.getElementById("loadIpIntelBtn");
const socIpOutput = document.getElementById("socIpOutput");
const investigationPanel = document.getElementById("investigationPanel");

function detectBrowser() {
  const ua = navigator.userAgent;

  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Edge")) return "Edge";

  return "Unknown Browser";
}

function detectOS() {
  const ua = navigator.userAgent;

  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";

  return "Unknown OS";
}

function detectDeviceType() {
  if (/Mobi|Android/i.test(navigator.userAgent)) return "Mobile";
  if (/Tablet|iPad/i.test(navigator.userAgent)) return "Tablet";
  return "Desktop";
}

function loadSocDashboard() {
  if (!browserInfo) return;

  browserInfo.textContent = detectBrowser();
  osInfo.textContent = detectOS();
  deviceTypeInfo.textContent = detectDeviceType();
  screenInfo.textContent = `${window.screen.width} × ${window.screen.height}`;
  languageInfo.textContent = navigator.language;
  timezoneInfo.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const logs = JSON.parse(localStorage.getItem("cyberverse_logs")) || [];
  const risk = Number(localStorage.getItem("cyberverse_risk")) || 0;

  activityCount.textContent = logs.length;

  let riskLevel = "Low";
  if (risk >= 50) riskLevel = "High";
  else if (risk >= 20) riskLevel = "Medium";

  socRiskLevel.textContent = riskLevel;

  activityLog.textContent = logs.length
    ? logs.map((log) => `[${log.time}] ${log.action}`).join("\n")
    : "[SYSTEM] No activity logs yet.";

  const alerts = [];

  if (risk >= 20) {
    alerts.push({
      title: "[WARNING] Elevated behavior risk detected.",
      detail: "Some user actions indicate weak security habits. Review password and phishing results."
    });
  }

  const lastQuiz = localStorage.getItem("cyberverse_last_quiz_score");

  if (lastQuiz && Number(lastQuiz) < 45) {
    alerts.push({
      title: "[ALERT] Low phishing quiz score.",
      detail: "The user may need more phishing awareness training."
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      title: "[OK] No critical alerts.",
      detail: "Current session behavior looks safe."
    });
  }

  alertList.innerHTML = "";

  alerts.forEach((alert) => {
    const item = document.createElement("div");
    item.className = "alert-item";
    item.innerHTML = `<strong>${alert.title}</strong>`;
    item.addEventListener("click", () => {
      investigationPanel.textContent =
        `[INVESTIGATION]\n${alert.title}\n\nRecommendation:\n${alert.detail}`;
    });
    alertList.appendChild(item);
  });
}

if (loadIpIntelBtn) {
  loadIpIntelBtn.addEventListener("click", () => {
    lookupIp("", socIpOutput);
  });
}

window.addEventListener("load", loadSocDashboard);

/* =========================
   CONTACT FORM
========================= */

const contactForm = document.getElementById("contactForm");
const contactOutput = document.getElementById("contactOutput");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const subject = document.getElementById("contactSubject").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    if (!name || !email || !subject || !message) {
      contactOutput.textContent = "[WARNING] Please fill in all fields.";
      return;
    }

    contactOutput.textContent =
      `[OK] Message captured successfully.\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nNote: This frontend form does not send email without backend integration.`;

    contactForm.reset();
    addActivityLog("Submitted contact form", 0);
  });
}