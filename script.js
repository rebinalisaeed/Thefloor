// Global Variables
let gameData = {};
let playersList = [];
let currentCategory = "animals";
let currentImagesList = [];
let currentIndex = 0;
let currentActive = 1;
let timers = {1: 45, 2: 45};
let gameActive = false;
let timerInterval = null;
let p1Name = "", p2Name = "";
let totalTime = 45;
let passPenalty = 3;
let isLoading = true;

// Load data from JSON file
async function loadGameData() {
    const loadingDiv = document.getElementById("loading-status");
    if (loadingDiv) loadingDiv.innerHTML = "⏳ بارکردنی داتا لە JSON فایل...";
    
    try {
        const response = await fetch('floor-data.json');
        if (!response.ok) throw new Error('JSON فایل نەدۆزرایەوە');
        const data = await response.json();
        
        gameData = data.categories || {};
        playersList = data.players || [];
        totalTime = data.settings?.totalTime || 45;
        passPenalty = data.settings?.passPenalty || 3;
        
        if (loadingDiv) loadingDiv.innerHTML = "✅ داتا سەرکەوتوو بارکرا!";
        console.log("✅ داتا لە JSON فایلەوە بارکرا");
    } catch (error) {
        console.error("❌ هەڵە لە بارکردنی JSON:", error);
        if (loadingDiv) loadingDiv.innerHTML = "⚠️ JSON فایل نەدۆزرایەوە، داتای بنەڕەتی بەکاردهێنرێت";
        setDefaultData();
    }
    
    populateCategorySelect();
    populatePlayerSelects();
    isLoading = false;
}

function setDefaultData() {
    gameData = {
        animals: ["شێر", "پڵنگ", "فیل", "زرافە", "کەروێشک"],
        birds: ["ھەڵۆ", "باز", "بولبول", "قوو", "کەو"],
        flags: ["عێراق", "ئێران", "تورکیا", "ئەمریکا", "بەریتانیا"],
        maps: ["عێراق", "مەغریب", "جەزائیر", "کەنەدا", "مەکسیک"],
        players_names: ["مێسی", "ڕۆناڵدۆ", "نەیمار", "مباپێ"],
        leaders: ["سەلاحەدین", "قەدافی", "ئەتاتورک"],
        celebrities: ["تۆم هەنکس", "وێڵ سمیت", "ئەنجلینا جۆلی"],
        furniture: ["جێگا", "مێز", "پۆلیف"],
        cars: ["تایۆتا", "ھۆندا", "فۆرد"],
        brands: ["ئەپڵ", "سامسۆنگ", "نایکی"],
        car_logos: ["تایۆتا", "فۆرد", "بێنز"],
        games: ["فیفا", "کاڵ ئۆف دیوتی", "پابجی"]
    };
    playersList = ["ئارام", "ژوان", "سۆران"];
    totalTime = 45;
    passPenalty = 3;
}

function populateCategorySelect() {
    const select = document.getElementById("category-select");
    if (!select) return;
    select.innerHTML = "";
    const categoryNames = {
        animals: "🦁 ئاژەڵان",
        birds: "🦜 باڵندەکان",
        flags: "🏁 ئاڵای وڵاتان",
        maps: "🗺️ نەخشەی وڵاتان",
        players_names: "⚽ ناوی یاریزانان",
        leaders: "👑 ناوی سەرۆکەکان",
        celebrities: "⭐ کەسایتی گەورە",
        furniture: "🛋️ کەل و پەل",
        cars: "🚗 ئۆتۆمبێل",
        brands: "🏷️ لۆگۆی براندەکان",
        car_logos: "🚘 لۆگۆی ئۆتۆمبێل",
        games: "🎮 یاریە ئەلیکترۆنیەکان"
    };
    
    Object.keys(gameData).forEach(cat => {
        const displayName = categoryNames[cat] || cat;
        select.innerHTML += `<option value="${cat}">${displayName}</option>`;
    });
}

function populatePlayerSelects() {
    const p1Select = document.getElementById("player1-select");
    const p2Select = document.getElementById("player2-select");
    if (!p1Select || !p2Select) return;
    p1Select.innerHTML = "";
    p2Select.innerHTML = "";
    playersList.forEach(p => {
        p1Select.innerHTML += `<option value="${p}">${p}</option>`;
        p2Select.innerHTML += `<option value="${p}">${p}</option>`;
    });
}

function loadQuestion() {
    if (!gameActive) return;
    const imgElement = document.getElementById("game-image");
    const randomId = Math.floor(Math.random() * 200) + 1;
    imgElement.src = `https://picsum.photos/id/${randomId}/1920/1080`;
    document.getElementById("status-msg").innerHTML = "";
    document.getElementById("correct-badge").innerHTML = "❓";
}

function updateTimersUI() {
    document.getElementById("p1-time").innerHTML = timers[1].toFixed(1);
    document.getElementById("p2-time").innerHTML = timers[2].toFixed(1);
    
    if (currentActive === 1) {
        document.getElementById("p1-info").classList.add("active-turn");
        document.getElementById("p2-info").classList.remove("active-turn");
    } else {
        document.getElementById("p2-info").classList.add("active-turn");
        document.getElementById("p1-info").classList.remove("active-turn");
    }
}

function switchTurn() {
    if (!gameActive) return;
    if (timers[currentActive] <= 0) {
        endGame(3 - currentActive);
        return;
    }
    currentActive = currentActive === 1 ? 2 : 1;
    updateTimersUI();
    document.getElementById("status-msg").innerHTML = `نۆرەی ${currentActive === 1 ? p1Name : p2Name}`;
    setTimeout(() => {
        if (gameActive) document.getElementById("status-msg").innerHTML = "";
    }, 1500);
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!gameActive) return;
        if (timers[currentActive] <= 0) {
            clearInterval(timerInterval);
            endGame(3 - currentActive);
            return;
        }
        timers[currentActive] -= 0.1;
        if (timers[currentActive] < 0) timers[currentActive] = 0;
        updateTimersUI();
        if (timers[currentActive] <= 0) {
            clearInterval(timerInterval);
            endGame(3 - currentActive);
        }
    }, 100);
}

function endGame(winner) {
    gameActive = false;
    if (timerInterval) clearInterval(timerInterval);
    const winnerName = winner === 1 ? p1Name : p2Name;
    alert(`🏆 کۆتایی! براوە: ${winnerName} 🏆\nکلیکی ئۆک بکە بۆ گەڕانەوە`);
    location.reload();
}

function checkAnswer(answerText) {
    if (!gameActive) return;
    if (!currentImagesList[currentIndex]) {
        endGame(currentActive);
        return;
    }
    const correctAnswer = currentImagesList[currentIndex].toLowerCase();
    const userAnswer = answerText.trim().toLowerCase();
    
    if (userAnswer === correctAnswer) {
        document.getElementById("correct-badge").innerHTML = "✅ دروستە!";
        setTimeout(() => {
            if (gameActive) document.getElementById("correct-badge").innerHTML = "❓";
        }, 500);
        
        currentIndex++;
        if (currentIndex >= currentImagesList.length) {
            endGame(currentActive);
            return;
        }
        switchTurn();
        loadQuestion();
    } else {
        document.getElementById("status-msg").innerHTML = "❌ هەڵە! هەوڵبدەرەوە";
        setTimeout(() => {
            if (gameActive) document.getElementById("status-msg").innerHTML = "";
        }, 800);
    }
}

function passQuestion() {
    if (!gameActive) return;
    timers[currentActive] = Math.max(0, timers[currentActive] - passPenalty);
    updateTimersUI();
    if (timers[currentActive] <= 0) {
        endGame(3 - currentActive);
        return;
    }
    currentIndex++;
    if (currentIndex >= currentImagesList.length) {
        endGame(currentActive);
        return;
    }
    loadQuestion();
    document.getElementById("status-msg").innerHTML = `⏭️ پەڕاندن! ${passPenalty} چرکە سزا`;
    setTimeout(() => {
        if (gameActive) document.getElementById("status-msg").innerHTML = "";
    }, 1000);
}

function startGame() {
    if (isLoading) {
        alert("تکایە چاوەڕێ بکە هەتا داتاکان تەواو باربکرێن");
        return;
    }
    
    p1Name = document.getElementById("player1-select").value;
    p2Name = document.getElementById("player2-select").value;
    currentCategory = document.getElementById("category-select").value;
    
    currentImagesList = [...(gameData[currentCategory] || [])];
    if (currentImagesList.length === 0) {
        alert("هیچ ناوێک لەم کاتەگۆرییەدا نییە! تکایە بچۆ بۆ Admin Panel و ناو زیاد بکە.");
        return;
    }
    currentImagesList = currentImagesList.map(s => s.toLowerCase());
    currentIndex = 0;
    timers = {1: totalTime, 2: totalTime};
    currentActive = 1;
    gameActive = true;
    
    document.getElementById("p1-name").innerHTML = p1Name;
    document.getElementById("p2-name").innerHTML = p2Name;
    updateTimersUI();
    
    document.getElementById("setup-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");
    
    loadQuestion();
    startTimer();
    document.getElementById("status-msg").innerHTML = `⚔️ دەستپێک! نۆرەی ${p1Name}`;
    
    // Request fullscreen
    document.documentElement.requestFullscreen();
}

// Keyboard controls
document.addEventListener("keydown", (e) => {
    if (!gameActive) return;
    if (e.key === "Enter") {
        e.preventDefault();
        const answer = prompt("وەڵامەکە بنووسە:");
        if (answer !== null && answer.trim() !== "") checkAnswer(answer);
    } else if (e.key === " " || e.key === "Space") {
        e.preventDefault();
        passQuestion();
    }
});

// Initialize
loadGameData();
document.getElementById("start-game-btn").addEventListener("click", startGame);
