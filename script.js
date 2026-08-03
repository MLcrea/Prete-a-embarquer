// ---------- Scroll progress : jauge ----------
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

// ---------- Bouton commande : révèle le téléphone ----------
const orderBtn = document.getElementById('orderBtn');
const orderBtnText = document.getElementById('orderBtnText');

const triggerOrder = () => {
  const isEnglish = document.documentElement.lang === 'en';
  orderBtnText.innerHTML = isEnglish
    ? '<a>Give me a call<br>at 06 62 25 62 34!</a>'
    : '<a>Passez commande<br>au 06 62 25 62 34 !</a>';
  orderBtn.setAttribute('aria-pressed', 'true');
};

if (orderBtn && orderBtnText) {
  orderBtn.addEventListener('click', triggerOrder);
  orderBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); triggerOrder(); }
  });
}
