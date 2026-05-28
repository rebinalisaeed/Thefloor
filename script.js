// -------------------- داتای بنەڕەتی --------------------
let gameData = {
    animals: ["شێر", "پڵنگ", "فیل", "زرافە", "کەروێشک", "مەیموون", "گورگ", "ڕێوی", "کەڵەشێر", "ماسی"],
    birds: ["ھەڵۆ", "باز", "بولبول", "قوو", "کەو", "تاووس", "پاپەغە", "ھومە", "ڕەشەشۆک", "کولەک"],
    flags: ["عێراق", "ئێران", "تورکیا", "ئەمریکا", "بەریتانیا", "فەڕەنسا", "ئەڵمانیا", "میسر", "عەرەبستانی سعوودی", "ڕووسیا"],
    maps: ["عێراق", "مەغریب", "جەزائیر", "کەنەدا", "مەکسیک", "ھیندستان", "چین", "ژاپۆن", "ئیتاڵیا", "ئیسپانیا"],
    players: ["لیۆنێل مێسی", "کریستیانۆ ڕۆناڵدۆ", "نەیمار", "کیلیان مباپێ", "لۆکا مۆدریچ", "سەلاح", "بێنزێما", "ئینیێستا", "ڕۆناڵدۆ نازاری", "زینەدین زیدان"],
    leaders: ["سەلاحەدین", "قه‌دافى", "ئەتاتورک", "جۆرج واشنتۆن", "نێلسۆن ماندێلا", "مارتن لوتەر کینگ", "جۆن کێنیدی", "وینستۆن چێرچڵ", "گاندی", "چێ گێڤارا"],
    celebrities: ["سەعدون جابر", "مامۆستا زایر", "هیوا", "مەحمود خۆشناو", "هنریف", "تۆم هەنکس", "وێڵ سمیت", "ئەنجلینا جۆلی", "دواين جۆنسن", "لیدی گاگا"],
    furniture: ["جێگا", "مێز", "پۆلیف", "قاپ", "ڕەف", "کابینە", "فەرش", "پەنجەرە", "دەرگا", "ئاوێنە"],
    cars: ["تایۆتا", "ھۆندا", "فۆرد", "بێنز", "بێمو", "فۆڵکس واگن", "نیسان", "کەی ئێم سی", "ھیوندا", "پۆژۆ"],
    brands: ["ئەپڵ", "سامسۆنگ", "نایکی", "ئەدیداس", "کۆکاکۆلا", "پێپسی", "مەکدۆناڵد", "تێسلا", "گووگڵ", "ئەمازۆن"],
    car_logos: ["تایۆتا", "فۆرد", "بێنز", "بێمو", "ھۆندا", "نیسان", "فۆڵکس واگن", "تێسلا", "فێراری", "لامبۆرگینی"],
    games: ["فیفا", "کاڵ ئۆف دیوتی", "پابجی", "فۆرت نایت", "ماینکڕافت", "جی تی ئەی", "ئەسەسینز کریت", "گۆد ئۆف وار", "لێگۆ", "ماریۆ"]
};

let currentCategory = "animals";
let currentImagesList = [...gameData.animals];
let currentIndex = 0;
let currentActive = 1; // 1: yekem, 2: duwem
let timers = {1: 45.0, 2: 45.0};
let timerInterval = null;
let gameActive = false;
let p1Name = "ئارام", p2Name = "ژوان";
let passPenalty = false;

const imageMap = {
    animals: "https://picsum.photos/id/1/300/200",
    birds: "https://picsum.photos/id/6/300/200",
    flags: "https://picsum.photos/id/32/300/200",
    maps: "https://picsum.photos/id/35/300/200",
    players: "https://picsum.photos/id/64/300/200",
    leaders: "https://picsum.photos/id/88/300/200",
    celebrities: "https://picsum.photos/id/91/300/200",
    furniture: "https://picsum.photos/id/96/300/200",
    cars: "https://picsum.photos/id/107/300/200",
    brands: "https://picsum.photos/id/21/300/200",
    car_logos: "https://picsum.photos/id/11/300/200",
    games: "https://picsum.photos/id/0/300/200"
};

function getImageUrl(category) {
    return imageMap[category] || "https://picsum.photos/id/26/300/200";
}

function loadQuestion() {
    if (!gameActive) return;
    const imgElement = document.getElementById("current-image");
    imgElement.src = getImageUrl(currentCategory);
    const categoryName = document.getElementById("category-select").options[document.getElementById("category-select").selectedIndex]?.text.split(" ")[1] || "بابەت";
    document.getElementById("category-badge").innerText = categoryName;
    document.getElementById("answer-input").value = "";
    document.getElementById("answer-input").focus();
}

function switchTurn() {
    if (!gameActive) return;
    if (timers[currentActive] <= 0) {
        endGame(3 - currentActive);
        return;
    }
    currentActive = currentActive === 1 ? 2 : 1;
    document.getElementById("p1-card").classList.toggle("active-player");
    document.getElementById("p2-card").classList.toggle("active-player");
    document.getElementById("game-status").innerHTML = `🎤 نۆرە بۆ ${currentActive === 1 ? p1Name : p2Name}`;
}

function updateTimersUI() {
    document.getElementById("p1-timer").innerText = timers[1].toFixed(1);
    document.getElementById("p2-timer").innerText = timers[2].toFixed(1);
    document.getElementById("p1-fill").style.width = `${(timers[1] / 45) * 100}%`;
    document.getElementById("p2-fill").style.width = `${(timers[2] / 45) * 100}%`;
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
    document.getElementById("game-status").innerHTML = `🏆 براوە: ${winnerName} 🏆 کلیک لە F5 بکە بۆ یاری نوێ`;
    alert(`🏆 یاری کۆتایی هات! براوە: ${winnerName}`);
}

function checkAnswer() {
    if (!gameActive) return;
    const answer = document.getElementById("answer-input").value.trim().toLowerCase();
    const correctAnswer = currentImagesList[currentIndex].toLowerCase();
    if (answer === correctAnswer) {
        // وەڵامی ڕاست
        currentIndex++;
        if (currentIndex >= currentImagesList.length) {
            endGame(currentActive);
            return;
        }
        switchTurn();
        loadQuestion();
    } else {
        document.getElementById("game-status").innerHTML = "❌ وەڵام هەڵەیە! هەوڵبدەرەوە";
        setTimeout(() => {
            if (gameActive) document.getElementById("game-status").innerHTML = "";
        }, 800);
    }
}

function passQuestion() {
    if (!gameActive) return;
    timers[currentActive] = Math.max(0, timers[currentActive] - 3);
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
    document.getElementById("game-status").innerHTML = "⏭️ پەڕاندن! 3 چرکە سزا";
    setTimeout(() => {
        if (gameActive) document.getElementById("game-status").innerHTML = "";
    }, 800);
}

function startGame() {
    p1Name = document.getElementById("player1-name").value.trim() || "یاریکەری یەکەم";
    p2Name = document.getElementById("player2-name").value.trim() || "یاریکەری دووەم";
    document.getElementById("p1-name").innerText = p1Name;
    document.getElementById("p2-name").innerText = p2Name;
    currentCategory = document.getElementById("category-select").value;
    currentImagesList = [...(gameData[currentCategory] || gameData.animals)];
    currentImagesList = currentImagesList.map(s => s.toLowerCase());
    currentIndex = 0;
    timers = {1: 45.0, 2: 45.0};
    currentActive = 1;
    gameActive = true;
    updateTimersUI();
    document.getElementById("p1-card").classList.add("active-player");
    document.getElementById("p2-card").classList.remove("active-player");
    document.getElementById("setup-section").classList.add("hidden");
    document.getElementById("game-arena").classList.remove("hidden");
    loadQuestion();
    startTimer();
    document.getElementById("game-status").innerHTML = `⚔️ یاری دەستی پێکرد! نۆرەی ${p1Name}`;
}

document.getElementById("start-game-btn").addEventListener("click", startGame);
document.getElementById("check-answer").addEventListener("click", checkAnswer);
document.getElementById("pass-btn").addEventListener("click", passQuestion);
document.getElementById("answer-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkAnswer();
});
