let siteData=null;let currentLang=localStorage.getItem("portfolioLang")||"ku";let activeTab=0;
const $=id=>document.getElementById(id);

async function loadData(){try{const res=await fetch("content/site.json");siteData=await res.json();renderSite()}catch(e){document.body.innerHTML='<div style="padding:30px;color:white">Could not load content/site.json. Use a local server or upload to Netlify.</div>'}}

function t(){return siteData.languages[currentLang]||siteData.languages.ku}

function renderSite(){const data=t();document.documentElement.lang=currentLang;document.documentElement.dir=data.direction;document.body.setAttribute("dir",data.direction);
// دوگمەی زمان
$("langBtn").textContent=currentLang==="ku"?"English":"کوردی";
// ناوەکانی مێنیو
$("navHome").textContent=data.header.menu[0];
$("navAbout").textContent=data.tabs[0].title;
$("navPersonal").textContent=data.tabs[1].title;
$("navExperience").textContent=data.tabs[2].title;
$("navPhotos").textContent=data.tabs[3].title;
$("navVideos").textContent=data.tabs[4].title;
// کارت
$("cardName").textContent=currentLang==="ku"?"شارین عەلی":"SHARIN ALI";
$("cardJob").textContent=currentLang==="ku"?"گرافیک دیزاینەر و ئیدیتەری ڤیدیۆ":"Graphic Designer & Video Editor";
$("heroTitle").textContent=data.hero.title;$("heroDescription").textContent=data.hero.description;$("footerText").textContent=data.footer;
// نیشاندانی ناوەڕۆک (بەبێ دوگمە)
showContent(activeTab);
// ڕووداو بۆ مێنیوی مۆبایل
setupMobileMenu();
}

function showContent(index){const data=t();const tab=data.tabs[index];if(!tab)return;const panel=$("contentPanel");let html=`<h2>${escapeHtml(tab.title)}</h2>`;if(tab.content)html+=`<p>${escapeHtml(tab.content)}</p>`;if(tab.type==="gallery"){html+='<div class="gallery">';(tab.images||[]).forEach(img=>{html+=`<div class="gallery-item" data-src="${escapeAttr(img.src)}"><img src="${escapeAttr(img.src)}" alt="${escapeAttr(img.title)}" onerror="this.style.display='none'"><span>${escapeHtml(img.title)}</span></div>`});html+='</div>'}if(tab.type==="videos"){html+='<div class="video-list">';(tab.videos||[]).forEach(v=>{html+=`<a href="${escapeAttr(v.url)}" target="_blank" rel="noopener">▶ ${escapeHtml(v.title)}</a>`});html+='</div>'}panel.innerHTML=html;panel.querySelectorAll(".gallery-item").forEach(item=>item.onclick=()=>openLightbox(item.dataset.src))}

function setupMobileMenu(){const toggle=$("menuToggle");const nav=$("mainNav");if(toggle){toggle.onclick=()=>{toggle.classList.toggle("active");nav.classList.toggle("open")};document.querySelectorAll(".nav a").forEach(link=>{link.onclick=(e)=>{e.preventDefault();const href=link.getAttribute("href");if(href){const target=href.replace("#","");const tabIndex=document.querySelector(`#${target}`)?.["dataset"]?.index;if(tabIndex!==undefined){activeTab=parseInt(tabIndex);showContent(activeTab)}else if(target==="home"){document.getElementById("home").scrollIntoView({behavior:"smooth"})}else{const idx=["home","about","personal","experience","photos","videos"].indexOf(target);if(idx>0){activeTab=idx-1;showContent(activeTab)}}}toggle.classList.remove("active");nav.classList.remove("open")}})}}

// کلیک لەسەر لینکەکانی هێدەر
document.querySelectorAll(".nav a").forEach((link,index)=>{link.addEventListener("click",function(e){e.preventDefault();const href=this.getAttribute("href");if(href==="#home"){document.getElementById("home").scrollIntoView({behavior:"smooth"});return}const sections=["about","personal","experience","photos","videos"];const target=href.replace("#","");const idx=sections.indexOf(target);if(idx!==-1){activeTab=idx;showContent(activeTab);document.getElementById("about").scrollIntoView({behavior:"smooth"})}})});

function openLightbox(src){$("lightboxImg").src=src;$("lightbox").classList.add("active")}

$("closeLightbox").onclick=()=>$("lightbox").classList.remove("active");$("lightbox").onclick=e=>{if(e.target.id==="lightbox")$("lightbox").classList.remove("active")};

$("langBtn").onclick=()=>{currentLang=currentLang==="ku"?"en":"ku";localStorage.setItem("portfolioLang",currentLang);activeTab=0;renderSite()};

function escapeHtml(s=""){return String(s).replace(/[&<>'"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[m]))}

function escapeAttr(s=""){return escapeHtml(s)}

loadData();
