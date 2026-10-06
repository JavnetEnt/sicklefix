const btn = document.getElementById('menuBtn');
const links = document.getElementById('links');

btn.onclick = () => {
  const open = links.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
};

const here = location.pathname.split('/').pop() || 'index.html';
links.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => links.classList.remove('open'));
  const target = a.getAttribute('href');
  if (target === here) a.setAttribute('aria-current', 'page');
});

if (here === 'water.html') {
  const c = links.querySelector('a[href="painlog.html"]');
  if (c) c.setAttribute('aria-current', 'page');
}

(function () {
  const m = new Date().getMonth();                       // 0 = January
  const force = location.search.includes('harmattan=1'); // for testing
  if (!(m >= 10 || m <= 2) && !force) return;            // November to March only

  const day = new Date().toDateString();
  try { if (localStorage.getItem('harmattanHidden') === day && !force) return; } catch (e) {}

  const bar = document.createElement('div');
  bar.className = 'season noprint';

  const text = document.createElement('span');
  text.textContent = 'Harmattan season: dry, cold air can trigger crises. Drink more water, moisturise, and keep warm, especially at night and early morning.';

  const link = document.createElement('a');
  link.href = 'water.html';
  link.textContent = 'Track your water';

  const x = document.createElement('button');
  x.textContent = '\u2715';
  x.setAttribute('aria-label', 'Dismiss');
  x.onclick = () => {
    bar.remove();
    try { localStorage.setItem('harmattanHidden', day); } catch (e) {}
  };

  bar.append(text, link, x);
  document.querySelector('.nav').insertAdjacentElement('afterend', bar);
})();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}