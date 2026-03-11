  // Theme handling with persistence and system preference
      (function () {
        const key = "theme";
        const root = document.documentElement;
        const btn = document.getElementById("themeToggle");
        const stored = localStorage.getItem(key);
        const prefersDark =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (stored) root.dataset.theme = stored;
        else root.dataset.theme = prefersDark ? "dark" : "light";
        const apply = () => {
          const theme = root.dataset.theme;
          document
            .querySelector('meta[name="color-scheme"]')
            ?.setAttribute(
              "content",
              theme === "dark" ? "dark light" : "light dark",
            );
          btn.setAttribute("aria-pressed", theme === "dark");
        };
        apply();
        btn.addEventListener("click", () => {
          root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
          localStorage.setItem(key, root.dataset.theme);
          apply();
        });
      })();

      // Mobile menu
      const hamburger = document.getElementById("hamburger");
      const menu = document.getElementById("menu");
      hamburger.addEventListener("click", () => {
        const open = menu.classList.toggle("open");
        hamburger.setAttribute("aria-expanded", open ? "true" : "false");
      });

      // Active link highlighting on scroll
      const links = [...menu.querySelectorAll("a")];
      const sections = links
        .map((a) => document.querySelector(a.getAttribute("href")))
        .filter(Boolean);
      const onScroll = () => {
        const pos = window.scrollY + 140;
        let current = null;
        for (const sec of sections) {
          if (sec.offsetTop <= pos) current = sec.id;
        }
        links.forEach((a) =>
          a.classList.toggle(
            "active",
            a.getAttribute("href") === "#" + current,
          ),
        );
      };
      document.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("load", onScroll);

      // Close mobile menu on nav click
      menu.addEventListener("click", (e) => {
        if (e.target.tagName === "A" && menu.classList.contains("open")) {
          menu.classList.remove("open");
          hamburger.setAttribute("aria-expanded", "false");
        }
      });

      // Experience toggle
      const expBtn = document.getElementById("expInfoBtn");
      const expInfo = document.getElementById("expInfo");
      expBtn.addEventListener("click", () => {
        const hidden = expInfo.hasAttribute("hidden");
        expInfo.toggleAttribute("hidden");
        expBtn.textContent = hidden ? "Hide Details" : "Details";
        expBtn.setAttribute("aria-expanded", hidden ? "true" : "false");
      });

      // Scroll reveal
      const revealer = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              revealer.unobserve(e.target);
            }
          }
        },
        { threshold: 0.15 },
      );
      document
        .querySelectorAll("[data-reveal]")
        .forEach((el) => revealer.observe(el));

      // Smooth form handler (no backend) + validation
      const form = document.getElementById("contactForm");
      const status = document.getElementById("formStatus");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!form.reportValidity()) return;
        const data = Object.fromEntries(new FormData(form));
        status.textContent = "Sending...";
        setTimeout(() => {
          status.textContent =
            "Thanks, " + data.name + "! Your message has been received.";
          form.reset();
        }, 700);
      });

      // Input focus ring color change
      const inputs = document.querySelectorAll(
        "#contactForm input, #contactForm textarea",
      );
      inputs.forEach((i) => {
        i.addEventListener(
          "focus",
          () =>
            (i.style.borderColor =
              "color-mix(in oklab, var(--brand) 50%, var(--border))"),
        );
        i.addEventListener(
          "blur",
          () => (i.style.borderColor = "var(--border)"),
        );
      });

      // Footer year
      document.getElementById("year").textContent = new Date().getFullYear();