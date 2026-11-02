const slides = [...document.querySelectorAll('.slide')];
const dotsBox = document.getElementById('dots');
const hero = document.querySelector('.hero');
let cur = 0, timer;

if (slides.length) {
  slides.forEach((s, i) => {
    if (s.dataset.img) s.style.backgroundImage = 'url(' + s.dataset.img + ')';
    const d = document.createElement('button');
    d.setAttribute('aria-label', 'Show slide ' + (i + 1));
    d.onclick = () => { show(i); restart(); };
    dotsBox.appendChild(d);
  });

  function show(n) {
    cur = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('on', i === cur));
    [...dotsBox.children].forEach((d, i) => d.classList.toggle('on', i === cur));
  }
  function restart() {
    clearInterval(timer);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer = setInterval(() => show(cur + 1), 5500);
    }
  }

  hero.querySelector('.prev').onclick = () => { show(cur - 1); restart(); };
  hero.querySelector('.next').onclick = () => { show(cur + 1); restart(); };
  hero.addEventListener('mouseenter', () => clearInterval(timer));
  hero.addEventListener('mouseleave', restart);
  show(0);
  restart();
}

