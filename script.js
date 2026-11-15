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
  const contactCollisionTargets = [
    ...document.querySelectorAll('main h1, main h2, main h3, main p, main li'),
  ];

  const updateContactDockVisibility = () => {
    const rootFontSize = Number.parseFloat(
      window.getComputedStyle(document.documentElement).fontSize,
    );
    const contactClearance = 8.5 * rootFontSize;
    const revealRect = contactReveal?.getBoundingClientRect();
    const protectedArea = {
      top: window.innerHeight - contactClearance,
      right: revealRect?.right ?? window.innerWidth,
      bottom: window.innerHeight,
      left: revealRect?.left ?? 0,
    };

    const overlapsText = contactCollisionTargets.some((element) => {
      const style = window.getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden') return false;

      const rect = element.getBoundingClientRect();
      return (
        rect.bottom > protectedArea.top &&
        rect.top < protectedArea.bottom &&
        rect.right > protectedArea.left &&
        rect.left < protectedArea.right
      );
    });

    contactDockElement.classList.toggle('is-obstructed', overlapsText);

    if (overlapsText) {
      contactReveal?.classList.remove('is-hover-open', 'is-open');
      contactLightbar?.setAttribute('aria-expanded', 'false');
    }
  };

  const hideContactDockWhileScrolling = () => {
    contactDockElement.classList.add('is-scrolling');
    contactReveal?.classList.remove('is-hover-open', 'is-open');
    contactLightbar?.setAttribute('aria-expanded', 'false');

    window.clearTimeout(contactFadeTimer);
    contactFadeTimer = window.setTimeout(() => {
      updateContactDockVisibility();
      contactDockElement.classList.remove('is-scrolling');
    }, 240);
  };

  window.addEventListener('scroll', hideContactDockWhileScrolling, { passive: true });
  window.addEventListener('resize', updateContactDockVisibility, { passive: true });
  window.addEventListener('load', updateContactDockVisibility);
  document.fonts?.ready.then(updateContactDockVisibility);
  window.requestAnimationFrame(updateContactDockVisibility);
}

const touchHoverQuery = window.matchMedia('(hover: none)');
const touchHoverTargets = '.experience-item, .skill-list li';
const activeTouchHoverTargets =
  '.experience-item.is-touch-active, .skill-list li.is-touch-active';

document.addEventListener('click', (event) => {
  if (!touchHoverQuery.matches) return;

  const tappedTarget = event.target.closest(touchHoverTargets);
  const activeTargets = document.querySelectorAll(activeTouchHoverTargets);

  activeTargets.forEach((target) => {
    if (target !== tappedTarget) target.classList.remove('is-touch-active');
  });

  tappedTarget?.classList.toggle('is-touch-active');
});

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
let isNavScrollInProgress = false;
let navScrollEndTimer;

if (!isSinglePageNav) {
  try {
    previousPage = sessionStorage.getItem('portfolio-previous-page');
    sessionStorage.removeItem('portfolio-previous-page');
  } catch {
    previousPage = null;
  }
}

let navIndicator = null;
let indicatorDrag = null;

if (sectionNav && sectionNavLinks.length) {
  navIndicator = document.createElement('span');
  navIndicator.className = 'section-nav__indicator';
  navIndicator.setAttribute('aria-hidden', 'true');
  sectionNav.append(navIndicator);
  sectionNav.classList.add('has-indicator');
}

const moveNavIndicator = (link) => {
  if (!navIndicator || indicatorDrag) return;

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

// Scrub the page by dragging only the glowing navigation indicator.
if (navIndicator && isSinglePageNav) {
  navIndicator.classList.add('is-draggable');
  navIndicator.title = 'Drag to scroll the page';

  navIndicator.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0 || indicatorDrag) return;
    event.preventDefault();
    const horizontal = window.matchMedia('(max-width: 900px)').matches;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const points = sectionNavLinks.map((link) => ({
      position: horizontal ? link.offsetLeft : link.offsetTop,
      size: horizontal ? link.offsetWidth : link.offsetHeight,
      scroll: Math.min(maxScroll, Math.max(0,
        document.getElementById(link.dataset.section).getBoundingClientRect().top + window.scrollY)),
      link,
    }));
    points[0].scroll = 0;
    points[points.length - 1].scroll = maxScroll;
    indicatorDrag = {
      pointerId: event.pointerId,
      horizontal,
      origin: horizontal ? event.clientX : event.clientY,
      position: Number.parseFloat(sectionNav.style.getPropertyValue('--nav-indicator-pos')) || 0,
      points,
    };
    window.clearTimeout(navScrollEndTimer);
    isNavScrollInProgress = false;
    document.documentElement.classList.remove('is-nav-scrolling');
    document.documentElement.classList.add('is-nav-scrubbing');
    sectionNav.classList.add('is-scrubbing');
    navIndicator.setPointerCapture(event.pointerId);
    // Stop any smooth navigation still in flight.
    window.scrollTo({ top: window.scrollY, behavior: 'instant' });
  });

  navIndicator.addEventListener('pointermove', (event) => {
    if (!indicatorDrag || event.pointerId !== indicatorDrag.pointerId) return;
    const { horizontal, origin, position, points } = indicatorDrag;
    const coordinate = horizontal ? event.clientX : event.clientY;
    const next = Math.max(points[0].position,
      Math.min(points[points.length - 1].position, position + coordinate - origin));
    let index = points.findIndex((point) => point.position >= next);
    index = Math.max(1, index);
    const start = points[index - 1];
    const end = points[index];
    const progress = (next - start.position) / (end.position - start.position || 1);
    const scroll = start.scroll + (end.scroll - start.scroll) * progress;
    window.scrollTo({ top: scroll, behavior: 'instant' });
    sectionNav.style.setProperty('--nav-indicator-pos', `${next}px`);
    sectionNav.style.setProperty('--nav-indicator-size', `${start.size + (end.size - start.size) * progress}px`);
    currentNavLink = progress < 0.5 ? start.link : end.link;
    setActiveNavLink(currentNavLink);
  });

  const finishIndicatorDrag = (event) => {
    if (!indicatorDrag || (event.pointerId != null && event.pointerId !== indicatorDrag.pointerId)) return;
    const { pointerId } = indicatorDrag;
    indicatorDrag = null;
    sectionNav.classList.remove('is-scrubbing');
    document.documentElement.classList.remove('is-nav-scrubbing');
    moveNavIndicator(currentNavLink);
    if (navIndicator.hasPointerCapture(pointerId)) navIndicator.releasePointerCapture(pointerId);
  };
  navIndicator.addEventListener('pointerup', finishIndicatorDrag);
  navIndicator.addEventListener('pointercancel', finishIndicatorDrag);
  navIndicator.addEventListener('lostpointercapture', finishIndicatorDrag);
  window.addEventListener('blur', finishIndicatorDrag);
  window.addEventListener('resize', finishIndicatorDrag);

}

const finishNavScroll = () => {
  if (!isNavScrollInProgress) return;

  isNavScrollInProgress = false;
  document.documentElement.classList.remove('is-nav-scrolling');
};

const scheduleNavScrollEnd = () => {
  if (!isNavScrollInProgress) return;

  window.clearTimeout(navScrollEndTimer);
  navScrollEndTimer = window.setTimeout(finishNavScroll, 140);
};

window.addEventListener('scroll', scheduleNavScrollEnd, { passive: true });

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
      document.documentElement.classList.remove('is-nav-scrubbing');
      const target = document.getElementById(link.dataset.section);
      if (!target) return;

      event.preventDefault();
      if (!prefersReducedMotion) {
        isNavScrollInProgress = true;
        document.documentElement.classList.add('is-nav-scrolling');
        window.clearTimeout(navScrollEndTimer);
        navScrollEndTimer = window.setTimeout(finishNavScroll, 1000);
      }
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
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
    if (isNavScrollInProgress || indicatorDrag || document.documentElement.classList.contains('is-nav-scrubbing')) return;

    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleSection) return;

    const link = sectionNavLinks.find((item) => item.dataset.section === visibleSection.target.id);
    if (!link || link === currentNavLink) return;

    currentNavLink = link;
    setActiveNavLink(link);
  }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });

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

// Mobile browser toolbars resize the visual viewport during a swipe. Keep
// section geometry tied to the small viewport so snap targets stay stationary.
const layoutViewportProbe = document.createElement('div');
layoutViewportProbe.setAttribute('aria-hidden', 'true');
layoutViewportProbe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none;';
document.body.append(layoutViewportProbe);
const getLayoutViewportHeight = () => layoutViewportProbe.getBoundingClientRect().height || window.innerHeight;

const observeLayoutViewport = (update) => {
  let frame;
  let previousSize = '';
  const schedule = (force = false) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const size = `${document.documentElement.clientWidth}:${getLayoutViewportHeight()}`;
      if (!force && size === previousSize) return;
      previousSize = size;
      update();
    });
  };
  window.addEventListener('resize', () => schedule(), { passive: true });
  window.visualViewport?.addEventListener('resize', () => schedule(), { passive: true });
  window.addEventListener('load', () => schedule(true));
  document.fonts?.ready.then(() => schedule(true));
  schedule(true);
};

// Prefer full descriptions and normal spacing; reduce only what cannot fit.
const experienceSection = document.querySelector('#experience');
if (experienceSection) {
  const inner = experienceSection.querySelector('.section-inner');
  const summaries = [...experienceSection.querySelectorAll('[data-compact-summary]')];
  const fullDescriptions = summaries.map((element) => element.textContent);

  const fitExperience = () => {
    experienceSection.style.removeProperty('--experience-content-height');
    experienceSection.classList.remove('is-compact');
    summaries.forEach((element, index) => {
      element.textContent = fullDescriptions[index];
    });

    const fits = () => {
      const style = getComputedStyle(experienceSection);
      const availableHeight = getLayoutViewportHeight();
      return inner.getBoundingClientRect().height
        + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
        <= availableHeight;
    };

    if (!fits()) experienceSection.classList.add('is-compact');
    if (!fits()) {
      summaries.forEach((element) => {
        element.textContent = element.dataset.compactSummary;
      });
    }

    // Fill spare space between the heading and the protected contact area.
    // Measure natural content first so stretching never triggers summarization.
    if (fits()) {
      const style = getComputedStyle(experienceSection);
      const availableHeight = getLayoutViewportHeight();
      const contentHeight = availableHeight
        - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      experienceSection.style.setProperty('--experience-content-height', `${contentHeight}px`);
    }
  };

  observeLayoutViewport(fitExperience);
}

// Keep the overview when it fits; use one selectable tile otherwise.
const projectsSection = document.querySelector('#projects');
if (projectsSection) {
  const inner = projectsSection.querySelector('.section-inner');
  const grid = projectsSection.querySelector('.project-grid');
  const tiles = [...grid.querySelectorAll('.project-tile')];
  const tabs = document.createElement('div');
  tabs.className = 'project-tabs';
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'Choose a project');
  tabs.hidden = true;
  grid.before(tabs);
  let selected = 0;

  const buttons = tiles.map((tile, index) => {
    tile.id = `project-panel-${index}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'project-tab';
    button.id = `project-tab-${index}`;
    button.textContent = tile.querySelector('h3').textContent.replace(/\s*\u2197\s*$/, '').trim();
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', tile.id);
    button.addEventListener('click', () => selectProject(index));
    button.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tiles.length;
      if (event.key === 'ArrowLeft') next = (index + tiles.length - 1) % tiles.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tiles.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectProject(next);
      buttons[next].focus();
    });
    tabs.append(button);
    return button;
  });

  function selectProject(index) {
    selected = index;
    tiles.forEach((tile, i) => {
      tile.hidden = i !== selected;
      buttons[i].setAttribute('aria-selected', String(i === selected));
      buttons[i].tabIndex = i === selected ? 0 : -1;
    });
  }

  const fitProjects = () => {
    projectsSection.classList.remove('is-project-switcher');
    projectsSection.style.removeProperty('--project-preview-height');
    projectsSection.style.removeProperty('--project-body-height');
    tabs.hidden = true;
    tiles.forEach((tile) => {
      tile.hidden = false;
      tile.removeAttribute('role');
      tile.removeAttribute('aria-labelledby');
    });
    const viewportHeight = getLayoutViewportHeight();
    let style = getComputedStyle(projectsSection);
    const fullHeight = inner.getBoundingClientRect().height
      + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    if (fullHeight <= viewportHeight) return;

    projectsSection.classList.add('is-project-switcher');
    tabs.hidden = false;
    style = getComputedStyle(projectsSection);
    const bodyHeight = Math.max(...tiles.map((tile) =>
      tile.querySelector('.project-tile__body').getBoundingClientRect().height));
    projectsSection.style.setProperty('--project-body-height', `${bodyHeight}px`);
    const heading = inner.querySelector('.section-title');
    const headingStyle = getComputedStyle(heading);
    const tabsStyle = getComputedStyle(tabs);
    const previewHeight = viewportHeight - parseFloat(style.paddingTop)
      - parseFloat(style.paddingBottom) - heading.getBoundingClientRect().height
      - parseFloat(headingStyle.marginBottom) - tabs.getBoundingClientRect().height
      - parseFloat(tabsStyle.marginBottom) - bodyHeight - 3;
    projectsSection.style.setProperty('--project-preview-height', `${Math.max(0, Math.floor(previewHeight))}px`);
    tiles.forEach((tile, index) => {
      tile.setAttribute('role', 'tabpanel');
      tile.setAttribute('aria-labelledby', buttons[index].id);
    });
    selectProject(selected);
  };

  observeLayoutViewport(fitProjects);
}

// Preserve every skill, tightening badges only when the natural layout is too tall.
const skillsSection = document.querySelector('#technical-skills');
if (skillsSection) {
  const inner = skillsSection.querySelector('.section-inner');
  const fitSkills = () => {
    skillsSection.classList.remove('is-compact');
    skillsSection.style.removeProperty('--skills-content-height');
    skillsSection.style.removeProperty('--skills-density');
    const style = getComputedStyle(skillsSection);
    const available = (getLayoutViewportHeight())
      - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    const fits = () => inner.getBoundingClientRect().height <= available;
    if (fits()) return;
    if (!fits()) {
      skillsSection.classList.add('is-compact');
      if (!fits()) {
        // Find the largest badge size that fits, including changes in line wrapping.
        let low = 0.6;
        let high = 1;
        for (let attempt = 0; attempt < 9; attempt += 1) {
          const density = (low + high) / 2;
          skillsSection.style.setProperty('--skills-density', density);
          if (fits()) low = density;
          else high = density;
        }
        skillsSection.style.setProperty('--skills-density', low);
      }
    }
    if (fits()) skillsSection.style.setProperty('--skills-content-height', `${available}px`);
  };
  observeLayoutViewport(fitSkills);
}
