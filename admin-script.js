let fullData = {
    categories: {},
    players: [],
    settings: { totalTime: 45, passPenalty: 3 }
};

async function loadFromLocal() {
    const statusDiv = document.getElementById("data-status");
    try {
        const response = await fetch('floor-data.json');
        if (!response.ok) throw new Error('JSON نەدۆزرایەوە');
        const data = await response.json();
        fullData.players = data.players || [];
        fullData.settings = data.settings || { totalTime: 45, passPenalty: 3 };
        fullData.categories = data.categories || {};
        statusDiv.innerHTML = "✅ داتا لە JSON فایلەوە بارکرا";
        console.log("✅ داتا لە JSON بارکرا");
    } catch (error) {
        console.log("JSON فایل نەدۆزرایەوە، داتای بنەڕەتی بەکاردەهێنرێت");
        statusDiv.innerHTML = "⚠️ JSON فایل نەدۆزرایەوە، داتای بنەڕەتی بەکاردهێنرێت. دوای گۆڕانکاری JSON دابەزێنە.";
        setDefaultAdminData();
    }
    applySettingsToInputs();
    renderPlayers();
    renderCategoriesSelect();
}

function setDefaultAdminData() {
    fullData.categories = {
        animals: ["شێر", "پڵنگ", "فیل"],
        birds: ["ھەڵۆ", "باز", "بولبول"],
        flags: ["عێراق", "ئێران", "تورکیا"],
        maps: ["عێراق", "مەغریب", "جەزائیر"],
        players_names: ["مێسی", "ڕۆناڵدۆ", "نەیمار"],
        leaders: ["سەلاحەدین", "قەدافی", "ئەتاتورک"],
        celebrities: ["تۆم هەنکس", "وێڵ سمیت", "ئەنجلینا جۆلی"],
        furniture: ["جێگا", "مێز", "پۆلیف"],
        cars: ["تایۆتا", "ھۆندا", "فۆرد"],
        brands: ["ئەپڵ", "سامسۆنگ", "نایکی"],
        car_logos: ["تایۆتا", "فۆرد", "بێنز"],
        games: ["فیفا", "کاڵ ئۆف دیوتی", "پابجی"]
    };
    fullData.players = ["ئارام", "ژوان", "سۆران"];
    fullData.settings = { totalTime: 45, passPenalty: 3 };
}

function saveToLocal() {
    // Save to localStorage as backup
    localStorage.setItem("floor_game_data_backup", JSON.stringify(fullData));
}

function applySettingsToInputs() {
    document.getElementById("total-time").value = fullData.settings.totalTime;
    document.getElementById("pass-penalty").value = fullData.settings.passPenalty;
}

function renderPlayers() {
    const container = document.getElementById("players-list");
    if (!container) return;
    container.innerHTML = fullData.players.map((p, idx) => `
        <div class="item-badge">
            👤 ${p}
            <button onclick="deletePlayer(${idx})">🗑️</button>
        </div>
    `).join("");
}

function renderCategoriesSelect() {
    const select = document.getElementById("admin-category");
    if (!select) return;
    select.innerHTML = "";
    Object.keys(fullData.categories).forEach(cat => {
        select.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
}

window.deletePlayer = function(idx) {
    fullData.players.splice(idx, 1);
    saveToLocal();
    renderPlayers();
};

function addPlayer() {
    const newName = document.getElementById("new-player-name").value.trim();
    if (!newName) return alert("ناوێک بنووسە!");
    fullData.players.push(newName);
    saveToLocal();
    renderPlayers();
    document.getElementById("new-player-name").value = "";
    alert("✅ یاریزان زیادکرا! ئێستا JSON فایلەکە دابەزێنە.");
}

function addItem() {
    const cat = document.getElementById("admin-category").value;
    const newItem = document.getElementById("new-item-name").value.trim();
    if (!newItem) return alert("ناوێک بنووسە!");
    if (!fullData.categories[cat]) fullData.categories[cat] = [];
    fullData.categories[cat].push(newItem);
    saveToLocal();
    alert("✅ ناو زیادکرا! ئێستا JSON فایلەکە دابەزێنە.");
    document.getElementById("new-item-name").value = "";
}

function addCategory() {
    const newCat = document.getElementById("new-category-name").value.trim();
    if (!newCat) return alert("ناوی کاتەگۆری بنووسە!");
    if (fullData.categories[newCat]) {
        alert("ئەم کاتەگۆرییە هەیە!");
        return;
    }
    fullData.categories[newCat] = [];
    saveToLocal();
    renderCategoriesSelect();
    document.getElementById("new-category-name").value = "";
    alert("✅ کاتەگۆری نوێ دروستکرا! ئێستا JSON فایلەکە دابەزێنە.");
}

function saveSettings() {
    const totalTime = parseInt(document.getElementById("total-time").value);
    const passPenalty = parseInt(document.getElementById("pass-penalty").value);
    if (totalTime > 0) fullData.settings.totalTime = totalTime;
    if (passPenalty > 0) fullData.settings.passPenalty = passPenalty;
    saveToLocal();
    alert("✅ ڕێکخستنەکان پاشەکەوت کران! ئێستا JSON فایلەکە دابەزێنە.");
}

function downloadData() {
    const dataToSave = {
        players: fullData.players,
        settings: fullData.settings,
        categories: fullData.categories
    };
    const dataStr = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "floor-data.json";
    a.click();
    URL.revokeObjectURL(url);
    alert("✅ JSON فایلەکە دابەزی! تکایە بیخەرە ناو فۆڵدەری پرۆژەکەوە.");
}

function uploadData() {
    const fileInput = document.getElementById("upload-file-input");
    fileInput.click();
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const data = JSON.parse(evt.target.result);
                fullData.players = data.players || fullData.players;
                fullData.settings = data.settings || fullData.settings;
                fullData.categories = data.categories || fullData.categories;
                saveToLocal();
                applySettingsToInputs();
                renderPlayers();
                renderCategoriesSelect();
                alert("✅ داتا سەرکەوتوو بارکرا!");
                document.getElementById("data-status").innerHTML = "✅ فایلەکە بارکرا! ئێستا JSON دابەزێنە بۆ هەڵگرتن.";
            } catch(err) {
                alert("❌ هەڵە: فایلەکە JSON دروست نییە");
            }
        };
        reader.readAsText(file);
    };
}

// Event listeners
document.getElementById("add-player-btn")?.addEventListener("click", addPlayer);
document.getElementById("add-item-btn")?.addEventListener("click", addItem);
document.getElementById("add-category-btn")?.addEventListener("click", addCategory);
document.getElementById("save-settings")?.addEventListener("click", saveSettings);
document.getElementById("download-data")?.addEventListener("click", downloadData);
document.getElementById("upload-data")?.addEventListener("click", uploadData);

// Initialize
loadFromLocal();
