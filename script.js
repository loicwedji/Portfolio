const header = document.getElementById('header');
const menuButton = document.querySelector('.menu-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = [...document.querySelectorAll('.nav-center a')];
const sections = [...document.querySelectorAll('main section[id]')];
const revealItems = document.querySelectorAll('.reveal');

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 24);

  const current = sections
    .filter((section) => section.getBoundingClientRect().top <= 180)
    .at(-1);

  navLinks.forEach((link) => {
    link.classList.toggle(
      'active',
      current && link.getAttribute('href') === `#${current.id}`,
    );
  });
}

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  navMenu.classList.remove('open');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  navMenu.classList.toggle('open', !isOpen);
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMenu();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

revealItems.forEach((item) => revealObserver.observe(item));
updateHeader();
