let siteData=null;let currentLang=localStorage.getItem("portfolioLang")||"ku";let activeTab=0;
const $=id=>document.getElementById(id);
async function loadData(){try{const res=await fetch("content/site.json");siteData=await res.json();renderSite()}catch(e){document.body.innerHTML='<div style="padding:30px;color:white">Could not load content/site.json. Use a local server or upload to Netlify.</div>'}}
function t(){return siteData.languages[currentLang]||siteData.languages.ku}
function renderSite(){const data=t();document.documentElement.lang=currentLang;document.documentElement.dir=data.direction;document.body.setAttribute("dir",data.direction);
// دوگمەی زمان - تەنها زمانی تر نیشان بدە
$("langBtn").textContent=currentLang==="ku"?"English":"کوردی";
// ناوەکە لە کارتدا
$("cardName").textContent=currentLang==="ku"?"شارین عەلی":"SHARIN ALI";
$("cardJob").textContent=currentLang==="ku"?"گرافیک دیزاینەر و ئیدیتەری ڤیدیۆ":"Graphic Designer & Video Editor";
$("heroTitle").textContent=data.hero.title;$("heroDescription").textContent=data.hero.description;$("footerText").textContent=data.footer;
renderTabs();
// پەیوەندی لابرا - هیچ کام ناگۆڕدرێت
}
function renderTabs(){const data=t();const buttons=$("tabButtons");buttons.innerHTML="";data.tabs.forEach((tab,i)=>{const btn=document.createElement("button");btn.className="tab-btn"+(i===activeTab?" active":"");btn.textContent=tab.title;btn.onclick=()=>{activeTab=i;renderTabs()};buttons.appendChild(btn)});renderPanel(data.tabs[activeTab])}
function renderPanel(tab){const panel=$("tabPanel");let html=`<h2>${escapeHtml(tab.title)}</h2>`;if(tab.content)html+=`<p>${escapeHtml(tab.content)}</p>`;if(tab.type==="gallery"){html+='<div class="gallery">';(tab.images||[]).forEach(img=>{html+=`<div class="gallery-item" data-src="${escapeAttr(img.src)}"><img src="${escapeAttr(img.src)}" alt="${escapeAttr(img.title)}" onerror="this.style.display='none'"><span>${escapeHtml(img.title)}</span></div>`});html+='</div>'}if(tab.type==="videos"){html+='<div class="video-list">';(tab.videos||[]).forEach(v=>{html+=`<a href="${escapeAttr(v.url)}" target="_blank" rel="noopener">▶ ${escapeHtml(v.title)}</a>`});html+='</div>'}
// تابی پەیوەندی پشتگوێ دەخرێت (نیشان نادرێت)
panel.innerHTML=html;panel.querySelectorAll(".gallery-item").forEach(item=>item.onclick=()=>openLightbox(item.dataset.src))}
function openLightbox(src){$("lightboxImg").src=src;$("lightbox").classList.add("active")}
$("closeLightbox").onclick=()=>$("lightbox").classList.remove("active");$("lightbox").onclick=e=>{if(e.target.id==="lightbox")$("lightbox").classList.remove("active")};$("langBtn").onclick=()=>{currentLang=currentLang==="ku"?"en":"ku";localStorage.setItem("portfolioLang",currentLang);activeTab=0;renderSite()};
function escapeHtml(s=""){return String(s).replace(/[&<>'"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[m]))}function escapeAttr(s=""){return escapeHtml(s)}
loadData();
