const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const header = $(".site-header"), menuToggle = $(".menu-toggle"), nav = $(".primary-navigation");
const navLinks = $$("a", nav);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

/* Mobile menu */
const setMenu = (o) => {
  menuToggle.classList.toggle("active", o);
  nav.classList.toggle("active", o);
  menuToggle.setAttribute("aria-expanded", String(o));
};
menuToggle.addEventListener("click", () => setMenu(!nav.classList.contains("active")));
navLinks.forEach((l) => l.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

/* Scroll progress + sticky header */
const bar = document.createElement("div");
bar.className = "scroll-progress";
document.body.prepend(bar);
const onScroll = () => {
  header.classList.toggle("scrolled", scrollY > 20);
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* Scroll spy */
const spy = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean).forEach((s) => spy.observe(s));

/* FAQ */
const faqs = $$(".faq-box");
faqs.forEach((box) => {
  const q = $(".faq-question", box);
  q.addEventListener("click", () => {
    const open = !box.classList.contains("active");
    faqs.forEach((b) => { b.classList.remove("active"); $(".faq-question", b).setAttribute("aria-expanded", "false"); });
    if (open) { box.classList.add("active"); q.setAttribute("aria-expanded", "true"); }
  });
});

/* Scroll reveal */
if (!reduce && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((es, o) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("visible"); o.unobserve(e.target); }
  }), { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  [".section-heading > *", ".service-card", ".destination-card", ".cta-content > *", ".faq-box", ".footer-column"].forEach((sel) =>
    $$(sel).forEach((el, i) => { el.classList.add("reveal"); el.style.setProperty("--d", `${(i % 4) * 90}ms`); io.observe(el); }));
}

/* Counters (run once when visible) */
$$(".count").forEach((el) => {
  const target = +el.dataset.target;
  if (reduce) return (el.textContent = target);
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    io.disconnect();
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min((now - t0) / 2200, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
  io.observe(el);
});

/* Typewriter loop */
const typed = $(".typed");
if (typed && !reduce) {
  const word = typed.dataset.text; let i = 0, del = false;
  (function tick() {
    typed.textContent = word.slice(0, i);
    if (!del) { if (i < word.length) { i++; setTimeout(tick, 170); } else { del = true; setTimeout(tick, 2400); } }
    else if (i > 0) { i--; setTimeout(tick, 90); } else { del = false; setTimeout(tick, 500); }
  })();
}

if (fine && !reduce) {
  /* Spotlight cards */
  $$(".card").forEach((c) => c.addEventListener("mousemove", (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", e.clientX - r.left + "px");
    c.style.setProperty("--my", e.clientY - r.top + "px");
  }));

  /* 3D tilt on destination cards */
  $$(".tilt").forEach((c) => {
    c.addEventListener("mousemove", (e) => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      c.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-8px)`;
    });
    c.addEventListener("mouseleave", () => (c.style.transform = ""));
  });

  /* Magnetic buttons */
  $$(".magnetic").forEach((b) => {
    b.addEventListener("mousemove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    b.addEventListener("mouseleave", () => (b.style.transform = ""));
  });
}
