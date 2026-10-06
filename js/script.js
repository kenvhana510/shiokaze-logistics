(() => {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  if (reduceMotion) root.classList.add("motion-off");
  if (!hasGsap) root.classList.add("no-gsap");
  const motionOn = hasGsap && !reduceMotion;

  /* ---------- Mobile nav ---------- */
  const hamburger = document.getElementById("hamburger");
  const gnav = document.getElementById("gnav");
  const header = document.getElementById("header");

  const setMenu = (open) => {
    gnav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
    document.body.classList.toggle("nav-locked", open);
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
  };
  if (hamburger && gnav) {
    hamburger.addEventListener("click", () => setMenu(!gnav.classList.contains("is-open")));
    gnav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
    window.addEventListener("keydown", (e) => { if (e.key === "Escape" && gnav.classList.contains("is-open")) setMenu(false); });
  }

  /* ---------- Header: shrink + hero-aware color ---------- */
  const hero = document.querySelector(".hero");
  if (header) {
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 24);
      if (hero) header.classList.toggle("on-hero", y < hero.offsetHeight - 120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Hero stat counters ---------- */
  const counters = document.querySelectorAll(".hero-stats .num[data-count]");
  const animateCount = (el, delay = 0) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (reduceMotion) { el.textContent = String(target); return; }
    el.textContent = "0";
    const duration = 1500;
    let start = null;
    const step = (now) => {
      if (start === null) start = now + delay;
      const progress = Math.min(Math.max((now - start) / duration, 0), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ---------- Magnetic buttons ---------- */
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (motionOn && finePointer) {
    document.querySelectorAll("[data-magnetic]").forEach((btn) => {
      const strength = 0.28;
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        gsap.to(btn, { x: x * strength, y: y * strength, duration: 0.4, ease: "power2.out" });
      });
      btn.addEventListener("pointerleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      });
    });
  }

  /* ---------- Tilt cards (strength) ---------- */
  if (motionOn && finePointer) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, { rotationY: px * 10, rotationX: -py * 10, scale: 1.02, transformPerspective: 900, duration: 0.5, ease: "power2.out" });
      });
      card.addEventListener("pointerleave", () => {
        gsap.to(card, { rotationY: 0, rotationX: 0, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" });
      });
    });
  }

  /* ---------- Route map (signature): draw line + truck follows path ---------- */
  const routeLine = document.getElementById("routeLine");
  const routeTruck = document.getElementById("routeTruck");
  const routeNodes = Array.from(document.querySelectorAll(".route-node"));
  const serviceCards = Array.from(document.querySelectorAll(".service-card[data-step]"));
  let routeTotal = 0;
  let nodeFractions = [0, 0.5, 1];

  if (routeLine && routeTruck) {
    routeTotal = routeLine.getTotalLength();
    routeLine.style.strokeDasharray = String(routeTotal);
    routeLine.style.strokeDashoffset = String(routeTotal);

    // Find the fraction of path length closest to each node's coordinates.
    nodeFractions = routeNodes.map((node) => {
      const m = /translate\(([-\d.]+)[ ,]+([-\d.]+)\)/.exec(node.getAttribute("transform") || "");
      if (!m) return 0;
      const nx = parseFloat(m[1]), ny = parseFloat(m[2]);
      let best = 0, bestD = Infinity;
      for (let i = 0; i <= 240; i++) {
        const p = routeLine.getPointAtLength((i / 240) * routeTotal);
        const d = (p.x - nx) ** 2 + (p.y - ny) ** 2;
        if (d < bestD) { bestD = d; best = i / 240; }
      }
      return best;
    });
  }

  const setRouteProgress = (progress) => {
    if (!routeLine || !routeTruck) return;
    const p = Math.min(Math.max(progress, 0), 1);
    const len = routeTotal * p;
    routeLine.style.strokeDashoffset = String(routeTotal - len);
    const pt = routeLine.getPointAtLength(len);
    const ahead = routeLine.getPointAtLength(Math.min(len + 1, routeTotal));
    const angle = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;
    const flip = Math.abs(angle) > 90 ? -1 : 1;
    routeTruck.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) scale(${flip} 1)`);
    routeTruck.classList.toggle("is-on", p > 0.01);
    let active = 0;
    nodeFractions.forEach((f, i) => { if (p >= f - 0.02) active = i; });
    routeNodes.forEach((n, i) => n.classList.toggle("is-active", i <= active && p > 0.01));
    serviceCards.forEach((c, i) => c.classList.toggle("is-active", i === active && p > 0.01));
  };

  /* ---------- No motion / no GSAP: static final states ---------- */
  if (!motionOn) {
    counters.forEach((el) => { el.textContent = el.dataset.count; });
    setRouteProgress(1);
    document.querySelectorAll(".rv").forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- GSAP scene ---------- */
  if (motionOn) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero intro
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTl
      .from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.8 }, 0.1)
      .to(".hero-title .line-in", { y: 0, duration: 1.1, stagger: 0.16, ease: "power4.out" }, 0.25)
      .from(".hero-lead", { y: 24, opacity: 0, duration: 0.9 }, 0.7)
      .from(".hero-actions .btn", { y: 20, opacity: 0, duration: 0.7, stagger: 0.1, clearProps: "transform" }, 0.9)
      .from(".hero-stats", { y: 30, opacity: 0, duration: 0.9 }, 1.05)
      .from(".hero-note", { opacity: 0, duration: 0.6 }, 1.3)
      .from(".scroll-cue", { opacity: 0, duration: 0.6 }, 1.4);
    heroTl.add(() => counters.forEach((el, i) => animateCount(el, i * 120)), 1.15);

    // Generic reveals (stagger inside grids, single elsewhere)
    const groups = [
      ".about-collage .rv", ".about-lead > p.rv", ".route-steps .rv",
      ".strength-grid .rv", ".voice-grid .rv"
    ];
    const grouped = new Set();
    groups.forEach((sel) => {
      const els = gsap.utils.toArray(sel);
      if (!els.length) return;
      els.forEach((el) => grouped.add(el));
      ScrollTrigger.batch(els, {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out", overwrite: true,
            onComplete: () => batch.forEach((el) => el.classList.add("is-in")) });
          batch.forEach((el) => el.classList.add("is-in"));
        }
      });
      gsap.set(els, { y: 36 });
    });
    gsap.utils.toArray(".rv").forEach((el) => {
      if (grouped.has(el)) return;
      gsap.set(el, { y: 28 });
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true, onEnter: () => el.classList.add("is-in") }
      });
    });

    // Parallax images (subtle, ±40px)
    gsap.utils.toArray("[data-parallax]").forEach((el) => {
      const amount = parseFloat(el.dataset.parallax) || 30;
      gsap.fromTo(el, { y: -amount }, {
        y: amount, ease: "none",
        scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: 0.6 }
      });
    });

    // Route draw tied to the service steps scroll
    const routeSteps = document.querySelector(".route-steps");
    if (routeSteps && routeLine) {
      const proxy = { p: 0 };
      ScrollTrigger.create({
        trigger: routeSteps,
        start: "top 70%",
        end: "bottom 60%",
        scrub: 0.8,
        onUpdate: (self) => {
          const target = Math.max(proxy.max || 0, self.progress);
          proxy.max = target;
          gsap.to(proxy, { p: target, duration: 0.3, ease: "none", overwrite: true, onUpdate: () => setRouteProgress(proxy.p) });
        }
      });
    }

    // Header position refresh after fonts/images load
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }

  /* ---------- Contact form (demo validation, no real submit) ---------- */
  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("formSuccess");

  const validators = {
    name: (v) => v.trim().length > 0,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    message: (v) => v.trim().length > 0,
  };
  const errorMessages = {
    name: "お名前を入力してください。",
    email: "正しいメールアドレスを入力してください。",
    message: "お問い合わせ内容を入力してください。",
  };

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      Object.keys(validators).forEach((field) => {
        const input = form.elements[field];
        const row = input.closest(".form-row");
        const errorEl = form.querySelector(`.form-error[data-for="${field}"]`);
        const ok = validators[field](input.value);

        if (!ok) {
          valid = false;
          row.classList.add("has-error");
          if (errorEl) errorEl.textContent = errorMessages[field];
        } else {
          row.classList.remove("has-error");
          if (errorEl) errorEl.textContent = "";
        }
      });

      if (valid && successMsg) {
        successMsg.hidden = false;
        form.reset();
        successMsg.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else if (successMsg) {
        successMsg.hidden = true;
      }
    });
  }
})();
