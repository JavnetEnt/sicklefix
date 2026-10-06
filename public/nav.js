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

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}