document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("particles-canvas");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let ratio = 1;

    let particles = [];


    /*==================================================
      CONFIGURACIÓN
    ==================================================*/

    const CONFIG = {

        /* COLOR PRINCIPAL */
        triangleColor: "120,184,248",

        /* CANTIDAD */
        minParticles: 22,
        density: 15000,

        /* TAMAÑO */
        minSize: 16,
        maxSize: 60,

        /* OPACIDAD */
        minOpacity: 0.022,
        maxOpacity: 0.08,

        /* VELOCIDAD */
        minSpeed: 0.08,
        maxSpeed: 0.26,

        /* CONEXIONES */
        maxDistance: 124,

        /* INTERACCIÓN MOUSE */
        mouseDistance: 180,
        mouseForce: 1.8,

        /* ROTACIÓN */
        minRotationSpeed: -0.0012,
        maxRotationSpeed: 0.0012,

        /* DEFORMACIÓN */
        morphSpeed: 0.0016,
        morphAmount: 0.62

    };


    /*==================================================
      MOUSE
    ==================================================*/

    const mouse = {

        x: null,
        y: null,
        radius: 180

    };


    window.addEventListener("mousemove", (event) => {

        const rect =
            canvas.getBoundingClientRect();

        mouse.x =
            event.clientX - rect.left;

        mouse.y =
            event.clientY - rect.top;

    });


    window.addEventListener("mouseleave", () => {

        mouse.x = null;
        mouse.y = null;

    });


    window.addEventListener("blur", () => {

        mouse.x = null;
        mouse.y = null;

    });


    /*==================================================
      RESIZE
    ==================================================*/

    function resizeCanvas() {

        ratio =
            window.devicePixelRatio || 1;

        width =
            canvas.offsetWidth;

        height =
            canvas.offsetHeight;

        if (!width || !height) return;

        canvas.width =
            Math.floor(width * ratio);

        canvas.height =
            Math.floor(height * ratio);

        canvas.style.width =
            `${width}px`;

        canvas.style.height =
            `${height}px`;

        ctx.setTransform(
            ratio,
            0,
            0,
            ratio,
            0,
            0
        );

        initParticles();

    }


    window.addEventListener(
        "resize",
        resizeCanvas
    );


    /*==================================================
      PARTICLE
    ==================================================*/

    class Particle {

        constructor(initial = false) {

            this.reset(initial);

        }


        reset(initial = false) {

            this.x =
                Math.random() * width;

            this.y =
                initial
                    ? Math.random() * height
                    : height + this.size;


            /*------------------------------------------
              TAMAÑO
            ------------------------------------------*/

            this.size =
                CONFIG.minSize +
                Math.random() *
                (
                    CONFIG.maxSize -
                    CONFIG.minSize
                );


            this.width =
                this.size *
                (
                    0.65 +
                    Math.random() * 0.84
                );


            this.height =
                this.size *
                (
                    0.55 +
                    Math.random() * 0.85
                );


            /*------------------------------------------
              MOVIMIENTO
            ------------------------------------------*/

            this.speed =
                CONFIG.minSpeed +
                Math.random() *
                (
                    CONFIG.maxSpeed -
                    CONFIG.minSpeed
                );


            this.vx =
                (
                    Math.random() -
                    0.5
                ) * 0.16;


            this.drift =
                (
                    Math.random() -
                    0.8
                ) * 0.002;


            /*------------------------------------------
              ROTACIÓN
            ------------------------------------------*/

            this.rotation =
                Math.random() *
                Math.PI *
                8;


            this.rotationSpeed =
                CONFIG.minRotationSpeed +
                Math.random() *
                (
                    CONFIG.maxRotationSpeed -
                    CONFIG.minRotationSpeed
                );


            /*------------------------------------------
              OPACIDAD
            ------------------------------------------*/

            this.baseOpacity =
                CONFIG.minOpacity +
                Math.random() *
                (
                    CONFIG.maxOpacity -
                    CONFIG.minOpacity
                );


            /*------------------------------------------
              PROFUNDIDAD
            ------------------------------------------*/

            this.depth =
                0.54 +
                Math.random() *
                0.76;


            /*------------------------------------------
              MORPHING
            ------------------------------------------*/

            this.morphPhase =
                Math.random() *
                Math.PI *
                2;


            this.morphSpeed =
                CONFIG.morphSpeed *
                (
                    0.65 +
                    Math.random() * 0.7
                );


            /*
             * Cada vértice tiene su propio desfase.
             * Esto evita que todos se deformen
             * simultáneamente.
             */

            this.phaseA =
                Math.random() *
                Math.PI *
                2;

            this.phaseB =
                Math.random() *
                Math.PI *
                2;

            this.phaseC =
                Math.random() *
                Math.PI *
                2;


            /*
             * Variaciones individuales
             * de cada vértice.
             */

            this.vertexA =
                0.75 +
                Math.random() * 0.5;

            this.vertexB =
                0.75 +
                Math.random() * 0.5;

            this.vertexC =
                0.75 +
                Math.random() * 0.5;


            /*
             * Inclinación natural.
             */

            this.skewX =
                (
                    Math.random() -
                    0.5
                ) * 0.35;


            this.skewY =
                (
                    Math.random() -
                    0.5
                ) * 0.25;


            /*
             * Movimiento de respiración.
             */

            this.breathPhase =
                Math.random() *
                Math.PI *
                2;

        }


        /*==================================================
          CREAR VÉRTICES DEFORMADOS
        ==================================================*/

        getVertices() {

            const time =
                performance.now();


            /*
             * Tiempo individual del triángulo.
             */

            const t =
                time *
                this.morphSpeed +
                this.morphPhase;


            /*
             * Deformación independiente
             * para cada vértice.
             */

            const morphA =
                1 +
                Math.sin(
                    t +
                    this.phaseA
                ) *
                CONFIG.morphAmount;


            const morphB =
                1 +
                Math.sin(
                    t * 0.87 +
                    this.phaseB
                ) *
                CONFIG.morphAmount;


            const morphC =
                1 +
                Math.sin(
                    t * 1.13 +
                    this.phaseC
                ) *
                CONFIG.morphAmount;


            /*
             * Pequeña deformación lateral.
             */

            const bendX =
                Math.sin(t * 0.72) *
                this.width *
                0.12;


            const bendY =
                Math.cos(t * 0.61) *
                this.height *
                0.08;


            /*
             * VÉRTICE SUPERIOR
             */

            const A = {

                x:
                    Math.sin(t * 0.81) *
                    this.width *
                    0.08,

                y:
                    -this.height *
                    this.vertexA *
                    morphA

            };


            /*
             * VÉRTICE DERECHO
             */

            const B = {

                x:
                    this.width *
                    this.vertexB *
                    morphB +
                    bendX,

                y:
                    this.height *
                    0.54 +
                    bendY

            };


            /*
             * VÉRTICE IZQUIERDO
             */

            const C = {

                x:
                    -this.width *
                    this.vertexC *
                    morphC -
                    bendX * 0.7,

                y:
                    this.height *
                    0.35 -
                    bendY

            };


            /*
             * Inclinación general.
             */

            A.x +=
                this.skewX *
                this.width;

            B.x +=
                this.skewX *
                this.width;

            C.x +=
                this.skewX *
                this.width;


            A.y +=
                this.skewY *
                this.height;

            B.y +=
                this.skewY *
                this.height;

            C.y +=
                this.skewY *
                this.height;


            return [
                A,
                B,
                C
            ];

        }


        /*==================================================
          UPDATE
        ==================================================*/

        update() {

            /*
             * Movimiento vertical.
             */

            this.y -=
                this.speed *
                this.depth;


            /*
             * Movimiento horizontal.
             */

            this.vx +=
                this.drift;

            this.vx *=
                0.995;

            this.x +=
                this.vx;


            /*
             * Rotación.
             */

            this.rotation +=
                this.rotationSpeed;


            /*------------------------------------------
              INTERACCIÓN CON MOUSE
            ------------------------------------------*/

            if (
                mouse.x !== null &&
                mouse.y !== null
            ) {

                const dx =
                    this.x -
                    mouse.x;

                const dy =
                    this.y -
                    mouse.y;

                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if (
                    distance <
                    CONFIG.mouseDistance &&
                    distance > 0
                ) {

                    const force =
                        (
                            CONFIG.mouseDistance -
                            distance
                        ) /
                        CONFIG.mouseDistance;


                    const angle =
                        Math.atan2(
                            dy,
                            dx
                        );


                    this.x +=
                        Math.cos(angle) *
                        force *
                        CONFIG.mouseForce;


                    this.y +=
                        Math.sin(angle) *
                        force *
                        CONFIG.mouseForce;

                }

            }


            /*------------------------------------------
              REINGRESO POR ABAJO
            ------------------------------------------*/

            if (
                this.y <
                -this.height * 2
            ) {

                this.reset(false);

            }


            /*------------------------------------------
              LÍMITES HORIZONTALES
            ------------------------------------------*/

            if (
                this.x >
                width +
                this.width
            ) {

                this.x =
                    -this.width;

            }


            if (
                this.x <
                -this.width
            ) {

                this.x =
                    width +
                    this.width;

            }


            this.draw();

        }


        /*==================================================
          DRAW
        ==================================================*/

        draw() {

            const time =
                performance.now();


            /*
             * Variación de opacidad.
             */

            const breathing =
                Math.sin(
                    time * 0.001 +
                    this.breathPhase
                );


            const opacity =
                Math.max(
                    0,
                    this.baseOpacity +
                    breathing * 0.015
                );


            const vertices =
                this.getVertices();


            ctx.save();


            ctx.translate(
                this.x,
                this.y
            );


            ctx.rotate(
                this.rotation
            );


            /*
             * TRIÁNGULO
             */

            ctx.beginPath();


            ctx.moveTo(
                vertices[0].x,
                vertices[0].y
            );


            ctx.lineTo(
                vertices[1].x,
                vertices[1].y
            );


            ctx.lineTo(
                vertices[2].x,
                vertices[2].y
            );


            ctx.closePath();


            /*
             * COLOR EXACTO DE LA PÁGINA:
             *
             * #78B8F8
             *
             * RGB:
             * 120, 184, 248
             *
             * La diferencia visual viene
             * únicamente de la opacidad.
             */

            ctx.fillStyle =
                `rgba(${CONFIG.triangleColor},${opacity})`;


            /*
             * IMPORTANTE:
             *
             * No existe stroke.
             *
             * Por eso no aparecen líneas
             * internas ni bordes claros.
             */

            ctx.fill();


            ctx.restore();

        }

    }


    /*==================================================
      CREAR PARTICULAS
    ==================================================*/

    function initParticles() {

        particles = [];


        const calculatedCount =
            Math.floor(
                (width * height) /
                CONFIG.density
            );


        const count =
            Math.max(
                CONFIG.minParticles,
                calculatedCount
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            particles.push(
                new Particle(true)
            );

        }

    }


    /*==================================================
      CONEXIONES
    ==================================================*/

    function connectParticles() {

        if (
            mouse.x === null ||
            mouse.y === null
        ) {

            return;

        }


        const nearby = [];


        particles.forEach(
            (particle) => {

                const dx =
                    particle.x -
                    mouse.x;

                const dy =
                    particle.y -
                    mouse.y;

                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if (
                    distance <
                    CONFIG.maxDistance
                ) {

                    nearby.push({

                        particle,
                        distance

                    });

                }

            }
        );


        /*------------------------------------------
          CONEXIONES ENTRE TRIÁNGULOS
        ------------------------------------------*/

        for (
            let a = 0;
            a < nearby.length;
            a++
        ) {

            for (
                let b = a + 1;
                b < nearby.length;
                b++
            ) {

                const p1 =
                    nearby[a].particle;

                const p2 =
                    nearby[b].particle;


                const dx =
                    p1.x -
                    p2.x;

                const dy =
                    p1.y -
                    p2.y;


                const distance =
                    Math.sqrt(
                        dx * dx +
                        dy * dy
                    );


                if (
                    distance <
                    CONFIG.maxDistance
                ) {

                    const opacity =
                        (
                            1 -
                            distance /
                            CONFIG.maxDistance
                        ) * 0.42;


                    ctx.beginPath();


                    ctx.strokeStyle =
                        `rgba(156,204,250,${opacity})`;


                    ctx.lineWidth =
                        0.7;


                    ctx.moveTo(
                        p1.x,
                        p1.y
                    );


                    ctx.lineTo(
                        p2.x,
                        p2.y
                    );


                    ctx.stroke();

                }

            }

        }


        /*------------------------------------------
          CONEXIONES CON EL MOUSE
        ------------------------------------------*/

        nearby.forEach(
            (item) => {

                const particle =
                    item.particle;

                const distance =
                    item.distance;


                const opacity =
                    (
                        1 -
                        distance /
                        CONFIG.maxDistance
                    ) * 0.32;


                ctx.beginPath();


                ctx.strokeStyle =
                    `rgba(120,184,248,${opacity})`;


                ctx.lineWidth =
                    0.8;


                ctx.moveTo(
                    particle.x,
                    particle.y
                );


                ctx.lineTo(
                    mouse.x,
                    mouse.y
                );


                ctx.stroke();

            }
        );

    }


    /*==================================================
      ANIMACIÓN
    ==================================================*/

    function animate() {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        particles.forEach(
            particle =>
                particle.update()
        );


        connectParticles();


        requestAnimationFrame(
            animate
        );

    }


    /*==================================================
      INICIO
    ==================================================*/

    resizeCanvas();

    animate();

});