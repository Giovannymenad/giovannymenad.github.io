gsap.registerPlugin(ScrollTrigger);

const section = document.querySelector(".projects");
const viewport = document.querySelector(".projects__viewport");
const sticky = document.querySelector(".projects__sticky");
const cards = gsap.utils.toArray(".project-card");

let mm = gsap.matchMedia();

// Creamos las reglas para cada una de tus 5 medidas responsive
mm.add({
  isDesktop: "(min-width: 1025px)",
  isTabletLand: "(max-width: 1024px) and (min-width: 769px)",
  isTabletPort: "(max-width: 768px) and (min-width: 426px)",
  isMobileLarge: "(max-width: 425px) and (min-width: 376px)",
  isMobileMedium: "(max-width: 375px) and (min-width: 321px)",
  isMobileSmall: "(max-width: 320px)"
}, (context) => {
  let { isDesktop, isTabletLand, isTabletPort, isMobileLarge, isMobileMedium, isMobileSmall } = context.conditions;

  // 1. OBTENER LA ALTURA DE LA TARJETA
  const cardHeight = cards[0].offsetHeight;

  // 2. CONFIGURAR VALORES PASO A PASO PARA CADA UNA DE TUS MEDIDAS
  let gap, extraSpace;

  if (isDesktop) {
    gap = 108;
    extraSpace = 60;
  } 
  else if (isTabletLand) { // <= 1024px
    gap = 40;
    extraSpace = 310; 
  } 
  else if (isTabletPort) { // <= 768px
    gap = 30; // Puedes ajustar este espacio entre tarjetas para tablet
    extraSpace = 160; 
  } 
  else if (isMobileLarge) { // <= 425px
    gap = 20; // Espacio más pequeño para móviles grandes
    extraSpace = 50; 
  } 
  else if (isMobileMedium) { // <= 375px
    gap = 10;
    extraSpace = 208; 
  } 
  else if (isMobileSmall) { // <= 320px
    gap = 4;
    extraSpace = 280; 
  }

  const step = cardHeight + gap;

  // 3. APLICAR LA ALTURA DINÁMICA CALCULADA AL VIEWPORT
  viewport.style.height = `${window.innerHeight + (cards.length * step) + extraSpace}px`;

  // 4. EJECUTAR ANIMACIÓN DE GSAP
  cards.forEach((card, index) => {
    gsap.set(card, {
      y: index * step,
      zIndex: index + 1
    });
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${cards.length * step}`,
      pin: sticky,
      pinSpacing: true,
      scrub: 1,
      invalidateOnRefresh: true
    }
  });

  cards.forEach((card, index) => {
    if (index === 0) return;
    tl.to(card, {
      y: 0,
      duration: 1
    });
  });
});

// El listener de resize ya no es necesario porque GSAP MatchMedia vigila los cambios de pantalla automáticamente.
