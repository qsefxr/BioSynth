const utils = {
  debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },
  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
};

const ecoData = [
  {
    id: "f1",
    title: "Neon Fern",
    type: "flora",
    biome: "Deep Forest",
    glowLevel: "High",
    description:
      "A delicate fern that absorbs moonlight and emits a pulsating neon purple aura. Its spores are highly reactive to kinetic energy.",
    image: "https://picsum.photos/seed/neonfern/600/400",
  },
  {
    id: "f2",
    title: "Luminescent Shroom",
    type: "flora",
    biome: "Caves",
    glowLevel: "Medium",
    description:
      "Grows in damp, dark environments. These mushrooms form a symbiotic network that communicates through light pulses.",
    image: "https://picsum.photos/seed/shroom/600/400",
  },
  {
    id: "a1",
    title: "Aether Moth",
    type: "fauna",
    biome: "Canopy",
    glowLevel: "High",
    description:
      "A large moth with wings that mimic the starry night sky. It feeds on the nectar of glowing flora.",
    image: "https://picsum.photos/seed/moth/600/400",
  },
  {
    id: "a2",
    title: "Phosphor Fox",
    type: "fauna",
    biome: "Plains",
    glowLevel: "Low",
    description:
      "A nimble predator whose fur is interwoven with bio-luminescent strands, allowing it to camouflage in the glowing underbrush.",
    image: "https://picsum.photos/seed/fox/600/400",
  },
  {
    id: "f3",
    title: "Crystal Lotus",
    type: "flora",
    biome: "Water",
    glowLevel: "Extreme",
    description:
      "Blooms only when the water is perfectly still. The petals act as prisms, refracting ambient light into blindingly bright colors.",
    image: "https://picsum.photos/seed/lotus/600/400",
  },
  {
    id: "a3",
    title: "Glow Ray",
    type: "fauna",
    biome: "Water",
    glowLevel: "Medium",
    description:
      "Glides gracefully through the dark waters, leaving a trail of sparkling bio-luminescence in its wake.",
    image: "https://picsum.photos/seed/ray/600/400",
  },
];

class State {
  constructor() {
    this.nightMode = false;
    this.glowIntensity = 50;
    this.particleSpeed = 3;
    this.particleDensity = 100;

    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener(this));
  }

  toggleNightMode() {
    this.nightMode = !this.nightMode;
    document.body.classList.toggle("night-mode", this.nightMode);
    document.documentElement.style.setProperty(
      "--color-bg-dark",
      this.nightMode ? "#0a0512" : "#08070a",
    );
    this.notify();
  }

  updateGlow(val) {
    this.glowIntensity = val;
    const intensity = (val / 100) * 1.5;
    document.documentElement.style.setProperty("--glow-intensity", intensity);
    document.getElementById("glow-val").textContent = val;
    this.notify();
  }

  updateSpeed(val) {
    this.particleSpeed = val;
    document.getElementById("speed-val").textContent = val;
    this.notify();
  }

  updateDensity(val) {
    this.particleDensity = val;
    document.getElementById("density-val").textContent = val;
    this.notify();
  }
}

const appState = new State();

class CursorManager {
  constructor() {
    this.cursor = document.getElementById("custom-cursor");
    this.interactives = document.querySelectorAll(".interactive");
    this.init();
  }

  init() {
    if (window.matchMedia("(hover: hover)").matches) {
      document.addEventListener("mousemove", (e) => {
        this.cursor.style.left = `${e.clientX}px`;
        this.cursor.style.top = `${e.clientY}px`;
      });

      this.bindInteractives();
    } else {
      this.cursor.style.display = "none";
    }
  }

  bindInteractives() {
    this.interactives.forEach((el) => {
      el.addEventListener("mouseenter", () =>
        this.cursor.classList.add("hover"),
      );
      el.addEventListener("mouseleave", () =>
        this.cursor.classList.remove("hover"),
      );
    });
  }

  refresh() {
    this.interactives = document.querySelectorAll(".interactive");
    this.bindInteractives();
  }
}

class CanvasSystem {
  constructor(state) {
    this.canvas = document.getElementById("bg-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.state = state;
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 100 };
    this.scrollY = 0;

    this.init();
    this.state.subscribe(() => this.onStateChange());
  }

  init() {
    this.resize();
    window.addEventListener(
      "resize",
      utils.debounce(() => this.resize(), 200),
    );

    window.addEventListener(
      "mousemove",
      utils.throttle((e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY + this.scrollY;
      }, 50),
    );

    window.addEventListener(
      "scroll",
      utils.throttle(() => {
        this.scrollY = window.scrollY;
      }, 50),
    );

    this.createParticles();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createParticles();
  }

  onStateChange() {
    const targetCount = Math.floor(
      (this.canvas.width * this.canvas.height) /
        (10000 / (this.state.particleDensity / 50)),
    );

    if (this.particles.length < targetCount) {
      for (let i = this.particles.length; i < targetCount; i++) {
        this.particles.push(new Particle(this.canvas, this.state));
      }
    } else if (this.particles.length > targetCount) {
      this.particles.splice(targetCount);
    }
  }

  createParticles() {
    this.particles = [];
    const count = Math.floor(
      (this.canvas.width * this.canvas.height) /
        (10000 / (this.state.particleDensity / 50)),
    );
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(this.canvas, this.state));
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p) => {
      p.update(this.mouse, this.scrollY);
      p.draw(this.ctx);
    });
  }
}

class Particle {
  constructor(canvas, state) {
    this.canvas = canvas;
    this.state = state;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 30 + 1;
    this.color = Math.random() > 0.5 ? "138, 43, 226" : "57, 255, 20";
  }

  update(mouse, scrollY) {
    const speedMultiplier = this.state.particleSpeed / 3;
    this.y -= 0.5 * speedMultiplier;

    if (this.y < 0) {
      this.y = this.canvas.height;
      this.baseY = this.y;
      this.x = Math.random() * this.canvas.width;
      this.baseX = this.x;
    }

    let currentMouseY = mouse.y - scrollY;

    let dx = mouse.x - this.x;
    let dy = currentMouseY - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius) {
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.density * speedMultiplier;
      let directionY = forceDirectionY * force * this.density * speedMultiplier;

      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();

    const alpha = (this.state.glowIntensity / 100) * 0.8 + 0.2;
    ctx.fillStyle = `rgba(${this.color}, ${alpha})`;

    ctx.shadowBlur = 10 * (this.state.glowIntensity / 50);
    ctx.shadowColor = `rgb(${this.color})`;

    ctx.fill();
  }
}

class UIManager {
  constructor(state, cursorManager) {
    this.state = state;
    this.cursorManager = cursorManager;

    this.grid = document.getElementById("explore-grid");
    this.filterBtns = document.querySelectorAll(".filter-btn");
    this.modal = document.getElementById("modal");
    this.modalBody = document.getElementById("modal-body");
    this.modalCloseBtn = document.getElementById("modal-close");

    this.sliderGlow = document.getElementById("glow-intensity");
    this.sliderSpeed = document.getElementById("particle-speed");
    this.sliderDensity = document.getElementById("particle-density");

    this.toggleStateBtn = document.getElementById("toggle-state");
    this.hamburger = document.getElementById("hamburger");
    this.nav = document.querySelector(".nav");

    this.init();
  }

  init() {
    this.renderCards("all");
    this.bindEvents();
    this.setupIntersectionObserver();
  }

  bindEvents() {
    this.filterBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.filterBtns.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.renderCards(e.target.dataset.filter);
      });
    });

    this.modalCloseBtn.addEventListener("click", () => this.closeModal());
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    this.sliderGlow.addEventListener("input", (e) =>
      this.state.updateGlow(e.target.value),
    );
    this.sliderSpeed.addEventListener("input", (e) =>
      this.state.updateSpeed(e.target.value),
    );
    this.sliderDensity.addEventListener("input", (e) =>
      this.state.updateDensity(e.target.value),
    );

    this.toggleStateBtn.addEventListener("click", () => {
      this.state.toggleNightMode();
      this.toggleStateBtn.textContent = this.state.nightMode
        ? "Day Mode"
        : "Night Mode";
    });

    this.hamburger.addEventListener("click", () => {
      this.nav.classList.toggle("active");
    });
  }

  renderCards(filter) {
    this.grid.innerHTML = "";

    const filteredData =
      filter === "all"
        ? ecoData
        : ecoData.filter((item) => item.type === filter);

    filteredData.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card interactive fade-in-section is-visible";
      card.innerHTML = `
                <div class="card__image-wrapper">
                    <img src="${item.image}" alt="${item.title}" class="card__image" loading="lazy">
                    <div class="card__image-overlay"></div>
                    <span class="card__badge">${item.type.toUpperCase()}</span>
                </div>
                <div class="card__content">
                    <h3 class="card__title glow-text">${item.title}</h3>
                    <p class="card__desc">${item.description}</p>
                </div>
            `;

      card.addEventListener("click", () => this.openModal(item));
      this.grid.appendChild(card);
    });

    this.cursorManager.refresh();
  }

  openModal(item) {
    this.modalBody.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="modal__image">
            <div class="modal__info">
                <h2 class="modal__title glow-text" style="margin-bottom: 1rem; font-size: 2rem;">${item.title}</h2>
                <div class="modal__stats">
                    <span class="stat">Biome: <span class="highlight">${item.biome}</span></span>
                    <span class="stat">Glow Level: <span class="highlight">${item.glowLevel}</span></span>
                </div>
                <p class="modal__desc" style="color: var(--color-text-muted); line-height: 1.8;">
                    ${item.description}
                </p>
                <div style="margin-top: 2rem;">
                    <button class="btn btn--outline interactive">Analyze Sample</button>
                </div>
            </div>
        `;
    this.modal.classList.add("active");
    document.body.style.overflow = "hidden";
    this.cursorManager.refresh();
  }

  closeModal() {
    this.modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(".fade-in-section").forEach((section) => {
      observer.observe(section);
    });

    const header = document.getElementById("header");
    window.addEventListener(
      "scroll",
      utils.throttle(() => {
        if (window.scrollY > 50) {
          header.style.background = "rgba(8, 7, 10, 0.9)";
          header.style.boxShadow = "0 5px 20px rgba(0,0,0,0.5)";
        } else {
          header.style.background = "transparent";
          header.style.boxShadow = "none";
        }
      }, 100),
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const cursorManager = new CursorManager();
  const canvasSystem = new CanvasSystem(appState);
  const uiManager = new UIManager(appState, cursorManager);

  appState.updateGlow(50);
});
