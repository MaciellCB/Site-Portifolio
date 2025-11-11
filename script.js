// script.js - uso mínimo de JS para:
// 1) abas "Serviços"
// 2) filtros que mostram/ocultam as seções (Todos, Sites, Desing, Arte Digital, Edição)
// 3) carrosséis por setas (translateX)
// 4) modal do Currículo

document.addEventListener("DOMContentLoaded", function(){

  /* --------- Abas de Serviços (simples) --------- */
  document.querySelectorAll(".tab-btn").forEach(btn=>{
    btn.addEventListener("click", function(){
      document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      document.querySelectorAll(".tab-pane").forEach(p=>p.classList.remove("active"));
      const pane = document.getElementById(tab);
      if(pane) pane.classList.add("active");
    });
  });

  /* --------- Filtros de Experiências (mostra/oculta seções) --------- */
  const filters = document.querySelectorAll(".exp-filter");
  const sections = document.querySelectorAll(".type-section");

  filters.forEach(f=>{
    f.addEventListener("click", function(){
      filters.forEach(x=>x.classList.remove("active"));
      f.classList.add("active");

      const type = f.dataset.filter; // 'all' | 'sites' | 'desing' | 'arte' | 'edicao'
      sections.forEach(sec=>{
        const secType = sec.getAttribute("data-type");
        if(type === 'all' || secType === type){
          sec.style.display = ""; // mostrar
        } else {
          sec.style.display = "none"; // ocultar
        }
      });
      // ao trocar filtro, resetamos todos os carrosséis para posição 0 (boa UX)
      document.querySelectorAll(".carousel-track").forEach(t => t.style.transform = "translateX(0)");
    });
  });

  /* --------- Carrossel (cada .carousel tem setas prev/next) --------- */
  document.querySelectorAll(".carousel").forEach(car => {
    const track = car.querySelector(".carousel-track");
    const prev = car.querySelector("[data-action='prev']");
    const next = car.querySelector("[data-action='next']");
    const viewport = car.querySelector(".carousel-viewport");
    if(!track || !viewport) {
      if(prev) prev.style.display = "none";
      if(next) next.style.display = "none";
      return;
    }
    const cards = Array.from(track.children);
    let index = 0;
    const gap = 18;

    function computeStep(){
      const vpWidth = viewport.getBoundingClientRect().width;
      const cardW = cards[0].getBoundingClientRect().width;
      return Math.max(1, Math.floor((vpWidth + gap) / (cardW + gap)));
    }

    function update(){
      const step = computeStep();
      const maxIndex = Math.max(0, cards.length - step);
      if(index < 0) index = 0;
      if(index > maxIndex) index = maxIndex;
      const cardW = cards[0].getBoundingClientRect().width;
      const translateX = index * (cardW + gap);
      track.style.transform = `translateX(-${translateX}px)`;
      prev.style.visibility = index === 0 ? 'hidden' : 'visible';
      next.style.visibility = index >= maxIndex ? 'hidden' : 'visible';
    }

    prev && prev.addEventListener("click", ()=> { index = Math.max(0, index - computeStep()); update(); });
    next && next.addEventListener("click", ()=> { index = index + computeStep(); update(); });

    window.addEventListener("resize", ()=> setTimeout(update, 80));
    setTimeout(update, 120);
  });

  /* --------- Modal do Currículo (abrir/fechar) --------- */
  const navCurr = document.getElementById("nav-curriculo");
  const modal = document.getElementById("cv-modal");
  const close = document.getElementById("cv-close");
  if(navCurr && modal){
    navCurr.addEventListener("click", function(e){
      e.preventDefault();
      modal.setAttribute("aria-hidden","false");
    });
  }
  if(close){
    close.addEventListener("click", ()=> modal.setAttribute("aria-hidden","true"));
  }
  if(modal){
    modal.addEventListener("click", (ev)=> { if(ev.target === modal) modal.setAttribute("aria-hidden","true"); });
  }

  /* --------- ano no rodapé --------- */
  const y = new Date().getFullYear();
  const el = document.getElementById("year");
  if(el) el.textContent = y;
});
