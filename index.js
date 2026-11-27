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
/* Right click & inspect protection (punch popup) */
(() => {
  const msg = "Oops! This road is closed. Enjoy the ride on our website instead. 🚕";

  const css = document.createElement("style");
  css.textContent = `
    .punch-pop{position:fixed;inset:0;z-index:2000;display:grid;place-items:center;background:rgba(0,0,0,.55);backdrop-filter:blur(3px);opacity:0;visibility:hidden;transition:opacity .2s,visibility .2s}
    .punch-pop.show{opacity:1;visibility:visible}
    .punch-box{position:relative;text-align:center;padding:30px 36px 28px;width:min(92vw,420px);border-radius:28px;background:#0f0f10;color:#fff;border:2px solid #ffc400;box-shadow:0 30px 80px rgba(0,0,0,.5);font-family:Manrope,sans-serif}
    .punch-pop.show .punch-box{animation:boxHit .5s .25s both}
    .punch-fist{display:block;font-size:84px;line-height:1;opacity:0}
    .punch-pop.show .punch-fist{animation:fist .45s cubic-bezier(.2,1.2,.4,1) forwards}
    .punch-ring{position:absolute;left:50%;top:62px;width:30px;height:30px;margin:-15px 0 0 -15px;border:4px solid #ffc400;border-radius:50%;opacity:0}
    .punch-pop.show .punch-ring{animation:ring .55s .22s ease-out forwards}
    .punch-title{display:block;margin:6px 0 8px;font:800 22px Sora,sans-serif;color:#ffc400;letter-spacing:-.02em}
    .punch-text{font-size:15px;font-weight:600;line-height:1.6;color:rgba(255,255,255,.88)}
    .page-shake{animation:pageShake .5s .25s}
    @keyframes fist{0%{transform:translateX(-260px) rotate(-25deg) scale(.5);opacity:0}60%{transform:translateX(14px) rotate(0) scale(1.5);opacity:1}100%{transform:translateX(0) rotate(0) scale(1.15);opacity:1}}
    @keyframes ring{0%{transform:scale(1);opacity:.9}100%{transform:scale(7);opacity:0}}
    @keyframes boxHit{0%,100%{transform:translate(0)}20%{transform:translate(-9px,4px) rotate(-1.5deg)}40%{transform:translate(9px,-4px) rotate(1.5deg)}60%{transform:translate(-5px,2px)}80%{transform:translate(4px,-2px)}}
    @keyframes pageShake{0%,100%{transform:translate(0)}20%{transform:translate(-6px,3px)}40%{transform:translate(6px,-3px)}60%{transform:translate(-3px,2px)}80%{transform:translate(3px,-1px)}}
  `;
  document.head.appendChild(css);

  const pop = document.createElement("div");
  pop.className = "punch-pop";
  pop.setAttribute("role", "alert");
  pop.innerHTML =
    '<div class="punch-box"><span class="punch-ring"></span>' +
    '<span class="punch-fist">👊</span>' +
    '<strong class="punch-title">Not allowed!</strong>' +
    '<p class="punch-text"></p></div>';
  pop.querySelector(".punch-text").textContent = msg;
  document.body.appendChild(pop);

  const main = document.querySelector("main");
  let timer;
  const hide = () => pop.classList.remove("show");
  const warn = () => {
    pop.classList.remove("show");
    void pop.offsetWidth; // animation dobara chalane ke liye
    pop.classList.add("show");
    if (main) {
      main.classList.remove("page-shake");
      void main.offsetWidth;
      main.classList.add("page-shake");
    }
    clearTimeout(timer);
    timer = setTimeout(hide, 2600);
  };
  pop.addEventListener("click", hide);

  // Right click band
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    warn();
  });

  // F12, Ctrl+Shift+I/J/C, Ctrl+U (Mac: Cmd+Option+I/J/C/U)
  document.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    const blocked =
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(k)) ||
      (e.ctrlKey && k === "u") ||
      (e.metaKey && e.altKey && ["i", "j", "c", "u"].includes(k));
    if (blocked) {
      e.preventDefault();
      warn();
    }
  });
})();
