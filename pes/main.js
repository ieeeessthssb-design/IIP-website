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
// PES ELECTRICAL GRID PARTICLE SYSTEM
// ============================================================================

function initParticles() {
  const canvas = document.querySelector("[data-particles]");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const pointer = { x: -10000, y: -10000, energy: 0 };
  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;
  let nodes = [];

  const resize = () => {
    dpr = window.devicePixelRatio || 1;
    width = canvas.clientWidth * dpr;
    height = canvas.clientHeight * dpr;
    canvas.width = width;
    canvas.height = height;

    // Create grid-like distribution of nodes
    nodes = [];
    const cols = Math.ceil(width / (200 * dpr));
    const rows = Math.ceil(height / (200 * dpr));
    
    for(let i = 0; i <= cols; i++) {
        for(let j = 0; j <= rows; j++) {
            nodes.push({
                x: (i * (width / cols)) + (Math.random() - 0.5) * 50 * dpr,
                y: (j * (height / rows)) + (Math.random() - 0.5) * 50 * dpr,
                baseX: (i * (width / cols)),
                baseY: (j * (height / rows)),
                energy: 0
            });
        }
    }
  };

  window.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) * dpr;
      pointer.y = (e.clientY - rect.top) * dpr;
  });

  const render = () => {
    context.clearRect(0, 0, width, height);

    nodes.forEach(node => {
        const dx = pointer.x - node.x;
        const dy = pointer.y - node.y;
        const dist = Math.hypot(dx, dy);
        
        // Interaction: cursor pushes nodes away and activates them
        if (dist < 200 * dpr) {
            node.energy = Math.max(node.energy, (1 - dist / (200 * dpr)) * 1);
        }
        node.energy *= 0.95;

        // Draw node
        context.fillStyle = `rgba(57, 255, 136, ${0.2 + node.energy * 0.8})`;
        context.beginPath();
        context.arc(node.x, node.y, 2 * dpr + node.energy * 3 * dpr, 0, Math.PI * 2);
        context.fill();
    });

    // Draw connections
    context.strokeStyle = `rgba(57, 255, 136, 0.15)`;
    context.lineWidth = 1;
    for(let i = 0; i < nodes.length; i++) {
        for(let j = i + 1; j < nodes.length; j++) {
            const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
            if (d < 250 * dpr) {
                context.beginPath();
                context.moveTo(nodes[i].x, nodes[i].y);
                context.lineTo(nodes[j].x, nodes[j].y);
                context.stroke();
            }
        }
    }

    requestAnimationFrame(render);
  };

  resize();
  window.addEventListener("resize", resize);
  render();
}

initParticles();

// ============================================================================
// EVENT FILTERING
// ============================================================================
const manifestEl = document.getElementById("events-manifest");
if (manifestEl) {
    const events = JSON.parse(manifestEl.textContent);
    
    function renderEvents(status, filter = "all") {
        const track = document.querySelector(`[data-event-track="${status}"]`);
        if (!track) return;
        
        const filtered = filter === "all" ? events.filter(e => e.status === status) : 
                                            events.filter(e => e.status === status && e.type === filter);
        
        track.innerHTML = filtered.map(e => `
            <article class="event-card reveal-up">
                <img src="${e.src}" alt="${e.name}">
                <div class="event-overlay"></div>
                <div class="event-meta"><span>${e.type}</span><span>${e.date}</span></div>
                <div class="event-body"><h3>${e.name}</h3><p>${e.location}</p></div>
            </article>
        `).join("");
    }

    // Set up filter buttons
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("filter-btn--active"));
            btn.classList.add("filter-btn--active");
            renderEvents("upcoming", btn.dataset.filter);
        });
    });

    renderEvents("upcoming");
    renderEvents("past");
}
