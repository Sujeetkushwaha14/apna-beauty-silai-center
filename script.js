const WHATSAPP = "919161653032";

// Add the real profile URLs here when available.
// The buttons already work; replace these two values with the center's profile URLs.
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

  const text =
`*New Admission Enquiry*\n\n👤 Name: ${name}\n📱 Mobile: ${phone}\n📚 Course: ${course}\n🕐 Batch: ${batch}\n💬 Message: ${message}`;

  const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener");

  document.getElementById("formNote").textContent =
    "WhatsApp खुल रहा है — message check करके Send दबाएँ।";
});

// Leadership profile photo swap: click the profile image to reveal its alternate photo.
document.querySelectorAll("[data-profile-switch] .profile-photo").forEach(button => {
  button.addEventListener("click", () => {
    const swapped = button.classList.toggle("is-swapped");
    button.setAttribute("aria-pressed", swapped ? "true" : "false");
    button.setAttribute("aria-label", swapped ? "पहली profile photo दिखाएँ" : "दूसरी profile photo दिखाएँ");
  });
});

// Smooth active-section indicator.
const sections = [...document.querySelectorAll("main section[id]")];
const links = [...document.querySelectorAll(".nav nav a")];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(link => link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id));
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach(s => observer.observe(s));
