document.addEventListener("DOMContentLoaded", () => {

    const indexButton = document.querySelector(".case-index-toggle");
    const indexPanel = document.querySelector(".case-index");
    const closeButton = document.querySelector(".case-index__close");

    if (!indexButton) return;


    /*==================================================
      ABRIR / CERRAR ÍNDICE
    ==================================================*/

    indexButton.addEventListener("click", (event) => {

        event.stopPropagation();

        if (!indexPanel) return;

        const isOpen =
            indexPanel.classList.contains("is-open");


        if (isOpen) {

            indexPanel.classList.remove("is-open");

            indexButton.setAttribute(
                "aria-expanded",
                "false"
            );

        } else {

            indexPanel.classList.add("is-open");

            indexButton.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    });


    /*==================================================
      BOTÓN CERRAR
    ==================================================*/

    if (closeButton) {

        closeButton.addEventListener("click", (event) => {

            event.stopPropagation();

            indexPanel.classList.remove("is-open");

            indexButton.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    }


    /*==================================================
      CERRAR AL HACER CLICK FUERA
    ==================================================*/

    document.addEventListener("click", (event) => {

        if (!indexPanel) return;


        if (
            !indexPanel.contains(event.target) &&
            !indexButton.contains(event.target)
        ) {

            indexPanel.classList.remove("is-open");

            indexButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });


    /*==================================================
      CERRAR CON ESC
    ==================================================*/

    document.addEventListener("keydown", (event) => {

        if (event.key !== "Escape") return;

        if (!indexPanel) return;

        indexPanel.classList.remove("is-open");

        indexButton.setAttribute(
            "aria-expanded",
            "false"
        );

    });


    /*==================================================
      CERRAR DESPUÉS DE SELECCIONAR UNA SECCIÓN
    ==================================================*/

    if (indexPanel) {

        const links =
            indexPanel.querySelectorAll("a");


        links.forEach((link) => {

            link.addEventListener("click", () => {

                indexPanel.classList.remove("is-open");

                indexButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }

});