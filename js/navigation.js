document.addEventListener("DOMContentLoaded", () => {

    // ===========================
    // MENÚ HAMBURGUESA
    // ===========================

    const hamburger = document.getElementById("hamburger-btn");
    const menu = document.getElementById("header-menu");

    if (hamburger && menu) {

        hamburger.addEventListener("click", () => {

            // Abrir / cerrar menú
            menu.classList.toggle("active");

            // Animar el botón hamburguesa
            hamburger.classList.toggle("active");

            // Accesibilidad
            const expanded =
                hamburger.getAttribute("aria-expanded") === "true";

            hamburger.setAttribute(
                "aria-expanded",
                !expanded
            );

        });

        // ===========================
        // CERRAR MENÚ AL HACER CLIC EN UN ENLACE
        // ===========================

        const navLinks = document.querySelectorAll(".header__link");

        navLinks.forEach(link => {

            link.addEventListener("click", () => {

                menu.classList.remove("active");

                hamburger.classList.remove("active");

                hamburger.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

        // ===========================
        // RESETEAR MENÚ AL VOLVER A DESKTOP
        // ===========================

        window.addEventListener("resize", () => {

            if (window.innerWidth > 768) {

                menu.classList.remove("active");

                hamburger.classList.remove("active");

                hamburger.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        });

    }

    // ===========================
    // ENLACE ACTIVO
    // ===========================

    const currentPage = window.location.pathname.split("/").pop();

    const links = document.querySelectorAll(".header__link");

    links.forEach(link => {

        const href = link.getAttribute("href");

        if (href === currentPage) {

            link.classList.add("active");

        }

    });

});