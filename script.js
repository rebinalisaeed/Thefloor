/* ===============================
   Portfolio Website Script
   SHARIN ALI
================================ */

const langBtn = document.getElementById("langBtn");
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

let currentLang = "ku";

/* ===============================
   Translations
================================ */
const translations = {
  ku: {
    navHome: "سەرەکی",
    navAbout: "دەربارە",
    navServices: "خزمەتگوزاری",
    navPortfolio: "کارەکان",
    navContact: "پەیوەندی",

    heroLabel: "پۆرتفۆلیۆی دیزاینەر",
    heroTitle1: "سڵاو، من",
    heroTitle2: "گرافیک دیزاینەر، ئیدیتەری وێنە و ڤیدیۆ",
    heroDescription:
      "من یارمەتی براندەکان، پەیجەکان و کەسەکان دەدەم تا لە ڕێگەی دیزاینی جوان، وێنەی پیشەیی و ڤیدیۆی کاریگەر، خۆیان باشتر پیشان بدەن.",
    viewWorks: "بینینی کارەکانم",
    contactMe: "پەیوەندیم پێوە بکە",

    aboutTitle: "دەربارەی من",
    aboutText:
      "من شارین عەلیم، کارم لە بواری گرافیک دیزاین، ئیدیتی وێنە، فۆتۆشۆپ و مۆنتاژی ڤیدیۆیە. ئامانجم ئەوەیە دیزاینێکی جوان، ڕوون و کاریگەر دروست بکەم کە پەیامی براند یان کەسەکە بەباشی بگەیەنێت.",

    servicesTitle: "خزمەتگوزارییەکان",
    service1Title: "دیزاینی لۆگۆ",
    service1Text: "دروستکردنی لۆگۆی جوان و تایبەت بۆ براند و پڕۆژەکان.",
    service2Title: "دیزاینی سۆشیال میدیا",
    service2Text: "دیزاینی پۆست، ستۆری و ڕیکلام بۆ پەیجەکانی سۆشیال میدیا.",
    service3Title: "ئیدیتی وێنە",
    service3Text: "ڕێکخستن، جوانکردن و دەستکاری پیشەیی وێنەکان.",
    service4Title: "مۆنتاژی ڤیدیۆ",
    service4Text: "مۆنتاژ، ڕێکخستن و دروستکردنی ڤیدیۆی کاریگەر.",

    portfolioTitle: "کارەکانم",

    skillsTitle: "بەرنامە و شارەزاییەکان",

    contactTitle: "پەیوەندی",
    contactText:
      "بۆ داواکاری کار، پڕۆژە، یان پرسیار، دەتوانیت پەیوەندیم پێوە بکەیت.",

    whatsapp: "واتساپ",
    instagram: "ئینستاگرام",
    facebook: "فەیسبووک",
    email: "ئیمەیڵ"
  },

  en: {
    navHome: "Home",
    navAbout: "About",
    navServices: "Services",
    navPortfolio: "Portfolio",
    navContact: "Contact",

    heroLabel: "Designer Portfolio",
    heroTitle1: "Hello, I am",
    heroTitle2: "Graphic Designer, Photo Editor & Video Editor",
    heroDescription:
      "I help brands, pages, and individuals present themselves better through beautiful design, professional photo editing, and impactful video editing.",
    viewWorks: "View My Works",
    contactMe: "Contact Me",

    aboutTitle: "About Me",
    aboutText:
      "I am Sharin Ali. I work in graphic design, photo editing, Photoshop, and video editing. My goal is to create beautiful, clear, and effective designs that deliver the message of a brand or person professionally.",

    servicesTitle: "Services",
    service1Title: "Logo Design",
    service1Text: "Creating beautiful and unique logos for brands and projects.",
    service2Title: "Social Media Design",
    service2Text: "Designing posts, stories, and ads for social media pages.",
    service3Title: "Photo Editing",
    service3Text: "Professional photo retouching, enhancement, and editing.",
    service4Title: "Video Editing",
    service4Text: "Editing, organizing, and creating impactful videos.",

    portfolioTitle: "My Works",

    skillsTitle: "Tools & Skills",

    contactTitle: "Contact",
    contactText:
      "For work requests, projects, or questions, you can contact me directly.",

    whatsapp: "WhatsApp",
    instagram: "Instagram",
    facebook: "Facebook",
    email: "Email"
  }
};

/* ===============================
   Change Language
================================ */
function changeLanguage(lang) {
  currentLang = lang;

  document.documentElement.lang = lang;

  if (lang === "ku") {
    document.documentElement.dir = "rtl";
    document.body.setAttribute("dir", "rtl");
    langBtn.textContent = "EN";
  } else {
    document.documentElement.dir = "ltr";
    document.body.setAttribute("dir", "ltr");
    langBtn.textContent = "KU";
  }

  const elements = document.querySelectorAll("[data-key]");

  elements.forEach((element) => {
    const key = element.getAttribute("data-key");

    if (translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });

  localStorage.setItem("portfolioLang", lang);
}

/* ===============================
   Language Button
================================ */
langBtn.addEventListener("click", () => {
  if (currentLang === "ku") {
    changeLanguage("en");
  } else {
    changeLanguage("ku");
  }
});

/* ===============================
   Mobile Menu
================================ */
menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");

  if (navMenu.classList.contains("active")) {
    menuBtn.textContent = "×";
  } else {
    menuBtn.textContent = "☰";
  }
});

/* ===============================
   Close Menu After Click
================================ */
const navLinks = document.querySelectorAll(".nav-menu a");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    menuBtn.textContent = "☰";
  });
});

/* ===============================
   Load Saved Language
================================ */
const savedLang = localStorage.getItem("portfolioLang");

if (savedLang === "en") {
  changeLanguage("en");
} else {
  changeLanguage("ku");
}
