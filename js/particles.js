document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("particles-canvas");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let ratio = 1;
    let particles = [];

    const maxDistance = 120;

    const mouse = {
        x: null,
        y: null,
        radius: 120
    };

    window.addEventListener("mousemove", (e) => {

        const rect = canvas.getBoundingClientRect();

        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;

    });

    window.addEventListener("mouseout", (e) => {

        if (!e.relatedTarget) {
            mouse.x = null;
            mouse.y = null;
        }

    });

    window.addEventListener("blur", () => {

        mouse.x = null;
        mouse.y = null;

    });

    function resizeCanvas() {

        ratio = window.devicePixelRatio || 1;

        width = canvas.offsetWidth;
        height = canvas.offsetHeight;

        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);

        canvas.style.width = width + "px";
        canvas.style.height = height + "px";

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(ratio, ratio);

        initParticles();

    }

    window.addEventListener("resize", resizeCanvas);

    class Particle {

        constructor() {

            this.x = Math.random() * width;
            this.y = Math.random() * height;

            this.vx = (Math.random() - 0.5);
            this.vy = (Math.random() - 0.5);

            this.size = 2;

        }

        draw() {

            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                this.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = "#9eccfac9";

            ctx.fill();

        }

        update() {

            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width)
                this.vx *= -1;

            if (this.y < 0 || this.y > height)
                this.vy *= -1;

            if (mouse.x !== null && mouse.y !== null) {

                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;

                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius && dist > 0) {

                    const angle = Math.atan2(dy, dx);

                    const force =
                        (mouse.radius - dist) / mouse.radius;

                    const move = force * 2;

                    this.x += Math.cos(angle) * move;
                    this.y += Math.sin(angle) * move;

                }

            }

            this.draw();

        }

    }

    function initParticles() {

        particles = [];

        const count = Math.max(
            40,
            Math.floor((width * height) / 9000)
        );

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

                    ctx.moveTo(
                        particles[a].x,
                        particles[a].y
                    );

                    ctx.lineTo(
                        particles[b].x,
                        particles[b].y
                    );

                    ctx.stroke();

                }

            }

            if (mouse.x !== null && mouse.y !== null) {

                const dxm = particles[a].x - mouse.x;
                const dym = particles[a].y - mouse.y;

                const dToMouse =
                    Math.sqrt(dxm * dxm + dym * dym);

                if (dToMouse < mouse.radius) {

                    ctx.beginPath();

                    ctx.strokeStyle =
                        "rgba(120,184,248,0.36)";

                    ctx.lineWidth = 1;

                    ctx.moveTo(
                        particles[a].x,
                        particles[a].y
                    );

                    ctx.lineTo(
                        mouse.x,
                        mouse.y
                    );

                    ctx.stroke();

                }

            }

        }

    }

    function animate() {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        particles.forEach(p => p.update());

        connectParticles();

        requestAnimationFrame(animate);

    }

    resizeCanvas();

    animate();

});