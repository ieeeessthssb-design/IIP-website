const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+/<>=";

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const header = document.querySelector("[data-header]");
const progress = document.querySelector(".scroll-progress");

function updateScrollState() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;

  progress.style.transform = `scaleX(${clamp(ratio)})`;
  header.classList.toggle("is-scrolled", window.scrollY > 40);
}

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);
updateScrollState();

// Menu Toggle
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");

function setMenu(open) {
  menuToggle.classList.toggle("is-open", open);
  mobileNav.classList.toggle("is-open", open);
  header.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
}

menuToggle.addEventListener("click", () => {
  setMenu(!mobileNav.classList.contains("is-open"));
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.querySelector("[data-current-year]").textContent = new Date().getFullYear();

// Reveal Animations
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
);

document.querySelectorAll(".reveal-up, .reveal-scale").forEach((element) => {
  revealObserver.observe(element);
});

// Text Scramble
function scrambleElement(element) {
  const finalText = element.dataset.scramble;
  if (!finalText || element.dataset.scrambled === "true") return;

  element.dataset.scrambled = "true";

  if (reducedMotion) {
    element.textContent = finalText;
    return;
  }

  let frame = 0;
  const frames = Math.round(0.8 * 60);
  const chars = finalText.split("");

  const tick = () => {
    frame += 1;
    const progressRatio = frame / frames;
    const revealCount = Math.floor(progressRatio * chars.length);
    element.textContent = chars
      .map((char, index) => {
        if (char === " ") return " ";
        if (index < revealCount) return char;
        return alphabet[Math.floor(Math.random() * alphabet.length)];
      })
      .join("");

    if (frame < frames) {
      requestAnimationFrame(tick);
    } else {
      element.textContent = finalText;
    }
  };

  element.textContent = finalText.replace(/[^\s]/g, " ");
  window.setTimeout(() => requestAnimationFrame(tick), 180);
}

const scrambleObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        scrambleElement(entry.target);
        scrambleObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.35, rootMargin: "0px 0px -10% 0px" },
);

document.querySelectorAll("[data-scramble]").forEach((element) => {
  scrambleObserver.observe(element);
});

// ============================================================================
// ELECTRICAL ENERGY PARTICLE SYSTEM
// ============================================================================

function initParticles() {
  const canvas = document.querySelector("[data-particles]");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const pointer = { x: -10000, y: -10000, prevX: -10000, prevY: -10000, vx: 0, vy: 0, energy: 0 };
  let width = 0;
  let height = 0;
  let raf = 0;
  let dpr = window.devicePixelRatio || 1;
  let particles = [];
  let pulses = [];
  let connections = [];

  const makeParticles = () => {
    const count = reducedMotion ? 32 : Math.min(100, Math.ceil((width * height) / 25000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3 * dpr,
      vy: (Math.random() - 0.5) * 0.3 * dpr,
      r: (Math.random() * 1.2 + 0.8) * dpr,
      energy: Math.random() * 0.3,
      frequency: Math.random() * 0.005 + 0.001,
    }));

    // Generate connections for the network
    updateConnections();
  };

  const updateConnections = () => {
    connections = [];
    const linkDistance = 140 * dpr;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.hypot(dx, dy);

        if (distance < linkDistance) {
          connections.push({
            from: i,
            to: j,
            distance: distance,
            maxDistance: linkDistance,
          });
        }
      }
    }
  };

  const resize = () => {
    dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width * dpr);
    height = Math.max(1, rect.height * dpr);
    canvas.width = width;
    canvas.height = height;
    makeParticles();
  };

  const movePointer = (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.prevX = pointer.x;
    pointer.prevY = pointer.y;
    pointer.x = (event.clientX - rect.left) * dpr;
    pointer.y = (event.clientY - rect.top) * dpr;
    pointer.vx = pointer.x - pointer.prevX;
    pointer.vy = pointer.y - pointer.prevY;
    pointer.energy = Math.min(Math.hypot(pointer.vx, pointer.vy) / 40, 1);
  };

  const leavePointer = () => {
    pointer.x = -10000;
    pointer.y = -10000;
    pointer.prevX = -10000;
    pointer.prevY = -10000;
    pointer.vx = 0;
    pointer.vy = 0;
    pointer.energy = 0;
  };

  const createPulse = (fromIdx, toIdx) => {
    if (pulses.length > 20) return; // Limit pulses
    pulses.push({
      from: fromIdx,
      to: toIdx,
      progress: 0,
      duration: 0.4 + Math.random() * 0.3,
    });
  };

  const render = () => {
    context.clearRect(0, 0, width, height);

    const pointerDistance = 180 * dpr;
    const speed = Math.min(Math.hypot(pointer.vx, pointer.vy), 40 * dpr);

    // Draw electrical field glow around pointer
    if (pointer.x > -1000) {
      const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, pointerDistance);
      glow.addColorStop(0, `rgba(57, 255, 136, ${0.08 + pointer.energy * 0.12})`);
      glow.addColorStop(1, "rgba(57, 255, 136, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
    }

    // Update particles with energy dynamics
    particles.forEach((particle, idx) => {
      if (!reducedMotion) {
        // Apply base velocity
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Pulsing energy
        particle.energy += Math.sin(Date.now() * particle.frequency * 0.001) * 0.001;
        particle.energy = clamp(particle.energy, 0, 0.8);
      }

      // Bounce off walls
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      // Pointer interaction - electrical disturbance
      if (pointer.x > -1000) {
        const dx = pointer.x - particle.x;
        const dy = pointer.y - particle.y;
        const distance = Math.hypot(dx, dy);
        if (distance < pointerDistance && distance > 0) {
          particle.vx += (dx / distance) * 0.025 * (speed / 20);
          particle.vy += (dy / distance) * 0.025 * (speed / 20);
          particle.energy = Math.min(particle.energy + 0.02, 0.8);
        }
      }

      // Damping
      particle.vx *= 0.98;
      particle.vy *= 0.98;

      // Draw electrical node
      const nodeGlow = particle.energy + 0.3;
      const baseOpacity = 0.6 + particle.energy * 0.3;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      context.fillStyle = `rgba(57, 255, 136, ${baseOpacity})`;
      context.fill();

      // Glow around active nodes
      if (particle.energy > 0.2) {
        const nodeGlowGrad = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.r * 3,
        );
        nodeGlowGrad.addColorStop(0, `rgba(57, 255, 136, ${(particle.energy * 0.3) * 0.4})`);
        nodeGlowGrad.addColorStop(1, "rgba(57, 255, 136, 0)");
        context.fillStyle = nodeGlowGrad;
        context.fillRect(
          particle.x - particle.r * 3,
          particle.y - particle.r * 3,
          particle.r * 6,
          particle.r * 6,
        );
      }
    });

    // Draw connections (transmission lines)
    connections.forEach(({ from, to, distance, maxDistance }) => {
      const fromParticle = particles[from];
      const toParticle = particles[to];
      const alpha = (1 - distance / maxDistance) * (0.12 + Math.min(fromParticle.energy + toParticle.energy, 1) * 0.15);

      context.strokeStyle = `rgba(57, 255, 136, ${alpha})`;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(fromParticle.x, fromParticle.y);
      context.lineTo(toParticle.x, toParticle.y);
      context.stroke();
    });

    // Randomly generate new pulses
    if (!reducedMotion && Math.random() < 0.002 && connections.length > 0) {
      const conn = connections[Math.floor(Math.random() * connections.length)];
      createPulse(conn.from, conn.to);
    }

    // Update and render pulses (energy traveling through network)
    pulses = pulses.filter((pulse) => pulse.progress < 1);
    pulses.forEach((pulse) => {
      pulse.progress += 1 / (60 * pulse.duration);

      const fromParticle = particles[pulse.from];
      const toParticle = particles[pulse.to];

      const x = fromParticle.x + (toParticle.x - fromParticle.x) * pulse.progress;
      const y = fromParticle.y + (toParticle.y - fromParticle.y) * pulse.progress;

      // Pulse trail
      const pulseOpacity = Math.max(0, 1 - pulse.progress) * 0.8;
      context.strokeStyle = `rgba(57, 255, 136, ${pulseOpacity})`;
      context.lineWidth = 2.5;
      context.beginPath();
      context.moveTo(
        fromParticle.x + (toParticle.x - fromParticle.x) * Math.max(0, pulse.progress - 0.1),
        fromParticle.y + (toParticle.y - fromParticle.y) * Math.max(0, pulse.progress - 0.1),
      );
      context.lineTo(x, y);
      context.stroke();

      // Pulse core glow
      const coreGlow = context.createRadialGradient(x, y, 0, x, y, 8 * dpr);
      coreGlow.addColorStop(0, `rgba(134, 239, 172, ${pulseOpacity})`);
      coreGlow.addColorStop(1, "rgba(57, 255, 136, 0)");
      context.fillStyle = coreGlow;
      context.fillRect(x - 8 * dpr, y - 8 * dpr, 16 * dpr, 16 * dpr);
    });

    // Draw connections from pointer to nearby particles
    if (pointer.x > -1000) {
      particles.forEach((particle) => {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);

        if (distance < pointerDistance) {
          const alpha = (1 - distance / pointerDistance) * (0.3 + pointer.energy * 0.3);
          context.strokeStyle = `rgba(57, 255, 136, ${alpha})`;
          context.lineWidth = 1.5;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(pointer.x, pointer.y);
          context.stroke();
        }
      });
    }

    raf = requestAnimationFrame(render);
  };

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", movePointer);
  canvas.addEventListener("mouseleave", leavePointer);
  render();

  window.addEventListener("pagehide", () => cancelAnimationFrame(raf), { once: true });
}

initParticles();

// ============================================================================
// CONTACT FORM
// ============================================================================

const form = document.querySelector("[data-contact-form]");
const error = document.querySelector("[data-form-error]");
const submitButton = document.querySelector("[data-submit-button]");
const successMessage = document.querySelector("[data-success-message]");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();

  if (!name || !email || !message) {
    error.textContent = "ERR: all fields required";
    error.classList.add("is-visible");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    error.textContent = "ERR: invalid email format";
    error.classList.add("is-visible");
    return;
  }

  error.textContent = "";
  error.classList.remove("is-visible");
  submitButton.disabled = true;

  const endpoint = form.getAttribute("action") || "";

  if (!endpoint || endpoint.includes("[EMAIL]")) {
    submitButton.hidden = true;
    successMessage.hidden = false;
    form.reset();

    window.setTimeout(() => {
      submitButton.hidden = false;
      successMessage.hidden = true;
      submitButton.disabled = false;
    }, 4000);

    return;
  }

  fetch(endpoint, {
    method: form.method || "POST",
    body: new FormData(form),
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => {
      if (res.ok) return res.json().catch(() => ({}));
      return res.json().then((err) => Promise.reject(err));
    })
    .then(() => {
      submitButton.hidden = true;
      successMessage.hidden = false;
      form.reset();

      window.setTimeout(() => {
        submitButton.hidden = false;
        successMessage.hidden = true;
        submitButton.disabled = false;
      }, 4000);
    })
    .catch(() => {
      error.textContent = "ERR: submission failed — please try again later";
      error.classList.add("is-visible");
      submitButton.disabled = false;
    });
});

// ============================================================================
// EVENT CAROUSEL WITH FILTERING
// ============================================================================

async function initCarousel(type) {
  try {
    let items = null;
    const manifestEl = document.getElementById("events-manifest");
    if (manifestEl) {
      try {
        const allItems = JSON.parse(manifestEl.textContent || manifestEl.innerText || "[]");
        items = allItems.filter((item) => item.status === type);
      } catch (e) {
        console.warn("Failed to parse inline events manifest", e);
      }
    }

    const section = document.querySelector(`[data-events-section="${type}"]`);
    const track = document.querySelector(`[data-event-track="${type}"]`);
    if (!track || !items || items.length === 0) {
      if (section) section.style.display = "none";
      return;
    }

    const niceText = (name = "") => {
      const t = name.replace(/\.[^/.]+$/, "");
      return t.replace(/[_\-\(\)]+/g, " ").replace(/\s+/g, " ").trim();
    };

    // Build event cards
    const buildCards = (container, itemsToRender) => {
      container.innerHTML = "";
      itemsToRender.forEach((item) => {
        const n = item.name || item.src.split("/").pop();
        const art = document.createElement("article");
        art.className = "event-card";
        art.dataset.society = item.society || "all";
        art.innerHTML = `
          <img src="${item.src}" alt="${niceText(n)}" />
          <div class="event-overlay"></div>
          <div class="event-meta"><span>${item.society || "EVENT"}</span><span></span></div>
          <div class="event-body"><h3>${niceText(n)}</h3><p></p></div>
          <span class="event-corner left">[</span>
          <span class="event-corner right">]</span>
        `;
        container.appendChild(art);
      });
    };

    buildCards(track, items);

    // Filter functionality
    const section_el = document.querySelector(`[data-events-section="${type}"]`);
    const filterBtns = section_el.querySelectorAll(".filter-btn");

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        const filtered = filter === "all" ? items : items.filter((i) => i.society === filter);
        buildCards(track, filtered);
      });
    });
  } catch (e) {
    console.error("Failed to init carousel", e);
  }
}

initCarousel("upcoming");
initCarousel("past");
