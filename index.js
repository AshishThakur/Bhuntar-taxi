const faqBoxes = document.querySelectorAll(".faq-box");

faqBoxes.forEach((box) => {
  const question = box.querySelector(".faq-question");
  const answer = box.querySelector(".faq-answer");

  question.addEventListener("click", () => {
    const isOpen = box.classList.contains("active");

    // Close all FAQs
    faqBoxes.forEach((item) => {
      const itemQuestion = item.querySelector(".faq-question");
      const itemAnswer = item.querySelector(".faq-answer");

      item.classList.remove("active");
      itemQuestion.setAttribute("aria-expanded", "false");
      itemAnswer.hidden = true;
    });

    // Open clicked FAQ if it was closed
    if (!isOpen) {
      box.classList.add("active");
      question.setAttribute("aria-expanded", "true");
      answer.hidden = false;
    }
  });
});


// =========================
// MOBILE MENU
// =========================

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navigation.classList.toggle("active");

  const expanded =
    menuToggle.getAttribute("aria-expanded") === "true";

  menuToggle.setAttribute("aria-expanded", !expanded);
});
