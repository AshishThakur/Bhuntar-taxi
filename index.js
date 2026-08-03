const faqBoxes = document.querySelectorAll(".faq-box");

faqBoxes.forEach((box) => {

  const question = box.querySelector(".faq-question");

  question.addEventListener("click", () => {

    faqBoxes.forEach((item) => {

      if(item !== box){
        item.classList.remove("active");
      }

    });

    box.classList.toggle("active");

  });

});

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navigation.classList.toggle("active");

  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", !expanded);
});
