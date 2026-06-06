const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");
const icon = hamburger.querySelector("i");

hamburger.addEventListener("click", () => {
  menu.classList.toggle("active");

  if (menu.classList.contains("active")) {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-xmark");
  } else {
    icon.classList.remove("fa-xmark");
    icon.classList.add("fa-bars");
  }
});


// FAQ ACCORDION

const faqBoxes = document.querySelectorAll(".faq-box");

faqBoxes.forEach(box => {

  const question = box.querySelector(".faq-question");

  question.addEventListener("click", () => {

    box.classList.toggle("active");

  });

});