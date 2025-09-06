window.addEventListener('DOMContentLoaded', () => {
  // --- MENÚ HAMBURGUESA ---
  const btnHamburguesa = document.getElementById('hamburger-btn');
  const menu = document.getElementById('menu-desplegable');

  if (btnHamburguesa && menu) {
    btnHamburguesa.addEventListener('click', () => {
      menu.classList.toggle('activo');
      btnHamburguesa.textContent = menu.classList.contains('activo') ? '✕' : '☰';
    });
  }

  // --- ENLACE ACTIVO SEGÚN LA PÁGINA ---
  const currentPage = window.location.pathname.split("/").pop();
  const links = document.querySelectorAll(".nav_link");
  links.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  // --- PARTÍCULAS EN CANVAS ---
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return; // sale si no existe el canvas
  const ctx = canvas.getContext("2d");

  let width = 0;
  let height = 0;
  let ratio = 1;
  let particles = [];
  const maxDistance = 120;

  // mouse global (escuchamos en window)
  const mouse = { x: null, y: null, radius: 120 };

  // Escuchar el movimiento en window para que funcione aunque el cursor esté sobre otros elementos
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  // Cuando el cursor sale de la ventana, limpiar coords
  window.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget) {
      mouse.x = null;
      mouse.y = null;
    }
  });
  window.addEventListener('blur', () => { mouse.x = null; mouse.y = null; });

  // ajustar canvas para devicePixelRatio y redimensionar
  function resizeCanvas() {
    ratio = window.devicePixelRatio || 1;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;

    // establecer tamaño real en píxeles y escalar contexto
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    // reset transform y escalar al ratio
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(ratio, ratio);

    // re-inicializar partículas para ajustarlas al nuevo tamaño
    initParticles();
  }
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1;
      this.vy = (Math.random() - 0.5) * 1;
      this.size = 2;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = "#9eccfac9";
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // rebote en bordes
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // repulsión suave con el mouse (opcional)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repulseRadius = mouse.radius;

        if (dist < repulseRadius && dist > 0) {
          const angle = Math.atan2(dy, dx);
          const force = (repulseRadius - dist) / repulseRadius;
          const move = force * 2; // intensidad
          this.x += Math.cos(angle) * move;
          this.y += Math.sin(angle) * move;
        }
      }

      this.draw();
    }
  }

  function initParticles() {
    particles = [];
    // número adaptativo (puedes fijarlo si prefieres)
    const count = Math.max(40, Math.floor((width * height) / 9000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          ctx.beginPath();
          ctx.strokeStyle = "rgba(236,245,245,0.10)";
          ctx.lineWidth = 1;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }

      // línea entre partícula y mouse (si está cerca)
      if (mouse.x !== null && mouse.y !== null) {
        const dxm = particles[a].x - mouse.x;
        const dym = particles[a].y - mouse.y;
        const dToMouse = Math.sqrt(dxm * dxm + dym * dym);

        if (dToMouse < mouse.radius) {
          ctx.beginPath();
          ctx.strokeStyle = "rgba(120,184,248,0.36)";
          ctx.lineWidth = 1;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    // limpiar usando dimensiones en CSS (ctx ya está escalado)
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => p.update());
    connectParticles();
    requestAnimationFrame(animate);
  }

  // inicialización
  resizeCanvas(); // llama initParticles() internamente
  animate();
});
