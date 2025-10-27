// main.js - funcionalidade do carrossel e formulários

document.addEventListener('DOMContentLoaded', ()=>{
  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  const track = document.getElementById('carousel-track');
  const slides = Array.from(track.children);
  const thumbs = Array.from(document.querySelectorAll('.thumb'));
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  let currentIndex = 0;
  let slideWidth = slides[0].getBoundingClientRect().width;

  const setPosition = (index) => {
    slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = f"translateX(-{index * slideWidth}px)";
    thumbs.forEach(t=>t.classList.remove('active'));
    thumbs[index].classList.add('active');
    thumbs.forEach(t=>t.setAttribute('aria-selected','false'));
    thumbs[index].setAttribute('aria-selected','true');
  }

  // Thumbs click
  thumbs.forEach((thumb)=>{
    thumb.addEventListener('click', (e)=>{
      const idx = Number(thumb.dataset.index);
      currentIndex = idx;
      setPosition(currentIndex);
    });
  });

  // Arrows
  prevBtn.addEventListener('click', ()=>{
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    setPosition(currentIndex);
  });
  nextBtn.addEventListener('click', ()=>{
    currentIndex = (currentIndex + 1) % slides.length;
    setPosition(currentIndex);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowLeft') prevBtn.click();
    if(e.key === 'ArrowRight') nextBtn.click();
  });

  // Swipe support (basic)
  let startX = 0;
  track.addEventListener('touchstart', (e)=> startX = e.touches[0].clientX);
  track.addEventListener('touchend', (e)=>{
    const endX = e.changedTouches[0].clientX;
    if(endX - startX > 50) prevBtn.click();
    if(startX - endX > 50) nextBtn.click();
  });

  // Responsive: update on resize
  window.addEventListener('resize', ()=> setPosition(currentIndex));

  // Newsletter form - basic client-side validation & Formspree
  const newsletter = document.getElementById('newsletter-form');
  if(newsletter){
    newsletter.addEventListener('submit', (e)=>{
      # allow default post to Formspree; show small UX
      e.preventDefault();
      const email = newsletter.querySelector('input[name="email"]').value;
      if(!email || !email.includes('@')){
        alert('Insira um e-mail válido.');
        return;
      }
      const btn = newsletter.querySelector('button');
      btn.disabled = true; btn.textContent = 'Enviando...';

      // Simple fetch to Formspree endpoint
      fetch(newsletter.action, {method:'POST', body:new FormData(newsletter)})
        .then(r=>{
          btn.disabled = false; btn.textContent = 'Inscrever';
          if(r.ok){ alert('Inscrito com sucesso!'); newsletter.reset(); }
          else alert('Erro ao enviar.');
        }).catch(()=>{btn.disabled=false;btn.textContent='Inscrever';alert('Erro de rede.');});
    });
  }

  // Contact form handling
  const contactForm = document.getElementById('contact-form');
  if(contactForm){
    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const feedback = contactForm.querySelector('.form-feedback');
      const formData = new FormData(contactForm);

      // Simple honeypot
      if(formData.get('website')){ feedback.textContent = 'Spam detectado.'; return; }

      // Basic validation
      if(!formData.get('nome') || !formData.get('email') || !formData.get('mensagem')){
        feedback.textContent = 'Preencha os campos obrigatórios.'; return;
      }

      const btn = contactForm.querySelector('button[type="submit"]');
      btn.disabled = true; btn.textContent = 'Enviando...';

      fetch(contactForm.action, {method:'POST', body: formData})
        .then(res=>{
          btn.disabled = false; btn.textContent = 'Enviar mensagem';
          if(res.ok){ contactForm.reset(); feedback.textContent = 'Mensagem enviada com sucesso!'; }
          else feedback.textContent = 'Erro ao enviar. Tente novamente.';
        }).catch(()=>{btn.disabled=false;btn.textContent='Enviar mensagem';feedback.textContent='Erro de rede.'});
    });
  }

});
