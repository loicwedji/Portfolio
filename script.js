if (!document.querySelector('.contact-dock')) {
  const contactDock = document.createElement('footer');
  contactDock.className = 'contact-dock';
  contactDock.setAttribute('aria-label', 'Contact');
  contactDock.innerHTML = `
    <div class="contact-reveal">
      <div class="contact-links" id="contact-details">
        <a class="contact-link contact-link--filled" href="https://linkedin.com/in/loic-wedji" target="_blank" rel="noopener noreferrer" aria-label="Open LinkedIn profile" title="LinkedIn">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.25H3.25V21H6.5V8.25ZM4.88 3A1.88 1.88 0 1 0 4.88 6.75 1.88 1.88 0 0 0 4.88 3ZM21 13.7C21 9.86 18.95 8.08 16.22 8.08c-2.2 0-3.19 1.21-3.74 2.06V8.25H9.23V21h3.25v-6.31c0-1.66.31-3.27 2.37-3.27 2.03 0 2.06 1.9 2.06 3.38V21H21v-7.3Z"/></svg>
        </a>
        <a class="contact-link contact-link--filled" href="https://github.com/loicwedji" target="_blank" rel="noopener noreferrer" aria-label="Open GitHub profile" title="GitHub">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49v-1.91c-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.95a9.3 9.3 0 0 1 2.5.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9v2.79c0 .27.18.59.69.49A10.24 10.24 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z"/></svg>
        </a>
        <a class="contact-link contact-link--email" href="mailto:loicwedji@gmail.com" aria-label="Email Loic Wedji" title="Email">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>
        </a>
      </div>
      <p class="contact-label">Contact</p>
      <button class="contact-lightbar" type="button" aria-controls="contact-details" aria-expanded="false"><span class="visually-hidden">Show contact details</span></button>
    </div>`;
  document.body.append(contactDock);
}

const contactReveal = document.querySelector('.contact-reveal');
const contactLightbar = document.querySelector('.contact-lightbar');
const contactLabel = document.querySelector('.contact-label');
const contactDockElement = document.querySelector('.contact-dock');

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

    contactReveal.classList.remove('is-hover-open', 'is-open');
    contactLightbar.setAttribute('aria-expanded', 'false');

    if (document.activeElement === contactLightbar) {
      contactLightbar.blur();
    }
  });
}

if (contactDockElement) {
  let contactFadeTimer;

  const hideContactDockWhileScrolling = () => {
    contactDockElement.classList.add('is-scrolling');
    contactReveal?.classList.remove('is-hover-open', 'is-open');
    contactLightbar?.setAttribute('aria-expanded', 'false');

    window.clearTimeout(contactFadeTimer);
    contactFadeTimer = window.setTimeout(() => {
      contactDockElement.classList.remove('is-scrolling');
    }, 240);
  };

  window.addEventListener('scroll', hideContactDockWhileScrolling, { passive: true });
}

const sectionNav = document.querySelector('.section-nav');
const sectionNavLinks = [...document.querySelectorAll('.section-nav__link')];

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const isSinglePageNav = sectionNavLinks.some((link) => link.dataset.section);
const pageSections = isSinglePageNav
  ? sectionNavLinks.map((link) => document.getElementById(link.dataset.section)).filter(Boolean)
  : [];
let currentNavLink = isSinglePageNav
  ? sectionNavLinks.find((link) => link.dataset.section === (window.location.hash.slice(1) || 'home')) || sectionNavLinks[0]
  : sectionNavLinks.find((link) => link.dataset.page === currentPage);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let previousPage = null;

if (!isSinglePageNav) {
  try {
    previousPage = sessionStorage.getItem('portfolio-previous-page');
    sessionStorage.removeItem('portfolio-previous-page');
  } catch {
    previousPage = null;
  }
}

let navIndicator = null;

if (sectionNav && sectionNavLinks.length) {
  navIndicator = document.createElement('span');
  navIndicator.className = 'section-nav__indicator';
  navIndicator.setAttribute('aria-hidden', 'true');
  sectionNav.append(navIndicator);
  sectionNav.classList.add('has-indicator');
}

const moveNavIndicator = (link) => {
  if (!navIndicator) return;

  if (!link) {
    sectionNav.style.setProperty('--nav-indicator-size', '0px');
    return;
  }

  const isStacked = window.matchMedia('(max-width: 900px)').matches;

  sectionNav.style.setProperty('--nav-indicator-pos', `${isStacked ? link.offsetLeft : link.offsetTop}px`);
  sectionNav.style.setProperty('--nav-indicator-size', `${isStacked ? link.offsetWidth : link.offsetHeight}px`);
};

const setActiveNavLink = (link) => {
  sectionNavLinks.forEach((navLink) => {
    const isActive = navLink === link;
    navLink.classList.toggle('is-active', isActive);

    if (isActive) {
      navLink.setAttribute('aria-current', isSinglePageNav ? 'location' : 'page');
    } else {
      navLink.removeAttribute('aria-current');
    }
  });

  moveNavIndicator(link);
};

const previousNavLink = isSinglePageNav
  ? null
  : sectionNavLinks.find((link) => link.dataset.page === previousPage);

if (previousNavLink && previousNavLink !== currentNavLink && !prefersReducedMotion) {
  setActiveNavLink(previousNavLink);
  requestAnimationFrame(() => {
    sectionNav.classList.add('is-ready');
    requestAnimationFrame(() => {
      sectionNav.classList.add('is-transitioning');
      setActiveNavLink(currentNavLink);
    });
  });
} else {
  setActiveNavLink(currentNavLink);

  if (sectionNav && !prefersReducedMotion) {
    requestAnimationFrame(() => sectionNav.classList.add('is-ready'));
  }
}

sectionNavLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (isSinglePageNav) {
      const target = document.getElementById(link.dataset.section);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', `#${target.id}`);
      currentNavLink = link;
      setActiveNavLink(link);
      return;
    }

    if (link === currentNavLink) return;

    try {
      sessionStorage.setItem('portfolio-previous-page', currentPage);
    } catch {
      // Navigation still works when session storage is unavailable.
    }
  });
});

if (isSinglePageNav && 'IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleSection) return;

    const link = sectionNavLinks.find((item) => item.dataset.section === visibleSection.target.id);
    if (!link || link === currentNavLink) return;

    currentNavLink = link;
    setActiveNavLink(link);
    history.replaceState(null, '', `#${visibleSection.target.id}`);
  }, { threshold: [0.35, 0.6] });

  pageSections.forEach((section) => sectionObserver.observe(section));
}

window.addEventListener('resize', () => {
  if (!sectionNav) return;

  sectionNav.classList.remove('is-ready');
  moveNavIndicator(currentNavLink);

  if (!prefersReducedMotion) {
    requestAnimationFrame(() => sectionNav.classList.add('is-ready'));
  }
});

window.addEventListener('pageshow', () => {
  setActiveNavLink(currentNavLink);
});
