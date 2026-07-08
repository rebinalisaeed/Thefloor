let siteData=null;let currentLang=localStorage.getItem("portfolioLang")||"ku";let activeTab=0;
const $=id=>document.getElementById(id);
async function loadData(){try{const res=await fetch("content/site.json");siteData=await res.json();renderSite()}catch(e){document.body.innerHTML='<div style="padding:30px;color:white">Could not load content/site.json. Use a local server or upload to Netlify.</div>'}}
function t(){return siteData.languages[currentLang]||siteData.languages.ku}
function renderSite(){const data=t();document.documentElement.lang=currentLang;document.documentElement.dir=data.direction;document.body.setAttribute("dir",data.direction);
// گۆڕینی دوگمەی زمان
$("langBtn").textContent=currentLang==="ku"?"کوردی":"English";
// گۆڕینی ناو بە پێی زمان
if(currentLang==="ku"){$("brandName").textContent="شارین عەلی";$("brandName").style.fontWeight="bold"}else{$("brandName").textContent="SHARIN ALI";$("brandName").style.fontWeight="bold"}
$("navHome").textContent=data.header.menu[0];$("navTabs").textContent=data.header.menu[1];$("navContact").textContent=data.header.menu[2];
// job لابرا
// $("heroJob").textContent=data.header.job;
$("heroTitle").textContent=data.hero.title;$("heroDescription").textContent=data.hero.description;
// دوگمەی بینینی بەشەکان لابرا
// $("heroButton").textContent=data.hero.button;
$("cardName").textContent=data.header.name;$("cardJob").textContent=data.header.job;$("footerText").textContent=data.footer;renderTabs();renderContact(data)}
function renderTabs(){const data=t();const buttons=$("tabButtons");buttons.innerHTML="";data.tabs.forEach((tab,i)=>{const btn=document.createElement("button");btn.className="tab-btn"+(i===activeTab?" active":"");btn.textContent=tab.title;btn.onclick=()=>{activeTab=i;renderTabs()};buttons.appendChild(btn)});renderPanel(data.tabs[activeTab])}
function renderPanel(tab){const panel=$("tabPanel");let html=`<h2>${escapeHtml(tab.title)}</h2>`;if(tab.content)html+=`<p>${escapeHtml(tab.content)}</p>`;if(tab.type==="gallery"){html+='<div class="gallery">';(tab.images||[]).forEach(img=>{html+=`<div class="gallery-item" data-src="${escapeAttr(img.src)}"><img src="${escapeAttr(img.src)}" alt="${escapeAttr(img.title)}" onerror="this.style.display='none'"><span>${escapeHtml(img.title)}</span></div>`});html+='</div>'}if(tab.type==="videos"){html+='<div class="video-list">';(tab.videos||[]).forEach(v=>{html+=`<a href="${escapeAttr(v.url)}" target="_blank" rel="noopener">▶ ${escapeHtml(v.title)}</a>`});html+='</div>'}if(tab.type==="contact"){html+=contactHtml(tab)}panel.innerHTML=html;panel.querySelectorAll(".gallery-item").forEach(item=>item.onclick=()=>openLightbox(item.dataset.src))}
function renderContact(data){const contact=data.tabs.find(x=>x.type==="contact");$("contactBox").innerHTML=contact?`<h2>${escapeHtml(contact.title)}</h2><p>${escapeHtml(contact.content||"")}</p>${contactHtml(contact)}`:""}
function contactHtml(c){let html='<div class="contact-list">';if(c.phone)html+=`<a href="tel:${escapeAttr(c.phone)}">Phone: ${escapeHtml(c.phone)}</a>`;if(c.email)html+=`<a href="mailto:${escapeAttr(c.email)}">Email: ${escapeHtml(c.email)}</a>`;if(c.instagram)html+=`<a href="${escapeAttr(c.instagram)}" target="_blank">Instagram</a>`;if(c.facebook)html+=`<a href="${escapeAttr(c.facebook)}" target="_blank">Facebook</a>`;return html+'</div>'}
function openLightbox(src){$("lightboxImg").src=src;$("lightbox").classList.add("active")}
$("closeLightbox").onclick=()=>$("lightbox").classList.remove("active");$("lightbox").onclick=e=>{if(e.target.id==="lightbox")$("lightbox").classList.remove("active")};$("langBtn").onclick=()=>{currentLang=currentLang==="ku"?"en":"ku";localStorage.setItem("portfolioLang",currentLang);activeTab=0;renderSite()};
function escapeHtml(s=""){return String(s).replace(/[&<>'"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[m]))}function escapeAttr(s=""){return escapeHtml(s)}
loadData();
