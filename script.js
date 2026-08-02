// ---------- Scroll progress : jauge + badge ----------

const setScrollProgress = () => {
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const scrollHeight = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
  const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
  document.documentElement.style.setProperty('--scroll', progress.toFixed(4));
 };

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => { setScrollProgress(); ticking = false; });
    ticking = true;
  }
});
setScrollProgress();

// ---------- Révélation au scroll ----------
const revealTargets = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
}, { threshold: 0.2 });
revealTargets.forEach((el) => revealObserver.observe(el));

// ---------- Sillage du curseur ----------
const canvas = document.getElementById('wake');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isFinePointer = window.matchMedia('(pointer: fine)').matches;

if (canvas && isFinePointer && !prefersReducedMotion) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
  resize();
  window.addEventListener('resize', resize);

  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    particles.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, life: 1 });
    if (particles.length > 40) particles.shift();
  });

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(140, 164, 189, ${p.life * 0.5})`;
      ctx.fill();
      p.life -= 0.03;
    });
    particles = particles.filter((p) => p.life > 0);
    requestAnimationFrame(draw);
  };
  draw();
}

// ---------- CTA final ----------
const ctaBtn = document.getElementById('ctaBtn');
const ctaReveal = document.getElementById('ctaReveal');
if (ctaBtn && ctaReveal) {
  ctaBtn.addEventListener('click', () => {
    const isEnglish = document.documentElement.lang === 'en';
    ctaReveal.textContent = isEnglish ? 'Ready to take off with AFS!' : 'Prête à décoller avec AFS !';
    ctaReveal.classList.add('is-shown');
  });
}

// ---------- Journal de bord ----------
const logbookBtn = document.getElementById('logbookBtn');
const logbookReveal = document.getElementById('logbookReveal');

const triggerLogbook = () => {
  logbookReveal.textContent = 'Prête à embarquer avec AFS !';
  logbookReveal.classList.add('is-shown');
  logbookBtn.setAttribute('aria-pressed', 'true');
};

if (logbookBtn && logbookReveal) {
  logbookBtn.addEventListener('click', triggerLogbook);
  logbookBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); triggerLogbook(); }
  });
}
