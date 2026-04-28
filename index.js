const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");
const icon = document.querySelector(".hamburger i");

/* =========================
   MOBILE MENU TOGGLE
========================= */
hamburger.addEventListener("click", () => {
  menu.classList.toggle("active");

  icon.classList.toggle("fa-bars");
  icon.classList.toggle("fa-xmark");
});

/* =========================
   CLOSE MENU AFTER CLICKING LINK
========================= */
document.querySelectorAll(".menu ul li a").forEach(link => {
  link.addEventListener("click", () => {
    menu.classList.remove("active");

    icon.classList.add("fa-bars");
    icon.classList.remove("fa-xmark");
  });
});

/* =========================
   FAQ ACCORDION
========================= */
document.querySelectorAll(".question-box").forEach((box) => {
  const question = box.querySelector(".question");
  const answer = box.querySelector(".answer");
  const icon = box.querySelector(".question-icon i");

  // hide all answers initially
  answer.style.display = "none";

  question.addEventListener("click", () => {
    
    // toggle answer
    if (answer.style.display === "none") {
      answer.style.display = "block";
      icon.style.transform = "rotate(45deg)"; // + to ×
    } else {
      answer.style.display = "none";
      icon.style.transform = "rotate(0deg)";
    }

  });
});