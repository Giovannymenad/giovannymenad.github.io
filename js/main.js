document.addEventListener("DOMContentLoaded", () => {

});

/* ==================================================
   PROTECCIÓN CONTRA COPIA Y ARRASTRE (PEGAR AQUÍ ABAJO)
================================================== */
document.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && ['c', 'C', 'u', 'U', 's', 'S'].includes(e.key)) {
    e.preventDefault();
  }
});

document.addEventListener('copy', (e) => e.preventDefault());

document.addEventListener('dragstart', (e) => {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});