const API_BASE = "https://germanapp-unau.onrender.com";



let currentMode = "sentences";

let currentLevel = "A1";
let currentSentenceId = null;
let sentenceStreak = 0;

let currentArticleId = null;
let articleStreak = 0;

let currentWordSv = "";
let wordStreak = 0;

let currentGrammarAnswer = "";
let grammarStreak = 0;
let hiddenGrammarType = "";

let currentPreteriteId = null;
let preteriteStreak = 0;

const LEVEL_DESCRIPTIONS = {
  A1: "A1 – very simple sentences.",
  A2: "A2 – everyday sentences.",
  B1: "B1 – slightly longer sentences.",
};

document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("status");
  const startScreen = document.getElementById("start-screen");
  const appInterface = document.getElementById("app-interface");

  const btnStartSentences = document.getElementById("btnStartSentences");
  const btnStartArticles = document.getElementById("btnStartArticles");
  const btnStartWords = document.getElementById("btnStartWords");
  const btnStartGrammar = document.getElementById("btnStartGrammar");
  const btnStartPreterite = document.getElementById("btnStartPreterite");
  const backToStartBtn = document.getElementById("backToStartBtn");

  const modeSentences = document.getElementById("mode-sentences");
  const modeArticles = document.getElementById("mode-articles");
  const modeWords = document.getElementById("mode-words");
  const modeGrammar = document.getElementById("mode-grammar");
  const modePreterite = document.getElementById("mode-preterite");

  // 🔥 Helper-funktioner för effekter
  function addTempClass(el, className, duration = 500) {
    if (!el) return;
    el.classList.add(className);
    setTimeout(() => el.classList.remove(className), duration);
  }

  function flashCorrect(boxEl) {
    addTempClass(boxEl, "answer-correct");
  }

  function flashWrong(boxEl) {
    addTempClass(boxEl, "answer-wrong");
  }

  function animateStreak(streakEl) {
    addTempClass(streakEl, "streak-pop");
  }

  function animateModeChange() {
    addTempClass(appInterface, "screen-in", 400);
  }

  function showApp(mode) {
    startScreen.classList.add("hidden");
    appInterface.classList.remove("hidden");
    setMode(mode);
  }

  function showStartScreen() {
    appInterface.classList.add("hidden");
    startScreen.classList.remove("hidden");
  }

  function setMode(mode) {
    currentMode = mode;
    animateModeChange();

    // Göm alla lägen
    modeSentences.classList.add("hidden");
    modeArticles.classList.add("hidden");
    modeWords.classList.add("hidden");
    if (modeGrammar) modeGrammar.classList.add("hidden");
    if (modePreterite) modePreterite.classList.add("hidden");

    // Visa rätt läge
    if (mode === "sentences") {
      modeSentences.classList.remove("hidden");
      if (!currentSentenceId) fetchNewSentence();
    } else if (mode === "articles") {
      modeArticles.classList.remove("hidden");
      if (!currentArticleId) fetchNewArticle();
    } else if (mode === "words") {
      modeWords.classList.remove("hidden");
      if (!currentWordSv) fetchNewWord();
    } else if (mode === "grammar") {
      if (modeGrammar) modeGrammar.classList.remove("hidden");
      fetchNewGrammar();
       resetGrammarIndex();
    } else if (mode === "preterite") {
      if (modePreterite) modePreterite.classList.remove("hidden");
      fetchNewPreterite();
    }
  }

  // 🔗 Start-knappar (bara EN gång vardera)
  if (btnStartSentences) btnStartSentences.addEventListener("click", () => showApp("sentences"));
  if (btnStartArticles) btnStartArticles.addEventListener("click", () => showApp("articles"));
  if (btnStartWords) btnStartWords.addEventListener("click", () => showApp("words"));
  if (btnStartGrammar) btnStartGrammar.addEventListener("click", () => showApp("grammar"));
  if (btnStartPreterite) btnStartPreterite.addEventListener("click", () => showApp("preterite"));
  if (backToStartBtn) backToStartBtn.addEventListener("click", showStartScreen);

  // ...resten av din kod (sentences, articles, words, grammar, preterite) fortsätter här inne i DOMContentLoaded...

  // ========= SENTENCES =========
  const svEl = document.getElementById("svSentence");
  const userInput = document.getElementById("userGerman");
  const solutionBox = document.getElementById("solutionBox");
  const solutionText = document.getElementById("correctGerman");
  const levelDescEl = document.getElementById("levelDescription");
  const sentenceStreakEl = document.getElementById("sentenceStreak");
  
  const checkBtn = document.getElementById("checkBtn");
  const nextSentenceBtn = document.getElementById("nextSentenceBtn"); 
  const showSolutionBtn = document.getElementById("showSolutionBtn");
  const levelButtons = document.querySelectorAll(".level-btn");

  levelButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const level = btn.getAttribute("data-level");
      if (!level || level === currentLevel) return;
      currentLevel = level;
      levelButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (levelDescEl) levelDescEl.textContent = LEVEL_DESCRIPTIONS[level];
      fetchNewSentence();
    });
  });

  async function fetchNewSentence() {
    solutionBox.classList.add("hidden");
    solutionBox.classList.remove("correct-bg", "wrong-bg");
    
    checkBtn.classList.remove("hidden");
    nextSentenceBtn.classList.add("hidden");
    showSolutionBtn.classList.remove("hidden");

    userInput.value = "";
    currentSentenceId = null;
    svEl.textContent = "Loading...";

    try {
      const res = await fetch(`${API_BASE}/random-sentence?level=${currentLevel}`);
      const data = await res.json();
      
      if (data.id === 0) {
        svEl.textContent = "Hittade inga meningar. Kolla servern.";
        return;
      }

      currentSentenceId = data.id;
      currentSv = data.sv;
      svEl.textContent = currentSv;
      userInput.focus();
    } catch (err) { 
      console.error(err); 
      svEl.textContent = "Error: Starta servern!";
    } 
  }

  async function checkAnswer() {
    if (!currentSentenceId) return;
    const userText = userInput.value.trim();
    if (!userText) return;

    try {
      const res = await fetch(`${API_BASE}/check-translation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentSentenceId, userDe: userText }),
      });
      const data = await res.json();
      
      solutionText.textContent = data.correctDe;
      solutionBox.classList.remove("hidden");
      solutionBox.classList.remove("correct-bg", "wrong-bg");

      if (data.correct) {
        solutionBox.classList.add("correct-bg");
        flashCorrect(solutionBox);  // 💚
        sentenceStreak++;
      } else {
        solutionBox.classList.add("wrong-bg");
        flashWrong(solutionBox);    // ❤️
        sentenceStreak = 0;
      }
      sentenceStreakEl.textContent = sentenceStreak;
      animateStreak(sentenceStreakEl);

      checkBtn.classList.add("hidden");
      showSolutionBtn.classList.add("hidden");
      nextSentenceBtn.classList.remove("hidden");
      nextSentenceBtn.focus();

    } catch (err) { console.error(err); }
  }
  
  function toggleSolution() {
    solutionBox.classList.toggle("hidden");
  }

  checkBtn.addEventListener("click", checkAnswer);
  nextSentenceBtn.addEventListener("click", fetchNewSentence);
  showSolutionBtn.addEventListener("click", toggleSolution);
  
  userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      if (!checkBtn.classList.contains("hidden")) checkBtn.click();
      else if (!nextSentenceBtn.classList.contains("hidden")) nextSentenceBtn.click();
    }
  });
  // ========= ARTICLES =========
  const articleNounEl = document.getElementById("articleNoun");
  const articleSwedishEl = document.getElementById("articleSwedish");
  const articleSolutionBox = document.getElementById("articleSolutionBox");
  const articleSolution = document.getElementById("articleSolution");
  const articleStreakEl = document.getElementById("articleStreak");
  const nextArticleBtn = document.getElementById("nextArticleBtn");

  const articleButtons = [
    document.getElementById("btnDer"),
    document.getElementById("btnDie"),
    document.getElementById("btnDas"),
  ];

  // 🔵 vilken knapp är "vald" just nu med pilarna? 0 = der, 1 = die, 2 = das
  let articleIndex = 0;

  function updateArticleHighlight() {
    articleButtons.forEach((btn, i) => {
      if (!btn) return;
      if (i === articleIndex) {
        btn.style.outline = "3px solid #38bdf8";
        btn.style.outlineOffset = "3px";
      } else {
        btn.style.outline = "none";
      }
    });
  }

  async function fetchNewArticle() {
    articleSolutionBox.classList.add("hidden");
    articleSolutionBox.classList.remove("correct-bg", "wrong-bg");
    articleButtons.forEach((b) => b && b.classList.remove("ok", "error"));
    nextArticleBtn.classList.add("hidden");

    articleNounEl.textContent = "...";
    articleSwedishEl.textContent = "";

    try {
      const res = await fetch(`${API_BASE}/random-article`);
      const data = await res.json();

      if (data.id === "error") {
        articleNounEl.textContent = "Inga ord";
        return;
      }

      currentArticleId = data.id;
      currentArticleNoun = data.noun;
      articleNounEl.textContent = currentArticleNoun;
      articleSwedishEl.textContent = data.sv;

      // 🟦 börja alltid på "der" när nytt ord kommer
      articleIndex = 0;
      updateArticleHighlight();
    } catch (e) {
      console.error(e);
      articleNounEl.textContent = "Error";
    }
  }

  async function checkArticle(userArticle) {
    if (!currentArticleId) return;

    try {
      const res = await fetch(`${API_BASE}/check-article`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentArticleId, userArticle }),
      });
      const data = await res.json();

      articleButtons.forEach((b) => {
        if (!b) return;
        const art = b.getAttribute("data-article");
        if (art === data.correctArticle) b.classList.add("ok");
        else if (art === userArticle) b.classList.add("error");
      });

      articleSolutionBox.classList.remove("correct-bg", "wrong-bg");

      if (data.correct) {
        articleSolutionBox.classList.add("correct-bg");
        flashCorrect(articleSolutionBox);
        articleStreak++;
      } else {
        articleSolutionBox.classList.add("wrong-bg");
        flashWrong(articleSolutionBox);
        articleStreak = 0;
      }
      articleStreakEl.textContent = articleStreak;
      animateStreak(articleStreakEl);

      articleSolution.textContent = data.full;
      articleSolutionBox.classList.remove("hidden");

      nextArticleBtn.classList.remove("hidden");
      nextArticleBtn.focus();
    } catch (e) {
      console.error(e);
    }
  }

  if (nextArticleBtn) nextArticleBtn.addEventListener("click", fetchNewArticle);

  articleButtons.forEach(
    (btn) =>
      btn &&
      btn.addEventListener("click", () =>
        checkArticle(btn.getAttribute("data-article"))
      )
  );

  // 🔑 Keyboard: pilar + Enter
  // vänster = der, upp/ner = die, höger = das, Enter = välj
 // 🔑 Keyboard: rotera val med vänster/höger + Enter för att välja
document.addEventListener("keydown", (event) => {
  if (currentMode !== "articles") return;
  if (!currentArticleId) return;

  const tag = document.activeElement.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea") return;

  switch (event.key) {
    case "ArrowLeft":
      event.preventDefault();
      // gå ett steg bakåt (cirkulärt)
      articleIndex = (articleIndex - 1 + 3) % 3;
      updateArticleHighlight();
      break;

    case "ArrowRight":
      event.preventDefault();
      // gå ett steg framåt (cirkulärt)
      articleIndex = (articleIndex + 1) % 3;
      updateArticleHighlight();
      break;

  case "Enter":
  event.preventDefault();

  // 🟦 Om nästa-knappen är synlig → gå vidare
  if (!nextArticleBtn.classList.contains("hidden")) {
    nextArticleBtn.click();
    return;
  }

  // 🟩 Annars välj den markerade artikeln
  const selectedBtn = articleButtons[articleIndex];
  if (!selectedBtn) return;

  const selectedArticle = selectedBtn.getAttribute("data-article");
  checkArticle(selectedArticle);
  break;

      
  }
  
  
});

// ========= GRAMMAR KEYBOARD =========
const grammarBtns = [
  document.getElementById("opt1"),
  document.getElementById("opt2"),
  document.getElementById("opt3"),
];

let grammarIndex = 0;

function updateGrammarHighlight() {
  grammarBtns.forEach((btn, i) => {
    if (!btn) return;
    if (i === grammarIndex) {
      btn.style.outline = "3px solid #38bdf8";
      btn.style.outlineOffset = "3px";
    } else {
      btn.style.outline = "none";
    }
  });
}

function resetGrammarIndex() {
  grammarIndex = 0;
  updateGrammarHighlight();
}

// 🔑 Keyboard för GRAMMAR: vänster/höger + Enter
document.addEventListener("keydown", (event) => {
  if (currentMode !== "grammar") return;

  const tag = document.activeElement.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea") return;

  const nextGrammarBtn = document.getElementById("nextGrammarBtn");

  switch (event.key) {
    case "ArrowLeft":
      event.preventDefault();
      grammarIndex = (grammarIndex - 1 + 3) % 3;
      updateGrammarHighlight();
      break;

    case "ArrowRight":
      event.preventDefault();
      grammarIndex = (grammarIndex + 1) % 3;
      updateGrammarHighlight();
      break;

    case "Enter":
      event.preventDefault();

      // Om Next är synlig → gå vidare
      if (nextGrammarBtn && !nextGrammarBtn.classList.contains("hidden")) {
        nextGrammarBtn.click();
        return;
      }

      // Annars: välj markerad knapp
      const selectedBtn = grammarBtns[grammarIndex];
      if (!selectedBtn) return;

      selectedBtn.click(); // använder dina befintliga click handlers
      break;
  }
});


// 🔑 Keyboard support for der / die / das (1 / 2 / 3)
document.addEventListener("keydown", (event) => {
  // bara när vi är i artikel-läget
  if (currentMode !== "articles") return;
  if (!currentArticleId) return;

  // ignorera om man skriver i input / textarea
  const tag = document.activeElement.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea") return;

  const key = event.key;

  if (key === "1") {
    event.preventDefault();
    checkArticle("der");
  } else if (key === "2") {
    event.preventDefault();
    checkArticle("die");
  } else if (key === "3") {
    event.preventDefault();
    checkArticle("das");
  }
});


  async function fetchNewArticle() {
    articleSolutionBox.classList.add("hidden");
    articleSolutionBox.classList.remove("correct-bg", "wrong-bg");
    articleButtons.forEach(b => b.classList.remove("ok", "error"));
    nextArticleBtn.classList.add("hidden");

    articleNounEl.textContent = "...";
    articleSwedishEl.textContent = "";
    
    try {
      const res = await fetch(`${API_BASE}/random-article`);
      const data = await res.json();
      
      if (data.id === "error") {
        articleNounEl.textContent = "Inga ord";
        return;
      }

      currentArticleId = data.id;
      currentArticleNoun = data.noun;
      articleNounEl.textContent = currentArticleNoun;
      articleSwedishEl.textContent = data.sv;
    } catch (e) { 
      console.error(e);
      articleNounEl.textContent = "Error"; 
    }
  }

  async function checkArticle(userArticle) {
    if (!currentArticleId) return;
    
    try {
      const res = await fetch(`${API_BASE}/check-article`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ id: currentArticleId, userArticle })
      });
      const data = await res.json();
      
      articleButtons.forEach(b => {
        const art = b.getAttribute("data-article");
        if (art === data.correctArticle) b.classList.add("ok");
        else if (art === userArticle) b.classList.add("error");
      });

      articleSolutionBox.classList.remove("correct-bg", "wrong-bg");
      
      if (data.correct) {
        articleSolutionBox.classList.add("correct-bg");
        flashCorrect(articleSolutionBox);
        articleStreak++;
      } else {
        articleSolutionBox.classList.add("wrong-bg");
        flashWrong(articleSolutionBox);
        articleStreak = 0;
      }
      articleStreakEl.textContent = articleStreak;
      animateStreak(articleStreakEl);

      articleSolution.textContent = data.full;
      articleSolutionBox.classList.remove("hidden");

      nextArticleBtn.classList.remove("hidden");
      nextArticleBtn.focus();

    } catch (e) { console.error(e); }
  }

  if (nextArticleBtn) nextArticleBtn.addEventListener("click", fetchNewArticle);

  articleButtons.forEach(btn => 
    btn && btn.addEventListener("click", () => checkArticle(btn.getAttribute("data-article")))
  );

  // ========= WORDS =========
  const svWordBox = document.getElementById("svWordBox");
  const userWordInput = document.getElementById("userWordInput");
  const wordSolutionBox = document.getElementById("wordSolutionBox");
  const wordSolutionText = document.getElementById("wordSolutionText");
  const wordStreakEl = document.getElementById("wordStreak");
  
  const checkWordBtn = document.getElementById("checkWordBtn");
  const nextWordBtn = document.getElementById("nextWordBtn");
  const showWordSolutionBtn = document.getElementById("showWordSolutionBtn");

  async function fetchNewWord() {
    wordSolutionBox.classList.add("hidden");
    wordSolutionBox.classList.remove("correct-bg", "wrong-bg"); 
    
    checkWordBtn.classList.remove("hidden");
    nextWordBtn.classList.add("hidden");
    showWordSolutionBtn.classList.remove("hidden");

    userWordInput.value = "";
    svWordBox.textContent = "Loading...";

    try {
      const res = await fetch(`${API_BASE}/random-word`);
      const data = await res.json();
      currentWordSv = data.sv;
      svWordBox.textContent = currentWordSv;
      userWordInput.focus();
    } catch (e) { 
      console.error(e);
      svWordBox.textContent = "Error";
    }
  }

  async function checkWord() {
    if (!currentWordSv) return;
    const userText = userWordInput.value.trim();
    if (!userText) return;

    try {
      const res = await fetch(`${API_BASE}/check-word`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ svWord: currentWordSv, userDe: userText })
      });
      const data = await res.json();
      
      wordSolutionText.textContent = data.correctDe;
      wordSolutionBox.classList.remove("hidden");
      wordSolutionBox.classList.remove("correct-bg", "wrong-bg");

      if (data.correct) {
        wordSolutionBox.classList.add("correct-bg");
        flashCorrect(wordSolutionBox);
        wordStreak++;
      } else {
        wordSolutionBox.classList.add("wrong-bg");
        flashWrong(wordSolutionBox);
        wordStreak = 0;
      }
      wordStreakEl.textContent = wordStreak;
      animateStreak(wordStreakEl);

      checkWordBtn.classList.add("hidden");
      showWordSolutionBtn.classList.add("hidden");
      nextWordBtn.classList.remove("hidden");
      nextWordBtn.focus();

    } catch (e) { console.error(e); }
  }
  
  function toggleWordSolution() {
    wordSolutionBox.classList.toggle("hidden");
  }

  if (checkWordBtn) checkWordBtn.addEventListener("click", checkWord);
  if (nextWordBtn) nextWordBtn.addEventListener("click", fetchNewWord);
  if (showWordSolutionBtn) showWordSolutionBtn.addEventListener("click", toggleWordSolution);
  
  if (userWordInput) {
    userWordInput.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        if (!checkWordBtn.classList.contains("hidden")) checkWordBtn.click();
        else if (!nextWordBtn.classList.contains("hidden")) nextWordBtn.click();
      }
    });
  }

  // ========= GRAMMAR =========
  const grammarQuestionEl = document.getElementById("grammarQuestion");
  const grammarTypeEl = document.getElementById("grammarType"); 
  const grammarSolutionBox = document.getElementById("grammarSolutionBox");
  const grammarSolutionText = document.getElementById("grammarSolutionText");
  const grammarStreakEl = document.getElementById("grammarStreak");
  const nextGrammarBtn = document.getElementById("nextGrammarBtn");
  
  const optBtns = [
    document.getElementById("opt1"),
    document.getElementById("opt2"),
    document.getElementById("opt3")
  ];

  if (grammarTypeEl) {
    grammarTypeEl.addEventListener("click", () => {
      grammarTypeEl.textContent = hiddenGrammarType;
      grammarTypeEl.classList.remove("help-mode");
    });
  }

  async function fetchNewGrammar() {
    grammarSolutionBox.classList.add("hidden");
    grammarSolutionBox.classList.remove("correct-bg", "wrong-bg");
    nextGrammarBtn.classList.add("hidden");
    
    if (grammarTypeEl) {
      grammarTypeEl.textContent = "❓ Help"; 
      grammarTypeEl.classList.add("help-mode");
    }
    
    optBtns.forEach(btn => {
      if (btn) {
        btn.classList.remove("ok", "error");
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.textContent = "...";
      }
    });

    if (grammarQuestionEl) grammarQuestionEl.textContent = "Loading...";

    try {
      const res = await fetch(`${API_BASE}/random-grammar`);
      const data = await res.json();

      if (grammarQuestionEl) grammarQuestionEl.textContent = data.q;
      hiddenGrammarType = data.type; 
      currentGrammarAnswer = data.answer;

      let shuffledOptions = [...data.options]; 
      shuffledOptions.sort(() => Math.random() - 0.5); 

      if (shuffledOptions.length === 3) {
        if (optBtns[0]) optBtns[0].textContent = shuffledOptions[0];
        if (optBtns[1]) optBtns[1].textContent = shuffledOptions[1];
        if (optBtns[2]) optBtns[2].textContent = shuffledOptions[2];
      }

    } catch (e) { 
      console.error(e);
      if (grammarQuestionEl) grammarQuestionEl.textContent = "Error loading question.";
    }
  }

  function checkGrammar(selectedBtn) {
    const userChoice = selectedBtn.textContent;
  
    if (grammarTypeEl) {
      grammarTypeEl.textContent = hiddenGrammarType; 
      grammarTypeEl.classList.remove("help-mode");
    }

    optBtns.forEach(btn => { if (btn) btn.disabled = true; });
    grammarSolutionBox.classList.remove("correct-bg", "wrong-bg");

    if (userChoice === currentGrammarAnswer) {
      selectedBtn.classList.add("ok");
      grammarSolutionBox.classList.add("correct-bg");
      flashCorrect(grammarSolutionBox);
      grammarSolutionText.textContent = "Correct! " + grammarQuestionEl.textContent.replace("___", userChoice);
      grammarStreak++;
    } else {
      selectedBtn.classList.add("error");
      optBtns.forEach(btn => {
        if (btn && btn.textContent === currentGrammarAnswer) btn.classList.add("ok");
      });
      grammarSolutionBox.classList.add("wrong-bg");
      flashWrong(grammarSolutionBox);
      grammarSolutionText.textContent = "Wrong. Correct: " + currentGrammarAnswer;
      grammarStreak = 0;
    }
    
    if (grammarStreakEl) grammarStreakEl.textContent = grammarStreak;
    animateStreak(grammarStreakEl);

    grammarSolutionBox.classList.remove("hidden");
    nextGrammarBtn.classList.remove("hidden");
    nextGrammarBtn.focus();
  }

  optBtns.forEach(btn => {
    if (btn) btn.addEventListener("click", () => checkGrammar(btn));
  });

  if (nextGrammarBtn) nextGrammarBtn.addEventListener("click", fetchNewGrammar);

  // ========= PRETERITE (Präteritum) =========
  const preteriteQuestionEl = document.getElementById("preteriteQuestion");
  const userPreteriteInput = document.getElementById("userPreteriteInput");
  const preteriteSolutionBox = document.getElementById("preteriteSolutionBox");
  const preteriteSolutionText = document.getElementById("preteriteSolutionText");
  const preteriteStreakEl = document.getElementById("preteriteStreak");

  const checkPreteriteBtn = document.getElementById("checkPreteriteBtn");
  const nextPreteriteBtn = document.getElementById("nextPreteriteBtn");
  const showPreteriteSolutionBtn = document.getElementById("showPreteriteSolutionBtn");

  async function fetchNewPreterite() {
    preteriteSolutionBox.classList.add("hidden");
    preteriteSolutionBox.classList.remove("correct-bg", "wrong-bg");

    checkPreteriteBtn.classList.remove("hidden");
    nextPreteriteBtn.classList.add("hidden");
    showPreteriteSolutionBtn.classList.remove("hidden");

    userPreteriteInput.value = "";
    if (preteriteQuestionEl) preteriteQuestionEl.textContent = "Loading...";

    try {
      const res = await fetch(`${API_BASE}/random-preterite`);
      const data = await res.json();

      currentPreteriteId = data.id;
      if (preteriteQuestionEl) preteriteQuestionEl.textContent = data.q;
      userPreteriteInput.focus();
    } catch (e) {
      console.error(e);
      if (preteriteQuestionEl) preteriteQuestionEl.textContent = "Error loading question.";
    }
  }

  async function checkPreterite() {
    if (!currentPreteriteId) return;
    const userText = userPreteriteInput.value.trim();
    if (!userText) return;

    try {
      const res = await fetch(`${API_BASE}/check-preterite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentPreteriteId, userForm: userText })
      });

      const data = await res.json();

      preteriteSolutionText.textContent = data.correctForm;
      preteriteSolutionBox.classList.remove("hidden");
      preteriteSolutionBox.classList.remove("correct-bg", "wrong-bg");

      if (data.correct) {
        preteriteSolutionBox.classList.add("correct-bg");
        flashCorrect(preteriteSolutionBox);
        preteriteStreak++;
      } else {
        preteriteSolutionBox.classList.add("wrong-bg");
        flashWrong(preteriteSolutionBox);
        preteriteStreak = 0;
      }

      preteriteStreakEl.textContent = preteriteStreak;
      animateStreak(preteriteStreakEl);

      checkPreteriteBtn.classList.add("hidden");
      showPreteriteSolutionBtn.classList.add("hidden");
      nextPreteriteBtn.classList.remove("hidden");
      nextPreteriteBtn.focus();
    } catch (e) {
      console.error(e);
    }
  }

  function togglePreteriteSolution() {
    preteriteSolutionBox.classList.toggle("hidden");
  }

  if (checkPreteriteBtn) checkPreteriteBtn.addEventListener("click", checkPreterite);
  if (nextPreteriteBtn) nextPreteriteBtn.addEventListener("click", fetchNewPreterite);
  if (showPreteriteSolutionBtn) showPreteriteSolutionBtn.addEventListener("click", togglePreteriteSolution);

  if (userPreteriteInput) {
    userPreteriteInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        if (!checkPreteriteBtn.classList.contains("hidden")) checkPreteriteBtn.click();
        else if (!nextPreteriteBtn.classList.contains("hidden")) nextPreteriteBtn.click();
      }
    });
  }

}); // 👈 den här stänger DOMContentLoaded

