const contactReveal = document.querySelector('.contact-reveal');
const contactLightbar = document.querySelector('.contact-lightbar');
const contactLabel = document.querySelector('.contact-label');

if (contactReveal && contactLightbar) {
  [contactLightbar, contactLabel].filter(Boolean).forEach((trigger) => {
    trigger.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') {
        contactReveal.classList.add('is-hover-open');
      }
    });
  });

  contactLightbar.addEventListener('click', () => {
    const isOpen = contactReveal.classList.toggle('is-open');
    contactLightbar.setAttribute('aria-expanded', String(isOpen));
  });

  contactReveal.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;

    contactReveal.classList.remove('is-hover-open');
    contactReveal.classList.remove('is-open');
    contactLightbar.setAttribute('aria-expanded', 'false');

    if (document.activeElement === contactLightbar) {
      contactLightbar.blur();
    }
  });
}

const sectionNavLinks = [...document.querySelectorAll('.section-nav__link')];

const setActiveSection = (sectionId) => {
  sectionNavLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${sectionId}`;
    link.classList.toggle('is-active', isActive);

    if (isActive) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

sectionNavLinks.forEach((link) => {
  link.addEventListener('click', () => {
    setActiveSection(link.getAttribute('href').slice(1));
  });
});
