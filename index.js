// MOBILE MENU

const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");
const hamburgerIcon = document.querySelector(".hamburger i");

hamburger.addEventListener("click", () => {

  menu.classList.toggle("active");

  hamburgerIcon.classList.toggle("fa-bars");
  hamburgerIcon.classList.toggle("fa-xmark");

});

// CLOSE MENU ON CLICK

document.querySelectorAll(".menu a").forEach(link => {

  link.addEventListener("click", () => {

    menu.classList.remove("active");

    hamburgerIcon.classList.add("fa-bars");
    hamburgerIcon.classList.remove("fa-xmark");

  });

});

// FAQ ACCORDION

const faqBoxes = document.querySelectorAll(".faq-box");

faqBoxes.forEach(box => {

  const question = box.querySelector(".faq-question");

  question.addEventListener("click", () => {

    box.classList.toggle("active");

  });

});
