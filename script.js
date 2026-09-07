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

// Compact leadership cards: Manager left, Director right on desktop and mobile.
const leadership = document.getElementById("leadership");
if (leadership) {
  leadership.innerHTML = `
    <div class="container compact-leadership">
      <div class="compact-leadership-heading"><span class="eyebrow">OUR TEAM</span><h2>Manager & Director</h2></div>
      <div class="compact-profile-list">
        <article class="compact-profile"><button class="compact-photo" type="button" aria-label="Manager photo बदलें"><img src="assets/managerimg.png" class="photo-one" alt="Arun Singh - Manager"><img src="assets/manager.png" class="photo-two" alt="Arun Singh - Manager alternate"></button><div class="compact-info"><span class="compact-role">MANAGER</span><h3>Arun Singh</h3><a class="compact-call" href="tel:+919161653032"><span>☎</span> 9161653032</a></div></article>
        <article class="compact-profile"><button class="compact-photo" type="button" aria-label="Director photo बदलें"><img src="assets/director.png" class="photo-one" alt="Gaurani Singh - Director"><img src="assets/director1.png" class="photo-two" alt="Gaurani Singh - Director alternate"></button><div class="compact-info"><span class="compact-role">DIRECTOR</span><h3>Gaurani Singh</h3><a class="compact-call" href="tel:+917398013197"><span>☎</span> 7398013197</a></div></article>
      </div>
    </div>`;
}

const leadershipStyle = document.createElement("style");
leadershipStyle.textContent = `.leadership-section{background:#fff7e7;padding:52px 0 58px;border-top:1px solid var(--line)}.compact-leadership{max-width:680px}.compact-leadership-heading{text-align:center;margin-bottom:24px}.compact-leadership-heading h2{font:800 34px/1.1 "Playfair Display";color:#4e122e;margin:5px 0 0}.compact-profile-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.compact-profile{display:flex;align-items:center;gap:14px;min-width:0;background:#fff;border:1px solid var(--line);border-radius:18px;padding:12px;box-shadow:0 10px 28px #5b173012}.compact-photo{position:relative;flex:0 0 112px;width:112px;height:112px;border:0;padding:0;border-radius:14px;overflow:hidden;background:#f6ead6;cursor:pointer;box-shadow:0 5px 15px #4a10251c}.compact-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity .28s ease}.compact-photo .photo-one{opacity:1}.compact-photo .photo-two{opacity:0}.compact-photo.is-swapped .photo-one{opacity:0}.compact-photo.is-swapped .photo-two{opacity:1}.compact-photo:after{content:"↻";position:absolute;right:6px;bottom:6px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:#6f1238e8;color:#fff;font-size:14px}.compact-info{min-width:0}.compact-role{display:inline-block;color:#a02150;font-size:9px;letter-spacing:2px;font-weight:900}.compact-info h3{margin:3px 0 8px;color:#4e122e;font:800 23px/1.1 "Playfair Display";white-space:nowrap}.compact-call{display:inline-flex;align-items:center;gap:6px;text-decoration:none;color:#6f1238;font-size:13px;font-weight:900;background:#fff5df;border:1px solid #e6c98f;border-radius:999px;padding:6px 9px;white-space:nowrap}.compact-call span{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:#6f1238;color:#fff;font-size:12px}@media(max-width:560px){.leadership-section{padding:42px 0 48px}.compact-leadership{max-width:100%}.compact-leadership-heading{margin-bottom:18px}.compact-leadership-heading h2{font-size:28px}.compact-profile-list{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.compact-profile{flex-direction:column;justify-content:flex-start;text-align:center;gap:8px;padding:9px 6px;border-radius:15px}.compact-photo{flex:0 0 auto;width:92px;height:92px}.compact-photo:after{right:4px;bottom:4px;width:22px;height:22px;font-size:13px}.compact-info{width:100%}.compact-role{font-size:8px;letter-spacing:1.5px}.compact-info h3{font-size:18px;margin:3px 0 7px;white-space:normal}.compact-call{font-size:11px;padding:5px 6px;gap:4px}.compact-call span{width:20px;height:20px;font-size:11px}}@media(max-width:360px){.compact-profile-list{gap:7px}.compact-photo{width:82px;height:82px}.compact-info h3{font-size:16px}.compact-call{font-size:10px;padding:4px 5px}}`;
document.head.appendChild(leadershipStyle);
document.querySelectorAll(".compact-photo").forEach(button => button.addEventListener("click", () => button.classList.toggle("is-swapped")));

// Trainee gallery: six uploaded photos shown as individual boxed cards inside the existing Gallery section.
function buildTraineeGallery() {
  const gallery = document.getElementById("gallery");
  if (!gallery || gallery.dataset.traineeGalleryBuilt === "true") return;

  const photos = ["img1.png","img2.png","img3.png","img4.png","img5.png","img6.png"];
  let grid = gallery.querySelector(".gallery-grid");

  if (!grid) {
    grid = document.createElement("div");
    grid.className = "gallery-grid trainee-gallery-grid";
    const container = gallery.querySelector(".container") || gallery;
    container.appendChild(grid);
  }

  photos.forEach((file, index) => {
    const card = document.createElement("article");
    card.className = "gallery-item trainee-gallery-card";
    card.innerHTML = `<div class="trainee-photo-box"><img src="assets/${file}" alt="Apna Beauty & Silai Center में सिलाई सीख रही trainee ${index + 1}" loading="lazy"></div><div class="trainee-gallery-info"><span>GALLERY</span><h3>Silai Training</h3><p>सिलाई सीख रही trainee</p></div>`;
    grid.appendChild(card);
  });

  gallery.dataset.traineeGalleryBuilt = "true";
}

const galleryStyle = document.createElement("style");
galleryStyle.textContent = `.trainee-gallery-grid{margin-top:24px}.trainee-gallery-card{background:#fff;border:1px solid var(--line);border-radius:18px;overflow:hidden;box-shadow:0 10px 28px #5b173014;transition:transform .2s ease,box-shadow .2s ease}.trainee-gallery-card:hover{transform:translateY(-4px);box-shadow:0 16px 32px #5b173020}.trainee-photo-box{height:230px;background:#f8efdf;overflow:hidden}.trainee-photo-box img{width:100%;height:100%;object-fit:cover;display:block}.trainee-gallery-info{padding:12px 13px 15px}.trainee-gallery-info span{font-size:9px;letter-spacing:2px;font-weight:900;color:#a02150}.trainee-gallery-info h3{margin:3px 0 1px;font:800 20px/1.1 "Playfair Display";color:#4e122e}.trainee-gallery-info p{margin:0;color:#6e5962;font-size:11px;font-weight:700}@media(max-width:900px){.trainee-gallery-grid{grid-template-columns:repeat(3,1fr)}}@media(max-width:650px){.trainee-gallery-grid{grid-template-columns:repeat(2,1fr);gap:12px}.trainee-photo-box{height:190px}.trainee-gallery-info h3{font-size:18px}}@media(max-width:420px){.trainee-gallery-grid{grid-template-columns:1fr}.trainee-photo-box{height:240px}}`;
document.head.appendChild(galleryStyle);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", buildTraineeGallery);
} else {
  buildTraineeGallery();
}

const sections = [...document.querySelectorAll("main section[id]")];
const links = [...document.querySelectorAll(".nav nav a")];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) links.forEach(link => link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id));
  });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach(s => observer.observe(s));
