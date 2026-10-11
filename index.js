const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");
const navLinks = navigation.querySelectorAll("a");

/* =========================================
   MOBILE MENU
========================================= */

function setMenu(open) {
  menuToggle.classList.toggle("active", open);
  navigation.classList.toggle("active", open);
  menuToggle.setAttribute("aria-expanded", String(open));
}

menuToggle.addEventListener("click", () => {
  setMenu(!navigation.classList.contains("active"));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

// Escape se menu band
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

/* =========================================
   HEADER SHRINK + SCROLL PROGRESS BAR
========================================= */

const progress = document.createElement("div");
progress.className = "scroll-progress";
document.body.prepend(progress);

function onScroll() {
  header.classList.toggle("scrolled", window.scrollY > 20);

  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  progress.style.transform = `scaleX(${ratio})`;
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* =========================================
   ACTIVE NAV LINK (scroll spy)
========================================= */

const sections = [...navLinks]
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((a) =>
          a.classList.toggle(
            "active",
            a.getAttribute("href") === "#" + entry.target.id,
          ),
        );
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" },
);

sections.forEach((section) => spy.observe(section));

/* =========================================
   FAQ ACCORDION
========================================= */

const faqBoxes = document.querySelectorAll(".faq-box");

faqBoxes.forEach((box) => {
  const question = box.querySelector(".faq-question");

  question.addEventListener("click", () => {
    const willOpen = !box.classList.contains("active");

    faqBoxes.forEach((item) => {
      item.classList.remove("active");
      item
        .querySelector(".faq-question")
        .setAttribute("aria-expanded", "false");
    });

    if (willOpen) {
      box.classList.add("active");
      question.setAttribute("aria-expanded", "true");
    }
  });
});

/* =========================================
   SCROLL REVEAL ANIMATION
========================================= */

const revealGroups = [
  ".section-heading > *",
  ".service-card",
  ".destination-card",
  ".cta-content > *",
  ".faq-box",
  ".footer-column",
];

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (!reduceMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );

  revealGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.classList.add("reveal");
      // stagger: har card thoda late aata hai
      el.style.setProperty("--d", `${(index % 4) * 90}ms`);
      revealObserver.observe(el);
    });
  });
}

/* =========================================
   HERO STATS LOOP (counter + typewriter)
========================================= */

const statsReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 500+ aur 24/7: 0 se count hota hai, ruk ke dobara shuru
document.querySelectorAll(".count").forEach((el, index) => {
  const target = Number(el.dataset.target);
  const duration = 2200;   // count hone ka time
  const pause = 2800;      // poora hone ke baad ruk ke

  if (statsReduceMotion) {
    el.textContent = target;
    return;
  }

  function run() {
    const startTime = performance.now();

    function frame(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(target * eased);

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setTimeout(run, pause);
      }
    }

    requestAnimationFrame(frame);
  }

  setTimeout(run, index * 150);
});


// "Local": type hota hai, ruk ke delete hota hai, loop
const typedEl = document.querySelector(".typed");

if (typedEl && !statsReduceMotion) {
  const word = typedEl.dataset.text;
  let i = 0;
  let deleting = false;

  function tick() {
    typedEl.textContent = word.slice(0, i);

    if (!deleting) {
      if (i < word.length) {
        i++;
        setTimeout(tick, 170);
      } else {
        deleting = true;
        setTimeout(tick, 2400);
      }
    } else {
      if (i > 0) {
        i--;
        setTimeout(tick, 90);
      } else {
        deleting = false;
        setTimeout(tick, 500);
      }
    }
  }

  tick();
}