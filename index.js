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

/* =========================================================
   GSAP: hero intro + scroll motion
   (GSAP load na ho ya reduced-motion ho to sab normal dikhega)
   ========================================================= */
(() => {
  const root = document.documentElement;
  if (!window.gsap || reduce) { root.classList.remove("gsap-on"); return; }

  const hasST = !!window.ScrollTrigger;
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  const hero = $(".hero"), h1 = $(".hero h1"), glow = $(".hero-glow"), spinSvg = $(".hero-spin svg");

  /* headline ko words me todo (har word ek mask ke andar) */
  const splitWords = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(" ")); return; }
          const mask = document.createElement("span"); mask.className = "sw";
          const inner = document.createElement("span"); inner.className = "sw-i";
          inner.textContent = p; mask.appendChild(inner); frag.appendChild(mask);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) splitWords(n);
    });
  };
  splitWords(h1);
  const words = $$(".sw-i", h1);

  gsap.set(h1, { autoAlpha: 1 });
  gsap.set(".hc-list li", { autoAlpha: 0 });

  /* ---------- Page load intro ---------- */
  const intro = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete() {
      gsap.set([".header-call", ".hero-buttons > *", ".hc-call"], { clearProps: "transform" });
      root.classList.remove("gsap-on");
    }
  });

  intro
    .fromTo(".hero-bg", { scale: 1.3 }, { scale: 1.08, duration: 2.8, ease: "expo.out" }, 0)
    .fromTo([".site-header .logo", ".primary-navigation li", ".header-call", ".menu-toggle"],
      { autoAlpha: 0, y: -28 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.07 }, 0.1)
    .fromTo(".hero-badge", { autoAlpha: 0, y: 24, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8 }, 0.3)
    .fromTo(words, { yPercent: 118, skewY: 6 }, { yPercent: 0, skewY: 0, duration: 1.15, stagger: 0.07, ease: "power4.out" }, 0.4)
    .fromTo(".hero-description", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.85)
    .fromTo(".hero-buttons > *", { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 }, 1)
    .fromTo(".hero-stats", { autoAlpha: 0, y: 40, scale: 0.95 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9 }, 1.15)
    .fromTo(".trust-badges", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 1.3)
    .fromTo(".hero-side", { autoAlpha: 0, x: 90, scale: 0.92 }, { autoAlpha: 1, x: 0, scale: 1, duration: 1.2, ease: "expo.out" }, 0.7)
    .fromTo(".hc-list li", { autoAlpha: 0, x: 36 }, { autoAlpha: 1, x: 0, duration: 0.7, stagger: 0.1 }, 1.1)
    .fromTo(".hero-spin", { scale: 0, rotation: -120 }, { scale: 1, rotation: 0, duration: 1, ease: "back.out(1.6)" }, 1.3);

  /* safety: kuch atak jaye to 5 sec baad final state par le aao */
  setTimeout(() => { if (intro.progress() < 1) intro.progress(1); }, 5000);

  /* ---------- Loop animations ---------- */
  gsap.to(".hero-card", { y: -10, duration: 3.2, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2 });
  const spin = gsap.to(spinSvg, { rotation: 360, duration: 16, repeat: -1, ease: "none" });

  /* ---------- Mouse glow (sirf mouse wale device par) ---------- */
  if (fine) {
    gsap.set(glow, { x: hero.offsetWidth * 0.7, y: hero.offsetHeight * 0.4 });
    const gx = gsap.quickTo(glow, "x", { duration: 0.8, ease: "power3" });
    const gy = gsap.quickTo(glow, "y", { duration: 0.8, ease: "power3" });
    hero.addEventListener("mouseenter", () => gsap.to(glow, { opacity: 1, duration: 0.6 }));
    hero.addEventListener("mouseleave", () => gsap.to(glow, { opacity: 0, duration: 0.6 }));
    hero.addEventListener("mousemove", (e) => {
      const r = hero.getBoundingClientRect();
      gx(e.clientX - r.left); gy(e.clientY - r.top);
    });
  }

  /* ---------- Scroll motion ---------- */
  if (hasST) {
    /* hero background parallax */
    gsap.to(".hero-bg", {
      y: () => hero.offsetHeight * 0.18, ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true }
    });
    /* hero content halka upar jaakar fade */
    gsap.to(".hero-content", {
      y: -70, opacity: 0.15, ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom 20%", scrub: true }
    });
    gsap.to(".hero-side", {
      y: -40, ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true }
    });

    /* scroll speed ke hisaab se marquee skew + badge ki speed */
    const marqueeItems = gsap.utils.toArray(".marquee span");
    const setSkew = gsap.quickSetter(marqueeItems, "skewX", "deg");
    const vel = { v: 0 };
    ScrollTrigger.create({
      onUpdate(self) {
        const target = gsap.utils.clamp(-10, 10, self.getVelocity() / -200);
        if (Math.abs(target) > Math.abs(vel.v)) {
          vel.v = target;
          gsap.to(vel, {
            v: 0, duration: 0.9, ease: "power3.out", overwrite: true,
            onUpdate() { setSkew(vel.v); spin.timeScale(1 + Math.abs(vel.v) * 1.2); }
          });
        }
      }
    });

    /* CTA section parallax */
    gsap.fromTo(".cta-content", { y: 60 }, {
      y: -30, ease: "none",
      scrollTrigger: { trigger: ".cta-section", start: "top bottom", end: "bottom top", scrub: true }
    });
  }
})();

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
/* =========================================================
   HERO CAR SLIDER
   ========================================================= */
(() => {
  const slider = document.querySelector(".car-slider");
  if (!slider) return;

  const stage = slider.querySelector(".car-stage");
  const slides = [...slider.querySelectorAll(".car-slide")];
  const nameEl = slider.querySelector(".car-name");
  const dotsBox = slider.querySelector(".car-dots");
  const prevBtn = slider.querySelector(".car-prev");
  const nextBtn = slider.querySelector(".car-next");
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = 0;

  /* image na mile to file ka naam wala box dikhao */
  slides.forEach((slide) => {
    const img = slide.querySelector("img");
    const fail = () => {
      slide.dataset.file = "Car image: " + img.getAttribute("src");
      slide.classList.add("no-img");
    };
    img.addEventListener("error", fail);
    if (img.complete && !img.naturalWidth && img.loading !== "lazy") fail();
  });

  /* dots apne aap slides ke hisaab se bante hain */
  const dots = slides.map((slide, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "car-dot";
    dot.setAttribute("aria-label", "Show " + slide.dataset.name);
    dot.addEventListener("click", () => show(i));
    dotsBox.appendChild(dot);
    return dot;
  });

  function show(index) {
    const next = (index + slides.length) % slides.length;
    slides.forEach((s, i) => {
      s.classList.toggle("is-prev", i === current && i !== next);
      s.classList.toggle("is-active", i === next);
    });
    dots.forEach((d, i) => d.classList.toggle("is-active", i === next));
    current = next;
    nameEl.textContent = slides[current].dataset.name;
  }

  prevBtn.addEventListener("click", () => show(current - 1));
  nextBtn.addEventListener("click", () => show(current + 1));

  /* autoplay: dot ki progress bhar jaye to agli car */
  if (!calm && slides.length > 1) {
    slider.classList.add("auto");
    dotsBox.addEventListener("animationend", () => show(current + 1));
  }

  /* mouse upar ho ya tab chhupa ho to ruk jaye */
  let hover = false;
  const sync = () => slider.classList.toggle("paused", hover || document.hidden);
  slider.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hover = true; sync(); } });
  slider.addEventListener("pointerleave", () => { hover = false; sync(); });
  document.addEventListener("visibilitychange", sync);

  /* swipe / drag */
  let startX = null;
  stage.addEventListener("pointerdown", (e) => { startX = e.clientX; stage.setPointerCapture(e.pointerId); });
  stage.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const move = e.clientX - startX;
    if (Math.abs(move) > 45) show(current + (move < 0 ? 1 : -1));
    startX = null;
  });
  stage.addEventListener("pointercancel", () => (startX = null));

  /* keyboard arrows */
  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  /* ek hi car ho to controls ki zaroorat nahi */
  if (slides.length < 2) { prevBtn.hidden = nextBtn.hidden = dotsBox.hidden = true; }

  show(0);
})();
