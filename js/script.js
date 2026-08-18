(() => {
  "use strict";

  /* ---------- Mobile nav ---------- */
  const hamburger = document.getElementById("hamburger");
  const gnav = document.getElementById("gnav");

  if (hamburger && gnav) {
    hamburger.addEventListener("click", () => {
      const isOpen = gnav.classList.toggle("is-open");
      hamburger.setAttribute("aria-expanded", String(isOpen));
      hamburger.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    });

    gnav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        gnav.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "メニューを開く");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    ".service-card, .strength-card, .voice-card, .about-grid, .access-grid"
  );
  if ("IntersectionObserver" in window && revealTargets.length) {
    revealTargets.forEach((el) => el.classList.add("reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach((el) => io.observe(el));
  }

  /* ---------- Hero stat counters ---------- */
  const counters = document.querySelectorAll(".hero-stats .num[data-count]");
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((el) => io.observe(el));
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ---------- Header shadow on scroll ---------- */
  const header = document.getElementById("header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
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
