/* =========================================================
   IEEE IES CHAPTER — ESSTHS STUDENT BRANCH
   Main JavaScript
========================================================= */

(() => {
  "use strict";

  /* =======================================================
     UTILITIES
  ======================================================= */

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

  const lerp = (a, b, amount) =>
    a + (b - a) * amount;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* =======================================================
     INDUSTRIAL ELECTRONICS PARTICLE SYSTEM
     
     Orange = primary industrial signal
     Blue   = electronics / control signal
  ======================================================= */

  class ControlSignalParticleSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d", {
        alpha: true,
        desynchronized: true
      });

      if (!this.ctx) return;

      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.width = 0;
      this.height = 0;

      this.particles = [];

      this.mouse = {
        x: null,
        y: null,
        active: false
      };

      this.pulse = {
        x: 0,
        y: 0,
        radius: 0,
        strength: 0
      };

      this.running = true;
      this.frame = null;
      this.lastTime = performance.now();

      /*
       * Keep the system visually rich without becoming
       * expensive on smaller devices.
       */
      this.connectionDistance = 155;
      this.mouseDistance = 190;
      this.baseSpeed = 0.16;

      this.resize = this.resize.bind(this);
      this.animate = this.animate.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseLeave = this.handleMouseLeave.bind(this);
      this.handleClick = this.handleClick.bind(this);

      this.init();
    }

    init() {
      this.resize();

      window.addEventListener("resize", this.resize, {
        passive: true
      });

      window.addEventListener("mousemove", this.handleMouseMove, {
        passive: true
      });

      window.addEventListener("mouseleave", this.handleMouseLeave, {
        passive: true
      });

      window.addEventListener("click", this.handleClick, {
        passive: true
      });

      if (prefersReducedMotion) {
        this.renderStatic();
        return;
      }

      this.frame = requestAnimationFrame(this.animate);
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();

      this.width = Math.max(1, rect.width);
      this.height = Math.max(1, rect.height);

      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);

      this.ctx.setTransform(
        this.dpr,
        0,
        0,
        this.dpr,
        0,
        0
      );

      this.createParticles();
    }

    getParticleCount() {
      /*
       * More dense than the original green system.
       * Still capped for performance.
       */
      if (this.width < 480) {
        return 24;
      }

      if (this.width < 768) {
        return 34;
      }

      if (this.width < 1200) {
        return 52;
      }

      return clamp(
        Math.floor(this.width / 18),
        55,
        95
      );
    }

    createParticles() {
      const count = this.getParticleCount();

      this.particles = [];

      for (let i = 0; i < count; i++) {
        /*
         * Slightly favor the right half because the hero
         * typography occupies the left side.
         */
        const x =
          this.width < 768
            ? Math.random() * this.width
            : this.width * (
                0.32 + Math.random() * 0.68
              );

        const y = Math.random() * this.height;

        const blueBias = Math.random() < 0.28;

        this.particles.push({
          x,
          y,

          vx:
            (Math.random() - 0.5) *
            this.baseSpeed,

          vy:
            (Math.random() - 0.5) *
            this.baseSpeed,

          radius:
            Math.random() < 0.12
              ? Math.random() * 2.1 + 2
              : Math.random() * 1.2 + 0.7,

          alpha:
            Math.random() * 0.5 + 0.35,

          energy: Math.random(),

          type: blueBias ? "blue" : "orange",

          phase: Math.random() * Math.PI * 2,

          pulseSpeed:
            Math.random() * 0.018 + 0.008
        });
      }
    }

    handleMouseMove(event) {
      this.mouse.x = event.clientX;
      this.mouse.y = event.clientY;
      this.mouse.active = true;
    }

    handleMouseLeave() {
      this.mouse.active = false;
    }

    handleClick(event) {
      this.pulse.x = event.clientX;
      this.pulse.y = event.clientY;
      this.pulse.radius = 10;
      this.pulse.strength = 1;
    }

    update(delta) {
      const speedMultiplier = clamp(
        delta / 16.67,
        0.5,
        2
      );

      for (const particle of this.particles) {
        /*
         * Very subtle natural movement.
         */
        particle.phase +=
          particle.pulseSpeed * speedMultiplier;

        particle.vx +=
          Math.sin(particle.phase) * 0.002;

        particle.vy +=
          Math.cos(particle.phase * 0.83) * 0.002;

        /*
         * Mouse interaction.
         */
        if (
          this.mouse.active &&
          this.mouse.x !== null &&
          this.mouse.y !== null
        ) {
          const dx = particle.x - this.mouse.x;
          const dy = particle.y - this.mouse.y;

          const distance = Math.sqrt(
            dx * dx + dy * dy
          );

          if (distance < this.mouseDistance && distance > 0) {
            const force =
              (1 - distance / this.mouseDistance) *
              0.045;

            particle.vx +=
              (dx / distance) * force;

            particle.vy +=
              (dy / distance) * force;

            particle.energy = Math.min(
              1,
              particle.energy + 0.035
            );
          }
        }

        /*
         * Click pulse propagates through the network.
         */
        if (this.pulse.strength > 0) {
          const dx = particle.x - this.pulse.x;
          const dy = particle.y - this.pulse.y;

          const distance = Math.sqrt(
            dx * dx + dy * dy
          );

          if (
            distance <
            this.pulse.radius + 90
          ) {
            particle.energy = Math.min(
              1,
              particle.energy +
                this.pulse.strength * 0.12
            );
          }
        }

        /*
         * Velocity damping.
         */
        particle.vx *= 0.985;
        particle.vy *= 0.985;

        /*
         * Keep movement alive.
         */
        particle.x +=
          particle.vx * speedMultiplier;

        particle.y +=
          particle.vy * speedMultiplier;

        /*
         * Soft screen bounds.
         */
        if (particle.x < -20) {
          particle.x = this.width + 20;
        }

        if (particle.x > this.width + 20) {
          particle.x = -20;
        }

        if (particle.y < -20) {
          particle.y = this.height + 20;
        }

        if (particle.y > this.height + 20) {
          particle.y = -20;
        }

        /*
         * Energy naturally decays.
         */
        particle.energy = Math.max(
          0.15,
          particle.energy - 0.008
        );
      }

      if (this.pulse.strength > 0) {
        this.pulse.radius +=
          7 * speedMultiplier;

        this.pulse.strength *= 0.94;

        if (this.pulse.strength < 0.01) {
          this.pulse.strength = 0;
        }
      }
    }

    getParticleColor(particle, alpha) {
      if (particle.type === "blue") {
        return `rgba(20, 152, 237, ${alpha})`;
      }

      return `rgba(245, 130, 32, ${alpha})`;
    }

    getConnectionColor(
      first,
      second,
      alpha
    ) {
      if (
        first.type === "blue" &&
        second.type === "blue"
      ) {
        return `rgba(20, 152, 237, ${alpha})`;
      }

      if (
        first.type === "orange" &&
        second.type === "orange"
      ) {
        return `rgba(245, 130, 32, ${alpha})`;
      }

      /*
       * Mixed orange/blue signal.
       */
      return `rgba(150, 120, 90, ${alpha})`;
    }

    drawBackgroundGlow() {
      const ctx = this.ctx;

      const orangeGlow = ctx.createRadialGradient(
        this.width * 0.78,
        this.height * 0.45,
        0,
        this.width * 0.78,
        this.height * 0.45,
        this.width * 0.42
      );

      orangeGlow.addColorStop(
        0,
        "rgba(245, 130, 32, 0.045)"
      );

      orangeGlow.addColorStop(
        1,
        "rgba(245, 130, 32, 0)"
      );

      ctx.fillStyle = orangeGlow;
      ctx.fillRect(
        0,
        0,
        this.width,
        this.height
      );

      const blueGlow = ctx.createRadialGradient(
        this.width * 0.92,
        this.height * 0.72,
        0,
        this.width * 0.92,
        this.height * 0.72,
        this.width * 0.28
      );

      blueGlow.addColorStop(
        0,
        "rgba(0, 114, 188, 0.035)"
      );

      blueGlow.addColorStop(
        1,
        "rgba(0, 114, 188, 0)"
      );

      ctx.fillStyle = blueGlow;
      ctx.fillRect(
        0,
        0,
        this.width,
        this.height
      );
    }

    drawConnections() {
      const ctx = this.ctx;
      const particles = this.particles;

      for (let i = 0; i < particles.length; i++) {
        const first = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const second = particles[j];

          const dx = first.x - second.x;
          const dy = first.y - second.y;

          const distanceSquared =
            dx * dx + dy * dy;

          if (
            distanceSquared >
            this.connectionDistance *
              this.connectionDistance
          ) {
            continue;
          }

          const distance =
            Math.sqrt(distanceSquared);

          let alpha =
            (1 - distance / this.connectionDistance) *
            0.25;

          /*
           * Mouse energizes nearby connections.
           */
          if (
            this.mouse.active &&
            this.mouse.x !== null &&
            this.mouse.y !== null
          ) {
            const midpointX =
              (first.x + second.x) / 2;

            const midpointY =
              (first.y + second.y) / 2;

            const mdx =
              midpointX - this.mouse.x;

            const mdy =
              midpointY - this.mouse.y;

            const mouseDistance =
              Math.sqrt(
                mdx * mdx + mdy * mdy
              );

            if (mouseDistance < 220) {
              alpha +=
                (1 - mouseDistance / 220) *
                0.35;
            }
          }

          alpha = Math.min(alpha, 0.7);

          ctx.beginPath();
          ctx.moveTo(first.x, first.y);
          ctx.lineTo(second.x, second.y);

          ctx.strokeStyle =
            this.getConnectionColor(
              first,
              second,
              alpha
            );

          ctx.lineWidth =
            alpha > 0.4 ? 1 : 0.65;

          ctx.stroke();
        }
      }
    }

    drawMouseConnections() {
      if (
        !this.mouse.active ||
        this.mouse.x === null ||
        this.mouse.y === null
      ) {
        return;
      }

      const ctx = this.ctx;

      for (const particle of this.particles) {
        const dx =
          particle.x - this.mouse.x;

        const dy =
          particle.y - this.mouse.y;

        const distance =
          Math.sqrt(dx * dx + dy * dy);

        if (distance > this.mouseDistance) {
          continue;
        }

        const alpha =
          (1 - distance / this.mouseDistance) *
          0.65;

        ctx.beginPath();
        ctx.moveTo(
          particle.x,
          particle.y
        );
        ctx.lineTo(
          this.mouse.x,
          this.mouse.y
        );

        ctx.strokeStyle =
          particle.type === "blue"
            ? `rgba(20, 152, 237, ${alpha})`
            : `rgba(245, 130, 32, ${alpha})`;

        ctx.lineWidth =
          0.7 + alpha * 0.8;

        ctx.stroke();
      }
    }

    drawParticles() {
      const ctx = this.ctx;

      for (const particle of this.particles) {
        const energy =
          particle.energy;

        const radius =
          particle.radius *
          (1 + energy * 0.35);

        const alpha =
          particle.alpha *
          (0.72 + energy * 0.28);

        /*
         * Glow.
         */
        const glow =
          ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            radius * 7
          );

        glow.addColorStop(
          0,
          this.getParticleColor(
            particle,
            Math.min(0.3, alpha * 0.35)
          )
        );

        glow.addColorStop(
          1,
          this.getParticleColor(
            particle,
            0
          )
        );

        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(
          particle.x,
          particle.y,
          radius * 7,
          0,
          Math.PI * 2
        );
        ctx.fill();

        /*
         * Core.
         */
        ctx.beginPath();

        ctx.fillStyle =
          this.getParticleColor(
            particle,
            alpha
          );

        ctx.arc(
          particle.x,
          particle.y,
          radius,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }
    }

    drawPulse() {
      if (this.pulse.strength <= 0) {
        return;
      }

      const ctx = this.ctx;

      const alpha =
        this.pulse.strength * 0.55;

      ctx.beginPath();

      ctx.arc(
        this.pulse.x,
        this.pulse.y,
        this.pulse.radius,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle =
        `rgba(245, 130, 32, ${alpha})`;

      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();

      ctx.arc(
        this.pulse.x,
        this.pulse.y,
        this.pulse.radius * 0.72,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle =
        `rgba(20, 152, 237, ${alpha * 0.7})`;

      ctx.lineWidth = 0.7;
      ctx.stroke();
    }

    renderStatic() {
      const ctx = this.ctx;

      ctx.clearRect(
        0,
        0,
        this.width,
        this.height
      );

      this.drawBackgroundGlow();
      this.drawConnections();
      this.drawParticles();
    }

    render() {
      const ctx = this.ctx;

      ctx.clearRect(
        0,
        0,
        this.width,
        this.height
      );

      this.drawBackgroundGlow();
      this.drawConnections();
      this.drawMouseConnections();
      this.drawParticles();
      this.drawPulse();
    }

    animate(timestamp) {
      if (!this.running) {
        return;
      }

      const delta =
        timestamp - this.lastTime;

      this.lastTime = timestamp;

      /*
       * Avoid huge jumps when the tab becomes visible again.
       */
      const safeDelta =
        Math.min(delta, 40);

      this.update(safeDelta);
      this.render();

      this.frame =
        requestAnimationFrame(
          this.animate
        );
    }

    destroy() {
      this.running = false;

      if (this.frame) {
        cancelAnimationFrame(this.frame);
      }

      window.removeEventListener(
        "resize",
        this.resize
      );

      window.removeEventListener(
        "mousemove",
        this.handleMouseMove
      );

      window.removeEventListener(
        "mouseleave",
        this.handleMouseLeave
      );

      window.removeEventListener(
        "click",
        this.handleClick
      );
    }
  }

  /* =======================================================
     TEXT SCRAMBLE
  ======================================================= */

  class TextScramble {
    constructor(element) {
      this.element = element;

      this.characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

      this.frameRequest = null;
      this.frame = 0;
      this.queue = [];
    }

    setText(newText) {
      const oldText =
        this.element.innerText;

      const length =
        Math.max(
          oldText.length,
          newText.length
        );

      this.queue = [];

      for (let i = 0; i < length; i++) {
        const from =
          oldText[i] || "";

        const to =
          newText[i] || "";

        const start =
          Math.floor(
            Math.random() * 35
          );

        const end =
          start +
          Math.floor(
            Math.random() * 35
          ) +
          15;

        this.queue.push({
          from,
          to,
          start,
          end,
          char: ""
        });
      }

      cancelAnimationFrame(
        this.frameRequest
      );

      this.frame = 0;

      return new Promise((resolve) => {
        this.resolve = resolve;
        this.update();
      });
    }

    update() {
      let output = "";
      let complete = 0;

      for (const item of this.queue) {
        if (this.frame >= item.end) {
          complete++;

          output += item.to;
        } else if (this.frame >= item.start) {
          if (!item.char) {
            item.char =
              this.randomCharacter();
          }

          output +=
            `<span class="scramble-char">${item.char}</span>`;
        } else {
          output += item.from;
        }
      }

      this.element.innerHTML = output;

      if (complete === this.queue.length) {
        this.resolve();
        return;
      }

      this.frame++;

      this.frameRequest =
        requestAnimationFrame(
          () => this.update()
        );
    }

    randomCharacter() {
      return this.characters[
        Math.floor(
          Math.random() *
            this.characters.length
        )
      ];
    }
  }

  /* =======================================================
     HEADER
  ======================================================= */

  function initHeader() {
    const header =
      document.querySelector(".site-header");

    if (!header) return;

    const menuToggle =
      document.querySelector(".menu-toggle");

    const nav =
      document.querySelector(".mobile-nav");

    const updateHeader =
      () => {
        header.classList.toggle(
          "scrolled",
          window.scrollY > 20
        );
      };

    updateHeader();

    window.addEventListener(
      "scroll",
      updateHeader,
      { passive: true }
    );

    if (!menuToggle || !nav) {
      return;
    }

    menuToggle.addEventListener(
      "click",
      () => {
        header.classList.toggle(
          "menu-open"
        );

        document.body.classList.toggle(
          "menu-open"
        );
      }
    );

    nav.querySelectorAll("a").forEach(
      (link) => {
        link.addEventListener(
          "click",
          () => {
            header.classList.remove(
              "menu-open"
            );

            document.body.classList.remove(
              "menu-open"
            );
          }
        );
      }
    );
  }

  /* =======================================================
     SCROLL ANIMATIONS
  ======================================================= */

  function initScrollAnimations() {
    const elements =
      document.querySelectorAll(
        ".reveal-up, .reveal-scale"
      );

    if (!elements.length) {
      return;
    }

    if (
      prefersReducedMotion ||
      !("IntersectionObserver" in window)
    ) {
      elements.forEach((element) => {
        element.classList.add(
          "is-visible"
        );
      });

      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                entry.isIntersecting
              ) {
                entry.target.classList.add(
                  "is-visible"
                );

                observer.unobserve(
                  entry.target
                );
              }
            }
          );
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -50px 0px"
        }
      );

    elements.forEach((element) => {
      observer.observe(element);
    });
  }

  /* =======================================================
     HERO TEXT
  ======================================================= */

  function initHeroText() {
    const elements =
      document.querySelectorAll(
        "[data-scramble]"
      );

    if (
      !elements.length ||
      prefersReducedMotion
    ) {
      return;
    }

    elements.forEach((element, index) => {
      const text =
        element.dataset.scramble ||
        element.textContent;

      const delay =
        Number(
          element.dataset.scrambleDelay ||
            index * 120
        );

      element.textContent = "";

      window.setTimeout(() => {
        const scramble =
          new TextScramble(
            element
          );

        scramble.setText(text);
      }, delay);
    });
  }

  /* =======================================================
     EVENTS
  ======================================================= */

  function getEvents() {
    const manifest =
      document.getElementById(
        "events-manifest"
      );

    if (!manifest) {
      return [];
    }

    try {
      const parsed =
        JSON.parse(
          manifest.textContent
        );

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch (error) {
      console.error(
        "Unable to parse events manifest:",
        error
      );

      return [];
    }
  }

  function formatEventDate(dateString) {
    if (!dateString) {
      return "DATE TBC";
    }

    const date =
      new Date(
        `${dateString}T12:00:00`
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return dateString;
    }

    return new Intl.DateTimeFormat(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    ).format(date);
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );
  }

  function createEventCard(event) {
    const article =
      document.createElement(
        "article"
      );

    article.className =
      "event-card reveal-up";

    article.dataset.type =
      event.type || "";

    article.innerHTML = `
      <div class="event-card-image">
        ${
          event.src
            ? `<img
                src="${escapeHTML(event.src)}"
                alt=""
                loading="lazy"
              />`
            : ""
        }
      </div>

      <div class="event-card-body">

        <div class="event-card-meta">
          <span class="event-card-type">
            ${escapeHTML(
              String(
                event.type || "event"
              ).toUpperCase()
            )}
          </span>

          <span>
            ${escapeHTML(
              formatEventDate(
                event.date
              )
            )}
          </span>
        </div>

        <h3>
          ${escapeHTML(
            event.name ||
              "Untitled event"
          )}
        </h3>

        <p class="event-card-location">
          ${escapeHTML(
            event.location ||
              "Location TBC"
          )}
          ${
            event.mode
              ? ` · ${escapeHTML(
                  event.mode
                )}`
              : ""
          }
        </p>

        <div class="event-card-footer">
          <span>
            IES / ESSTHS
          </span>

          <span>
            ${event.status === "past"
              ? "ARCHIVED"
              : "UPCOMING"}
          </span>
        </div>

      </div>
    `;

    return article;
  }

  function renderEvents(
    events,
    filter = "all"
  ) {
    const tracks =
      document.querySelectorAll(
        "[data-event-track]"
      );

    tracks.forEach((track) => {
      const status =
        track.dataset.eventTrack;

      const filtered =
        events.filter(
          (event) => {
            if (
              event.status !== status
            ) {
              return false;
            }

            if (
              filter === "all"
            ) {
              return true;
            }

            return (
              event.type === filter
            );
          }
        );

      track.innerHTML = "";

      if (!filtered.length) {
        const empty =
          document.createElement(
            "div"
          );

        empty.className =
          "events-empty";

        empty.textContent =
          "NO EVENTS IN THIS CHANNEL.";

        track.appendChild(empty);

        return;
      }

      filtered.forEach(
        (event) => {
          track.appendChild(
            createEventCard(event)
          );
        }
      );
    });

    /*
     * Newly generated cards also receive
     * the reveal animation.
     */
    requestAnimationFrame(() => {
      initScrollAnimations();
    });
  }

  function initEventFilters() {
    const buttons =
      document.querySelectorAll(
        ".filter-btn"
      );

    if (!buttons.length) {
      return;
    }

    const events =
      getEvents();

    renderEvents(
      events,
      "all"
    );

    buttons.forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          buttons.forEach(
            (item) => {
              item.classList.remove(
                "filter-btn--active"
              );
            }
          );

          button.classList.add(
            "filter-btn--active"
          );

          renderEvents(
            events,
            button.dataset.filter ||
              "all"
          );
        }
      );
    });
  }

  /* =======================================================
     CONTACT FORM
  ======================================================= */

  function initContactForm() {
    const form =
      document.querySelector(
        ".contact-form"
      );

    if (!form) {
      return;
    }

    const submitButton =
      form.querySelector(
        ".submit-btn"
      );

    const status =
      form.querySelector(
        ".form-status"
      );

    if (!submitButton || !status) {
      return;
    }

    form.addEventListener(
      "submit",
      async (event) => {
        event.preventDefault();

        const originalButton =
          submitButton.innerHTML;

        submitButton.disabled =
          true;

        status.textContent =
          "CHANNEL / TRANSMITTING";

        submitButton.innerHTML =
          `
            <span>Sending</span>
            <span class="submit-arrow">→</span>
          `;

        try {
          const formData =
            new FormData(form);

          const response =
            await fetch(
              form.action,
              {
                method: "POST",
                body: formData,
                headers: {
                  Accept:
                    "application/json"
                }
              }
            );

          if (!response.ok) {
            throw new Error(
              `Request failed: ${response.status}`
            );
          }

          status.textContent =
            "CHANNEL / SIGNAL SENT";

          submitButton.innerHTML =
            `
              <span>Signal Sent</span>
              <span class="submit-arrow">✓</span>
            `;

          form.reset();
        } catch (error) {
          console.error(
            "Contact form error:",
            error
          );

          status.textContent =
            "CHANNEL / ERROR";

          submitButton.innerHTML =
            `
              <span>Retry Signal</span>
              <span class="submit-arrow">↻</span>
            `;
        } finally {
          window.setTimeout(() => {
            submitButton.disabled =
              false;

            if (
              status.textContent ===
              "CHANNEL / SIGNAL SENT"
            ) {
              status.textContent =
                "CHANNEL / READY";

              submitButton.innerHTML =
                originalButton;
            }
          }, 3500);
        }
      }
    );
  }

  /* =======================================================
     SMOOTH ANCHOR OFFSET
  ======================================================= */

  function initAnchorLinks() {
    const header =
      document.querySelector(
        ".site-header"
      );

    const headerHeight =
      header
        ? header.offsetHeight
        : 0;

    document
      .querySelectorAll(
        'a[href^="#"]'
      )
      .forEach((link) => {
        link.addEventListener(
          "click",
          (event) => {
            const href =
              link.getAttribute(
                "href"
              );

            if (
              !href ||
              href === "#"
            ) {
              return;
            }

            const target =
              document.querySelector(
                href
              );

            if (!target) {
              return;
            }

            event.preventDefault();

            const top =
              target.getBoundingClientRect()
                .top +
              window.scrollY -
              headerHeight -
              15;

            window.scrollTo({
              top,
              behavior:
                prefersReducedMotion
                  ? "auto"
                  : "smooth"
            });
          }
        );
      });
  }

  /* =======================================================
     ACTIVE NAVIGATION
  ======================================================= */

  function initActiveNavigation() {
    const navLinks =
      document.querySelectorAll(
        '.desktop-nav a[href^="#"], .mobile-nav a[href^="#"]'
      );

    if (!navLinks.length) {
      return;
    }

    const sections =
      Array.from(navLinks)
        .map((link) => {
          const id =
            link
              .getAttribute("href")
              ?.replace(
                "#",
                ""
              );

          return id
            ? document.getElementById(id)
            : null;
        })
        .filter(Boolean);

    if (!sections.length) {
      return;
    }

    if (
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                !entry.isIntersecting
              ) {
                return;
              }

              navLinks.forEach(
                (link) => {
                  link.classList.remove(
                    "is-active"
                  );
                }
              );

              const active =
                document.querySelectorAll(
                  `.desktop-nav a[href="#${entry.target.id}"], .mobile-nav a[href="#${entry.target.id}"]`
                );

              active.forEach(
                (link) => {
                  link.classList.add(
                    "is-active"
                  );
                }
              );
            }
          );
        },
        {
          rootMargin:
            "-30% 0px -55% 0px",
          threshold: 0
        }
      );

    sections.forEach(
      (section) => {
        observer.observe(section);
      }
    );
  }

  /* =======================================================
     SCROLL PROGRESS BAR
  ======================================================= */

  function initScrollProgress() {
    const bar =
      document.querySelector(".scroll-progress");

    if (!bar) {
      return;
    }

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
      bar.style.width = pct + "%";
    };

    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* =======================================================
     INITIALIZATION
  ======================================================= */

  function initParticles() {
    const canvas =
      document.querySelector(
        "[data-particles]"
      );

    if (!canvas) {
      return null;
    }

    return new ControlSignalParticleSystem(
      canvas
    );
  }

  /* =======================================================
     INITIALIZATION
  ======================================================= */

  function init() {
    initParticles();

    initScrollProgress();

    initHeader();

    initScrollAnimations();

    initHeroText();

    initEventFilters();

    initContactForm();

    initAnchorLinks();

    initActiveNavigation();
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }
})();