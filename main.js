(function () {
  "use strict";

  const root = document.documentElement;
  const reducedMotion = root.classList.contains("reduce-motion");
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");

  function updateNav() {
    if (!nav) return;
    const hero = document.querySelector(".hero");
    const threshold = hero
      ? hero.getBoundingClientRect().height
      : window.innerHeight;
    nav.classList.toggle("is-solid", window.scrollY > threshold);
  }

  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  function closeMenu() {
    document.body.classList.remove("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
    }
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      const open = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    document.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
  }

  const timeEl = document.querySelector("[data-local-time]");
  if (timeEl) {
    function updateTime() {
      try {
        timeEl.textContent = new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Shanghai"
        }).format(new Date());
      } catch (error) {
        timeEl.textContent = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        });
      }
    }
    updateTime();
    window.setInterval(updateTime, 30000);
  }

  const hero = document.querySelector(".hero");
  const video = document.querySelector("[data-hero-video]");
  if (hero && video) {
    function videoReady() {
      hero.classList.add("is-video-ready");
    }
    if (video.readyState >= 3) {
      videoReady();
    } else {
      video.addEventListener("loadeddata", videoReady, { once: true });
      video.addEventListener("canplay", videoReady, { once: true });
    }
    video.play().catch(function () {});
  }

  if (reducedMotion) return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (!gsap || !ScrollTrigger) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      observer.observe(el);
    });
    document.querySelectorAll("[data-stagger]").forEach(function (el) {
      observer.observe(el);
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({
      duration: 0.9,
      smoothWheel: true
    });

    lenis.on("scroll", ScrollTrigger.update);
    lenis.on("scroll", updateNav);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        const hash = link.getAttribute("href");
        if (hash.length < 2) return;
        const target = document.querySelector(hash);
        if (!target) return;
        event.preventDefault();
        lenis.scrollTo(target, { offset: -72 });
      });
    });
  }

  const heroReveals = gsap.utils.toArray(".hero [data-reveal]");
  if (heroReveals.length) {
    gsap.timeline({ delay: 0.2 }).fromTo(
      heroReveals,
      { autoAlpha: 0, y: 34 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      }
    );
  }

  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    if (el.closest(".hero")) return;
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true
        }
      }
    );
  });

  gsap.utils.toArray("[data-stagger]").forEach(function (group) {
    gsap.fromTo(
      group.children,
      { autoAlpha: 0, x: -24 },
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: group,
          start: "top 85%",
          once: true
        }
      }
    );
  });

  gsap.utils.toArray("[data-parallax]").forEach(function (el) {
    const trigger = el.closest(".project-visual") || el.parentElement;
    gsap.fromTo(
      el,
      { yPercent: 0 },
      {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: trigger,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );
  });

  if (lenis) ScrollTrigger.refresh();
})();
