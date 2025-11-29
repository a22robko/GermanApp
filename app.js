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
  const backToStartBtn = document.getElementById("backToStartBtn");

  const modeSentences = document.getElementById("mode-sentences");
  const modeArticles = document.getElementById("mode-articles");
  const modeWords = document.getElementById("mode-words");
  const modeGrammar = document.getElementById("mode-grammar");

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
    
    modeSentences.classList.add("hidden");
    modeArticles.classList.add("hidden");
    modeWords.classList.add("hidden");
    if(modeGrammar) modeGrammar.classList.add("hidden");

    if (mode === "sentences") {
      modeSentences.classList.remove("hidden");
      if (!currentSentenceId) fetchNewSentence();
    } 
    else if (mode === "articles") {
      modeArticles.classList.remove("hidden");
      if (!currentArticleId) fetchNewArticle();
    } 
    else if (mode === "words") {
      modeWords.classList.remove("hidden");
      if (!currentWordSv) fetchNewWord();
    }
    else if (mode === "grammar") {
      if(modeGrammar) modeGrammar.classList.remove("hidden");
      fetchNewGrammar(); 
    }
  }

  if(btnStartSentences) btnStartSentences.addEventListener("click", () => showApp("sentences"));
  if(btnStartArticles) btnStartArticles.addEventListener("click", () => showApp("articles"));
  if(btnStartWords) btnStartWords.addEventListener("click", () => showApp("words"));
  if(btnStartGrammar) btnStartGrammar.addEventListener("click", () => showApp("grammar"));
  if(backToStartBtn) backToStartBtn.addEventListener("click", showStartScreen);

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
      if(levelDescEl) levelDescEl.textContent = LEVEL_DESCRIPTIONS[level];
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
      
      if(data.id === 0) {
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
        sentenceStreak++;
      } else {
        solutionBox.classList.add("wrong-bg");
        sentenceStreak = 0;
      }
      sentenceStreakEl.textContent = sentenceStreak;

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

  const articleNounEl = document.getElementById("articleNoun");
  const articleSwedishEl = document.getElementById("articleSwedish");
  const articleSolutionBox = document.getElementById("articleSolutionBox");
  const articleSolution = document.getElementById("articleSolution");
  const articleStreakEl = document.getElementById("articleStreak");
  const nextArticleBtn = document.getElementById("nextArticleBtn");
  
  const articleButtons = [
    document.getElementById("btnDer"), 
    document.getElementById("btnDie"), 
    document.getElementById("btnDas")
  ];

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
      
      if(data.id === "error") {
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
        articleStreak++;
      } else {
        articleSolutionBox.classList.add("wrong-bg");
        articleStreak = 0;
      }
      articleStreakEl.textContent = articleStreak;
      articleSolution.textContent = data.full;
      articleSolutionBox.classList.remove("hidden");

      nextArticleBtn.classList.remove("hidden");
      nextArticleBtn.focus();

    } catch (e) { console.error(e); }
  }

  if(nextArticleBtn) nextArticleBtn.addEventListener("click", fetchNewArticle);

  articleButtons.forEach(btn => 
    btn.addEventListener("click", () => checkArticle(btn.getAttribute("data-article")))
  );

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
        wordStreak++;
      } else {
        wordSolutionBox.classList.add("wrong-bg");
        wordStreak = 0;
      }
      wordStreakEl.textContent = wordStreak;

      checkWordBtn.classList.add("hidden");
      showWordSolutionBtn.classList.add("hidden");
      nextWordBtn.classList.remove("hidden");
      nextWordBtn.focus();

    } catch (e) { console.error(e); }
  }
  
  function toggleWordSolution() {
     wordSolutionBox.classList.toggle("hidden");
  }

  if(checkWordBtn) checkWordBtn.addEventListener("click", checkWord);
  if(nextWordBtn) nextWordBtn.addEventListener("click", fetchNewWord);
  if(showWordSolutionBtn) showWordSolutionBtn.addEventListener("click", toggleWordSolution);
  
  if(userWordInput) {
    userWordInput.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        if (!checkWordBtn.classList.contains("hidden")) checkWordBtn.click();
        else if (!nextWordBtn.classList.contains("hidden")) nextWordBtn.click();
      }
    });
  }


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

  if(grammarTypeEl) {
    grammarTypeEl.addEventListener("click", () => {
        grammarTypeEl.textContent = hiddenGrammarType;
        grammarTypeEl.classList.remove("help-mode");
    });
  }

 async function fetchNewGrammar() {

    grammarSolutionBox.classList.add("hidden");
    grammarSolutionBox.classList.remove("correct-bg", "wrong-bg");
    nextGrammarBtn.classList.add("hidden");
    
    if(grammarTypeEl) {
        grammarTypeEl.textContent = "❓ Help"; 
        grammarTypeEl.classList.add("help-mode");
    }
    
    optBtns.forEach(btn => {
      if(btn) {
        btn.classList.remove("ok", "error");
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.textContent = "...";
      }
    });

    if(grammarQuestionEl) grammarQuestionEl.textContent = "Loading...";

    try {
      const res = await fetch(`${API_BASE}/random-grammar`);
      const data = await res.json();

      if(grammarQuestionEl) grammarQuestionEl.textContent = data.q;
      hiddenGrammarType = data.type; 
      currentGrammarAnswer = data.answer;

      let shuffledOptions = [...data.options]; 
      shuffledOptions.sort(() => Math.random() - 0.5); 

      if(shuffledOptions.length === 3) {
          if(optBtns[0]) optBtns[0].textContent = shuffledOptions[0];
          if(optBtns[1]) optBtns[1].textContent = shuffledOptions[1];
          if(optBtns[2]) optBtns[2].textContent = shuffledOptions[2];
      }

    } catch (e) { 
        console.error(e);
        if(grammarQuestionEl) grammarQuestionEl.textContent = "Error loading question.";
    }
  }

  function checkGrammar(selectedBtn) {
    const userChoice = selectedBtn.textContent;
  
    if(grammarTypeEl) {
        grammarTypeEl.textContent = hiddenGrammarType; 
        grammarTypeEl.classList.remove("help-mode");
    }

    optBtns.forEach(btn => { if(btn) btn.disabled = true; });
    grammarSolutionBox.classList.remove("correct-bg", "wrong-bg");

    if (userChoice === currentGrammarAnswer) {
      selectedBtn.classList.add("ok");
      grammarSolutionBox.classList.add("correct-bg");
      grammarSolutionText.textContent = "Correct! " + grammarQuestionEl.textContent.replace("___", userChoice);
      grammarStreak++;
    } else {
      selectedBtn.classList.add("error");
      optBtns.forEach(btn => {
        if(btn && btn.textContent === currentGrammarAnswer) btn.classList.add("ok");
      });
      grammarSolutionBox.classList.add("wrong-bg");
      grammarSolutionText.textContent = "Wrong. Correct: " + currentGrammarAnswer;
      grammarStreak = 0;
    }
    
    if(grammarStreakEl) grammarStreakEl.textContent = grammarStreak;
    grammarSolutionBox.classList.remove("hidden");
    nextGrammarBtn.classList.remove("hidden");
    nextGrammarBtn.focus();
  }

  optBtns.forEach(btn => {
    if(btn) btn.addEventListener("click", () => checkGrammar(btn));
  });

  if(nextGrammarBtn) nextGrammarBtn.addEventListener("click", fetchNewGrammar);
});