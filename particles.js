/**
 * Night Owl — Firefly Particle System
 * Canvas-based warm floating particles for the landing page.
 * Uses requestAnimationFrame with throttling for low CPU usage.
 */

export class FireflySystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.isRunning = false;
    this.lastFrame = 0;
    this.targetFPS = 30; // Throttle to 30fps for battery
    this.frameInterval = 1000 / this.targetFPS;

    // Warm color palette for fireflies
    this.colors = [
      'rgba(255, 173, 142, ',  // Warm peach
      'rgba(245, 199, 107, ',  // Honey gold
      'rgba(255, 126, 107, ',  // Soft coral
      'rgba(232, 220, 245, ',  // Lavender mist
      'rgba(255, 210, 161, ',  // Light amber
    ];

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.initParticles();
  }

  initParticles() {
    const count = Math.min(Math.floor((this.canvas.width * this.canvas.height) / 15000), 60);
    this.particles = [];

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 3 + 1.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.2 - 0.1, // Slight upward drift
      opacity: Math.random() * 0.5 + 0.2,
      opacityDirection: Math.random() > 0.5 ? 1 : -1,
      opacitySpeed: Math.random() * 0.008 + 0.003,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      glowSize: Math.random() * 8 + 4,
    };
  }

  update() {
    for (const p of this.particles) {
      // Move
      p.x += p.speedX;
      p.y += p.speedY;

      // Pulse opacity
      p.opacity += p.opacityDirection * p.opacitySpeed;
      if (p.opacity >= 0.7) {
        p.opacityDirection = -1;
      } else if (p.opacity <= 0.1) {
        p.opacityDirection = 1;
      }

      // Wrap around edges
      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.canvas.height + 10;
      if (p.y > this.canvas.height + 10) p.y = -10;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.particles) {
      // Outer glow
      const gradient = this.ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.glowSize
      );
      gradient.addColorStop(0, p.color + (p.opacity * 0.8) + ')');
      gradient.addColorStop(0.4, p.color + (p.opacity * 0.3) + ')');
      gradient.addColorStop(1, p.color + '0)');

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.glowSize, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();

      // Core dot
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color + p.opacity + ')';
      this.ctx.fill();
    }
  }

  animate(timestamp) {
    if (!this.isRunning) return;

    const elapsed = timestamp - this.lastFrame;
    if (elapsed >= this.frameInterval) {
      this.lastFrame = timestamp - (elapsed % this.frameInterval);
      this.update();
      this.draw();
    }

    this.animationId = requestAnimationFrame((ts) => this.animate(ts));
  }

  start() {
    if (this.isRunning || !this.canvas) return;
    this.isRunning = true;
    this.animate(performance.now());
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}
