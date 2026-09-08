const WHATSAPP = "919161653032";

const SOCIAL = {
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/"
};

document.querySelectorAll("#instagramTop,#instagramFooter").forEach(a => a.href = SOCIAL.instagram);
document.querySelectorAll("#facebookTop,#facebookFooter").forEach(a => a.href = SOCIAL.facebook);

const menu = document.querySelector(".menu");
const nav = document.querySelector(".nav nav");
menu?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", open ? "true" : "false");
});
document.querySelectorAll(".nav nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("enquiryForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const course = document.getElementById("course").value;
  const batch = document.getElementById("batch").value;
  const message = document.getElementById("message").value.trim() || "Course ki details chahiye.";
  const text = `*New Admission Enquiry*\n\n👤 Name: ${name}\n📱 Mobile: ${phone}\n📚 Course: ${course}\n🕐 Batch: ${batch}\n💬 Message: ${message}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  document.getElementById("formNote").textContent = "WhatsApp खुल रहा है — message check करके Send दबाएँ।";
});

// Use the uploaded full logo. The logo artwork already contains the brand name,
// so the separate text brand is hidden to avoid showing the name twice.
document.querySelectorAll(".brand").forEach(brand => {
  const round = brand.querySelector(".brand-round");
  const text = brand.querySelector("span:not(.uploaded-logo)");
  if (round) round.outerHTML = '<img class="uploaded-logo" src="assets/logo-name.png" alt="Apna Beauty & Silai Center logo">';
  if (text) text.style.display = "none";
});

// Compact leadership cards. Director intentionally shows only the name: no director photo or photo frame.
const leadership = document.getElementById("leadership");
if (leadership) {
  leadership.innerHTML = `
    <div class="container compact-leadership">
      <div class="compact-leadership-heading"><span class="eyebrow">OUR TEAM</span><h2>Manager & Director</h2></div>
      <div class="compact-profile-list">
        <article class="compact-profile"><button class="compact-photo" type="button" aria-label="Manager photo बदलें"><img src="assets/managerimg.png" class="photo-one" alt="Arun Singh - Manager"><img src="assets/manager.png" class="photo-two" alt="Arun Singh - Manager alternate"></button><div class="compact-info"><span class="compact-role">MANAGER</span><h3>Arun Singh</h3><a class="compact-call" href="tel:+919161653032"><span>☎</span> 9161653032</a></div></article>
        <article class="compact-profile director-name-only"><div class="compact-info"><span class="compact-role">DIRECTOR</span><h3>Gaurani Singh</h3></div></article>
      </div>
    </div>`;
}

const leadershipStyle = document.createElement("style");
leadershipStyle.textContent = `.leadership-section{background:#fff7e7;padding:52px 0 58px;border-top:1px solid var(--line)}.compact-leadership{max-width:680px}.compact-leadership-heading{text-align:center;margin-bottom:24px}.compact-leadership-heading h2{font:800 34px/1.1 "Playfair Display";color:#4e122e;margin:5px 0 0}.compact-profile-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.compact-profile{display:flex;align-items:center;gap:14px;min-width:0;background:#fff;border:1px solid var(--line);border-radius:18px;padding:12px;box-shadow:0 10px 28px #5b173012}.compact-photo{position:relative;flex:0 0 112px;width:112px;height:112px;border:0;padding:0;border-radius:14px;overflow:hidden;background:#f6ead6;cursor:pointer;box-shadow:0 5px 15px #4a10251c}.compact-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity .28s ease}.compact-photo .photo-one{opacity:1}.compact-photo .photo-two{opacity:0}.compact-photo.is-swapped .photo-one{opacity:0}.compact-photo.is-swapped .photo-two{opacity:1}.compact-photo:after{content:"↻";position:absolute;right:6px;bottom:6px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:#6f1238e8;color:#fff;font-size:14px}.compact-info{min-width:0}.compact-role{display:inline-block;color:#a02150;font-size:9px;letter-spacing:2px;font-weight:900}.compact-info h3{margin:3px 0 8px;color:#4e122e;font:800 23px/1.1 "Playfair Display";white-space:nowrap}.compact-call{display:inline-flex;align-items:center;gap:6px;text-decoration:none;color:#6f1238;font-size:13px;font-weight:900;background:#fff5df;border:1px solid #e6c98f;border-radius:999px;padding:6px 9px;white-space:nowrap}.compact-call span{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:#6f1238;color:#fff;font-size:12px}.director-name-only{justify-content:center}.director-name-only .compact-info{text-align:center}.director-name-only .compact-info h3{margin-bottom:0}@media(max-width:560px){.leadership-section{padding:42px 0 48px}.compact-leadership{max-width:100%}.compact-leadership-heading{margin-bottom:18px}.compact-leadership-heading h2{font-size:28px}.compact-profile-list{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.compact-profile{flex-direction:column;justify-content:flex-start;text-align:center;gap:8px;padding:9px 6px;border-radius:15px}.compact-photo{flex:0 0 auto;width:92px;height:92px}.compact-photo:after{right:4px;bottom:4px;width:22px;height:22px;font-size:13px}.compact-info{width:100%}.compact-role{font-size:8px;letter-spacing:1.5px}.compact-info h3{font-size:18px;margin:3px 0 7px;white-space:normal}.compact-call{font-size:11px;padding:5px 6px;gap:4px}.compact-call span{width:20px;height:20px;font-size:11px}.director-name-only{min-height:112px;justify-content:center}}@media(max-width:360px){.compact-profile-list{gap:7px}.compact-photo{width:82px;height:82px}.compact-info h3{font-size:16px}.compact-call{font-size:10px;padding:4px 5px}}`;
document.head.appendChild(leadershipStyle);
document.querySelectorAll(".compact-photo").forEach(button => button.addEventListener("click", () => button.classList.toggle("is-swapped")));

// Add the requested Hindi message and the uploaded beauty image above the existing gallery.
function buildBeautyMessage() {
  if (document.getElementById("beauty-message")) return;
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  const section = document.createElement("section");
  section.id = "beauty-message";
  section.className = "beauty-message-section";
  section.innerHTML = `
    <div class="container beauty-message-grid">
      <div class="beauty-message-copy">
        <span class="eyebrow">BEAUTY • SKILL • SELF RELIANCE</span>
        <h2>खूबसूरती बनाना सिर्फ काम नहीं, एक कला है।</h2>
        <p>हर सफल ब्यूटीशियन की शुरुआत सीखने से होती है।</p>
        <p>आज सीखो, कल कमाओ और अपने सपनों को सच बनाओ।</p>
        <p>आपके हाथों का हुनर किसी की खूबसूरती और आपकी सफलता दोनों बना सकता है।</p>
        <p>केवल सुंदरता नहीं, महिलाओं को आत्मनिर्भर बनाने का माध्यम है।</p>
      </div>
      <div class="beauty-message-image"><img src="assets/imagbuty.png" alt="Apna Beauty & Silai Center beauty training" loading="lazy"></div>
    </div>`;
  gallery.parentNode.insertBefore(section, gallery);
}

const messageStyle = document.createElement("style");
messageStyle.textContent = `.uploaded-logo{width:48px;height:48px;object-fit:contain;display:block}.beauty-message-section{padding:64px 0;background:linear-gradient(135deg,#fff8eb,#fff 55%,#f9edf2);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.beauty-message-grid{display:grid;grid-template-columns:1.15fr .85fr;align-items:center;gap:42px}.beauty-message-copy h2{font:800 38px/1.18 "Playfair Display","Noto Sans Devanagari",sans-serif;color:#4e122e;margin:8px 0 20px}.beauty-message-copy p{margin:10px 0;color:#5d4b53;font-size:17px;line-height:1.75;font-weight:600}.beauty-message-image{border-radius:24px;overflow:hidden;background:#fff;box-shadow:0 18px 45px #5b173020;border:1px solid var(--line)}.beauty-message-image img{width:100%;height:390px;display:block;object-fit:cover}.gallery-section .section-heading{margin-bottom:20px}@media(max-width:760px){.beauty-message-section{padding:48px 0}.beauty-message-grid{grid-template-columns:1fr;gap:24px}.beauty-message-copy h2{font-size:30px}.beauty-message-copy p{font-size:15px}.beauty-message-image img{height:300px}}`;
document.head.appendChild(messageStyle);

// Show all five newly uploaded WhatsApp photos in the existing Gallery section.
function buildUploadedGallery() {
  const gallery = document.getElementById("gallery");
  if (!gallery || gallery.dataset.uploadedGalleryBuilt === "true") return;

  const photos = [
    "whatsapp-image.png",
    "whatsapp-image-20.png",
    "whatsapp-ima.png",
    "whatsapp-imag.png",
    "whatsapp-image-2.png"
  ];
  const grid = gallery.querySelector(".gallery-grid");
  if (!grid) return;

  // Keep the original special-offer flyer, but replace the old generated gallery cards with uploaded photos.
  grid.innerHTML = "";
  photos.forEach((file, index) => {
    const card = document.createElement("article");
    card.className = "gallery-item uploaded-gallery-card";
    card.innerHTML = `<div class="uploaded-gallery-photo"><img src="assets/${file}" alt="Apna Beauty & Silai Center training photo ${index + 1}" loading="lazy"></div><span>Training & Work</span>`;
    grid.appendChild(card);
  });

  const flyerCard = document.createElement("div");
  flyerCard.className = "gallery-item full";
  flyerCard.innerHTML = '<img src="assets/flyer.svg" alt="₹12,000 से ₹7,000 Beauty Parlour और Silai Special Offer"><span>Special Offer</span>';
  grid.appendChild(flyerCard);
  gallery.dataset.uploadedGalleryBuilt = "true";
}

const galleryStyle = document.createElement("style");
galleryStyle.textContent = `.uploaded-gallery-card{background:#fff;border:1px solid var(--line);border-radius:18px;overflow:hidden;box-shadow:0 10px 28px #5b173014}.uploaded-gallery-photo{height:240px;background:#f8efdf;overflow:hidden}.uploaded-gallery-photo img{width:100%;height:100%;display:block;object-fit:cover}.uploaded-gallery-card>span{display:block;padding:11px 13px 14px;color:#4e122e;font-weight:800;font-size:13px}.gallery-grid .uploaded-gallery-card.full{grid-column:1/-1}@media(max-width:650px){.uploaded-gallery-photo{height:210px}}@media(max-width:420px){.uploaded-gallery-photo{height:260px}}`;
document.head.appendChild(galleryStyle);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    buildBeautyMessage();
    buildUploadedGallery();
  });
} else {
  buildBeautyMessage();
  buildUploadedGallery();
}

const sections = [...document.querySelectorAll("main section[id]")];
const links = [...document.querySelectorAll(".nav nav a")];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => links.forEach(link => link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id)));
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach(s => observer.observe(s));
