
// ============================
// STICKY HEADER
// ============================

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

});


// ============================
// FAQ ACCORDION
// ============================

const faqBoxes = document.querySelectorAll(".faq-box");

faqBoxes.forEach((box) => {

  const question = box.querySelector(".faq-question");

  question.addEventListener("click", () => {

    faqBoxes.forEach((item) => {

      if (item !== box) {
        item.classList.remove("active");
      }

    });

    box.classList.toggle("active");

  });

});


// ============================
// SMOOTH SCROLL
// ============================

document.querySelectorAll('a[href^="#"]').forEach((link) => {

  link.addEventListener("click", function (event) {

    const target = document.querySelector(
      this.getAttribute("href")
    );

    if (target) {

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth"
      });

    }

  });

});

