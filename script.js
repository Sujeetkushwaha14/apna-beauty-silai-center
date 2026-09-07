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

// Compact stacked leadership cards.
const leadership = document.getElementById("leadership");
if (leadership) {
  leadership.innerHTML = `
    <div class="container compact-leadership">
      <div class="compact-leadership-heading"><span class="eyebrow">OUR TEAM</span><h2>Director & Manager</h2></div>
      <div class="compact-profile-list">
        <article class="compact-profile"><button class="compact-photo" type="button" aria-label="Director photo बदलें"><img src="assets/director.png" class="photo-one" alt="Gaurani Singh - Director"><img src="assets/director1.png" class="photo-two" alt="Gaurani Singh - Director alternate"></button><div class="compact-info"><span class="compact-role">DIRECTOR</span><h3>Gaurani Singh</h3><a class="compact-call" href="tel:+917398013197"><span>☎</span> 7398013197</a></div></article>
        <article class="compact-profile"><button class="compact-photo" type="button" aria-label="Manager photo बदलें"><img src="assets/managerimg.png" class="photo-one" alt="Arun Singh - Manager"><img src="assets/manager.png" class="photo-two" alt="Arun Singh - Manager alternate"></button><div class="compact-info"><span class="compact-role">MANAGER</span><h3>Arun Singh</h3><a class="compact-call" href="tel:+919161653032"><span>☎</span> 9161653032</a></div></article>
      </div>
    </div>`;
}

const leadershipStyle = document.createElement("style");
leadershipStyle.textContent = `.leadership-section{background:#fff7e7;padding:52px 0 58px;border-top:1px solid var(--line)}.compact-leadership{max-width:680px}.compact-leadership-heading{text-align:center;margin-bottom:24px}.compact-leadership-heading h2{font:800 34px/1.1 "Playfair Display";color:#4e122e;margin:5px 0 0}.compact-profile-list{display:flex;flex-direction:column;gap:16px}.compact-profile{display:flex;align-items:center;gap:22px;background:#fff;border:1px solid var(--line);border-radius:18px;padding:14px 18px;box-shadow:0 10px 28px #5b173012}.compact-photo{position:relative;flex:0 0 150px;width:150px;height:150px;border:0;padding:0;border-radius:14px;overflow:hidden;background:#f6ead6;cursor:pointer;box-shadow:0 5px 15px #4a10251c}.compact-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity .28s ease}.compact-photo .photo-one{opacity:1}.compact-photo .photo-two{opacity:0}.compact-photo.is-swapped .photo-one{opacity:0}.compact-photo.is-swapped .photo-two{opacity:1}.compact-photo:after{content:"↻";position:absolute;right:7px;bottom:7px;width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:#6f1238e8;color:#fff;font-size:15px}.compact-info{min-width:0}.compact-role{display:inline-block;color:#a02150;font-size:10px;letter-spacing:2px;font-weight:900}.compact-info h3{margin:3px 0 9px;color:#4e122e;font:800 28px/1.1 "Playfair Display"}.compact-call{display:inline-flex;align-items:center;gap:8px;text-decoration:none;color:#6f1238;font-size:15px;font-weight:900;background:#fff5df;border:1px solid #e6c98f;border-radius:999px;padding:7px 13px}.compact-call span{width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:#6f1238;color:#fff;font-size:13px}@media(max-width:560px){.leadership-section{padding:42px 0 48px}.compact-profile{gap:14px;padding:11px}.compact-photo{flex-basis:112px;width:112px;height:112px}.compact-info h3{font-size:22px;margin-bottom:7px}.compact-call{font-size:13px;padding:6px 10px}}`;
document.head.appendChild(leadershipStyle);
document.querySelectorAll(".compact-photo").forEach(button => button.addEventListener("click", () => button.classList.toggle("is-swapped")));

// Add the six uploaded photos directly into the existing gallery.
function addUploadedGalleryImages() {
  const galleryGrid = document.querySelector("#gallery .gallery-grid");
  if (!galleryGrid || galleryGrid.dataset.extraImagesAdded === "true") return;

  ["img1.png","img2.png","img3.png","img4.png","img5.png","img6.png"].forEach((file, index) => {
    const item = document.createElement("div");
    item.className = "gallery-item extra-gallery-item";
    item.innerHTML = `<img src="assets/${file}" alt="Apna Beauty & Silai Center gallery photo ${index + 1}"><span>Gallery Photo ${index + 1}</span>`;
    const image = item.querySelector("img");
    image.style.display = "block";
    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "cover";
    galleryGrid.appendChild(item);
  });

  galleryGrid.dataset.extraImagesAdded = "true";
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", addUploadedGalleryImages);
} else {
  addUploadedGalleryImages();
}

const sections = [...document.querySelectorAll("main section[id]")];
const links = [...document.querySelectorAll(".nav nav a")];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) links.forEach(link => link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id));
  });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach(s => observer.observe(s));
