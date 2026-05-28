let fullData = JSON.parse(localStorage.getItem("floor_game_data")) || null;

if (!fullData) {
    fullData = {
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
}

function saveToLocal() {
    localStorage.setItem("floor_game_data", JSON.stringify(fullData));
}

function renderList() {
    const category = document.getElementById("admin-category").value;
    const container = document.getElementById("items-list");
    const items = fullData[category] || [];
    container.innerHTML = `<div class="items-grid">${items.map((item, idx) => `
        <div class="item-badge">
            📌 ${item}
            <button onclick="deleteItem('${category}', ${idx})">🗑️</button>
        </div>
    `).join('')}</div>`;
}

window.deleteItem = (cat, idx) => {
    fullData[cat].splice(idx, 1);
    saveToLocal();
    renderList();
};

document.getElementById("add-item-btn").addEventListener("click", () => {
    const cat = document.getElementById("admin-category").value;
    const newName = document.getElementById("new-item-name").value.trim();
    if (!newName) return alert("ناوێک بنووسە!");
    if (!fullData[cat]) fullData[cat] = [];
    fullData[cat].push(newName);
    saveToLocal();
    renderList();
    document.getElementById("new-item-name").value = "";
});

document.getElementById("download-data").addEventListener("click", () => {
    const dataStr = JSON.stringify(fullData, null, 2);
    const blob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "floor-game-data.json";
    a.click();
    URL.revokeObjectURL(url);
});

renderList();
