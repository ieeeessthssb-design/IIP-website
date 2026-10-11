// IEEE ESSTHS IAS Chapter Website - Main JavaScript

// ============================================================
// PARTICLE SYSTEM (Industrial Motor Network)
// ============================================================

class IndustrialParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.particles = [];
    this.connectionDistance = 120;
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseActive = false;
    this.pulses = [];

    this.resize();
    this.init();
    this.bindEvents();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  init() {
    this.particles = [];
    const particleCount = this.width < 768 ? 32 : Math.min(this.width / 15, 120);

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1,
        energy: Math.random() * 100,
        baseEnergy: Math.random() * 100,
      });
    }
  }

  bindEvents() {
    document.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY - this.canvas.getBoundingClientRect().top;
      this.mouseActive = true;
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.mouseActive = false;
    });

    window.addEventListener("resize", () => {
      this.resize();
      this.init();
    });
  }

  update() {
    // Update particle motion
    this.particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      // Boundary wrapping
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Mouse interaction
      if (this.mouseActive) {
        const dx = this.mouseX - p.x;
        const dy = this.mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = 80;

        if (distance < influence) {
          const force = (influence - distance) / influence;
          p.vx -= (dx / distance) * force * 1.5;
          p.vy -= (dy / distance) * force * 1.5;
          p.energy = Math.min(p.energy + 15, 100);
        }
      }

      // Energy decay
      p.energy = Math.max(p.energy - 0.5, p.baseEnergy);

      // Damping
      p.vx *= 0.98;
      p.vy *= 0.98;
    });

    // Create pulses randomly
    if (Math.random() < 0.002) {
      const p1 = this.particles[Math.floor(Math.random() * this.particles.length)];
      const p2 = this.particles[Math.floor(Math.random() * this.particles.length)];
      if (p1 !== p2) {
        this.pulses.push({
          x1: p1.x,
          y1: p1.y,
          x2: p2.x,
          y2: p2.y,
          progress: 0,
          duration: 0.08,
        });
      }
    }

    // Update pulses
    this.pulses = this.pulses.filter((pulse) => {
      pulse.progress += pulse.duration;
      return pulse.progress < 1;
    });
  }

  draw() {
    this.ctx.fillStyle = "rgba(5, 8, 6, 0.2)";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw connections
    this.ctx.strokeStyle = "rgba(57, 255, 136, 0.15)";
    this.ctx.lineWidth = 0.8;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectionDistance) {
          const opacity = (1 - distance / this.connectionDistance) * 0.3;
          this.ctx.strokeStyle = `rgba(57, 255, 136, ${opacity})`;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }

    // Draw pulses
    this.pulses.forEach((pulse) => {
      const x = pulse.x1 + (pulse.x2 - pulse.x1) * pulse.progress;
      const y = pulse.y1 + (pulse.y2 - pulse.y1) * pulse.progress;
      const opacity = 1 - pulse.progress;
      const size = 3 * (1 - pulse.progress * 0.5);

      this.ctx.fillStyle = `rgba(57, 255, 136, ${opacity * 0.8})`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Draw particles with glow
    this.particles.forEach((p) => {
      const opacity = 0.3 + (p.energy / 100) * 0.7;

      // Glow
      const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 8);
      gradient.addColorStop(0, `rgba(57, 255, 136, ${opacity * 0.4})`);
      gradient.addColorStop(1, `rgba(57, 255, 136, 0)`);
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius * 8, 0, Math.PI * 2);
      this.ctx.fill();

      // Core
      this.ctx.fillStyle = `rgba(57, 255, 136, ${opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// ============================================================
// HEADER & NAVIGATION
// ============================================================

function initHeader() {
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  if (!header) return;

  // Scroll state
  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  });

  // Mobile menu
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.classList.toggle("is-open");
      mobileNav.classList.toggle("is-open");
    });

    // Close menu on link click
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.classList.remove("is-open");
        mobileNav.classList.remove("is-open");
      });
    });
  }
}

// ============================================================
// SCROLL ANIMATIONS
// ============================================================

function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".reveal-up, .reveal-scale").forEach((el) => {
    observer.observe(el);
  });
}

// ============================================================
// SCROLL PROGRESS
// ============================================================

function initScrollProgress() {
  const progress = document.querySelector(".scroll-progress");
  if (!progress) return;

  window.addEventListener("scroll", () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY / scrollHeight;
    progress.style.transform = `scaleX(${scrolled})`;
  });
}

// ============================================================
// TEXT SCRAMBLE EFFECT
// ============================================================

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.resolve = () => {};
    this.reject = () => {};
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => {
      this.resolve = resolve;
    });

    let progress = 0;
    const update = () => {
      let output = "";
      for (let i = 0; i < length; i++) {
        let char = "";
        if (i < progress) {
          char = newText[i] || "";
        } else {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        output += char;
      }
      this.el.innerText = output;

      if (progress < length) {
        progress += Math.random() > 0.28 ? 1 : 0;
        setTimeout(update, 30);
      } else {
        this.resolve();
      }
    };

    update();
    return promise;
  }
}

function initTextScramble() {
  document.querySelectorAll("[data-scramble]").forEach((el) => {
    const text = el.getAttribute("data-scramble");
    const scrambler = new TextScramble(el);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            scrambler.setText(text);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
  });
}

// ============================================================
// EVENT RENDERING
// ============================================================

function renderEvents() {
  const manifest = document.querySelector("#events-manifest");
  if (!manifest) return;

  const events = JSON.parse(manifest.innerText);
  const upcomingTrack = document.querySelector('[data-event-track="upcoming"]');
  const pastTrack = document.querySelector('[data-event-track="past"]');

  if (upcomingTrack) {
    const upcoming = events.filter((e) => e.status === "upcoming");
    upcomingTrack.innerHTML = upcoming
      .map(
        (event) => `
      <article class="event-card">
        <img src="${event.src}" alt="${event.name}" />
        <div class="event-card-content">
          <span class="event-type">${event.type}</span>
          <h3 class="event-title">${event.name}</h3>
          <p class="event-meta">
            <strong>${event.date}</strong><br>
            ${event.location} • ${event.mode}
          </p>
        </div>
      </article>
    `
      )
      .join("");
  }

  if (pastTrack) {
    const past = events.filter((e) => e.status === "past");
    pastTrack.innerHTML = past
      .map(
        (event) => `
      <article class="event-card">
        <img src="${event.src}" alt="${event.name}" />
        <div class="event-card-content">
          <span class="event-type">${event.type}</span>
          <h3 class="event-title">${event.name}</h3>
          <p class="event-meta">
            <strong>${event.date}</strong><br>
            ${event.location} • ${event.mode}
          </p>
        </div>
      </article>
    `
      )
      .join("");
  }
}

// ============================================================
// EVENT FILTERING
// ============================================================

function initEventFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const eventTrack = document.querySelector('[data-event-track="upcoming"]');

  if (!filterBtns.length || !eventTrack) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active state
      filterBtns.forEach((b) => b.classList.remove("filter-btn--active"));
      btn.classList.add("filter-btn--active");

      // Filter events
      const filter = btn.getAttribute("data-filter");
      const cards = eventTrack.querySelectorAll(".event-card");

      cards.forEach((card) => {
        const type = card.querySelector(".event-type").innerText.toLowerCase();
        if (filter === "all" || type === filter) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// ============================================================
// CONTACT FORM
// ============================================================

function initContactForm() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector(".submit-btn");
    const originalText = submitBtn.innerText;

    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    const formData = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          submitBtn.innerText = "Message sent! ✓";
          form.reset();
          setTimeout(() => {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
          }, 3000);
        } else {
          submitBtn.innerText = "Error sending message";
          setTimeout(() => {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
          }, 3000);
        }
      })
      .catch(() => {
        submitBtn.innerText = "Error sending message";
        setTimeout(() => {
          submitBtn.innerText = originalText;
          submitBtn.disabled = false;
        }, 3000);
      });
  });
}

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // Particle system
  const canvas = document.querySelector("[data-particles]");
  if (canvas) {
    const particles = new IndustrialParticleSystem(canvas);
    particles.animate();
  }

  // Header & navigation
  initHeader();

  // Scroll effects
  initScrollAnimations();
  initScrollProgress();

  // Text effects
  initTextScramble();

  // Events
  renderEvents();
  initEventFilters();

  // Form
  initContactForm();
});
