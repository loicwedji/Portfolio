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
    ...document.querySelectorAll(
      'main h1, main h2, main h3, main h4, main p, main li, main img, main article, main .watch-list, main .rating',
    ),
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

    const isAtPageEnd =
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 4;

    const overlapsText = !isAtPageEnd && contactCollisionTargets.some((element) => {
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
    if (isNavScrollInProgress) return;

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

document.querySelectorAll('.watch-card[data-rating-key]').forEach((card) => {
  const rating = card.querySelector('.rating');
  const key = `portfolio-rating-${card.dataset.ratingKey}`;
  let currentRating = 0;

  try {
    currentRating = Number.parseInt(localStorage.getItem(key) || '0', 10);
  } catch {
    currentRating = 0;
  }

  const updateRating = (value) => {
    currentRating = value;
    rating.querySelectorAll('.rating__star').forEach((star, index) => {
      const isFilled = index < currentRating;
      star.classList.toggle('is-filled', isFilled);
      star.setAttribute('aria-pressed', String(index + 1 === currentRating));
    });
  };

  for (let value = 1; value <= 5; value += 1) {
    const star = document.createElement('button');
    star.className = 'rating__star';
    star.type = 'button';
    star.textContent = '★';
    star.setAttribute('aria-label', `${value} out of 5 stars`);
    star.addEventListener('click', () => {
      const nextRating = currentRating === value ? 0 : value;
      updateRating(nextRating);

      try {
        localStorage.setItem(key, String(nextRating));
      } catch {
        // Ratings remain usable for the current page when storage is unavailable.
      }
    });
    rating.append(star);
  }

  updateRating(currentRating);
});

const mediaReviews = {
  'game-ff7-rebirth': 'Review coming soon.',
  'game-zelda-botw': 'Review coming soon.',
  'game-zelda-totk': 'Review coming soon.',
  'game-sifu': 'Review coming soon.',
  'anime-naruto': 'A classic underdog story with a huge heart. The long journey makes its friendships, rivalries, and hard-earned victories feel genuinely meaningful.',
  'anime-code-geass': 'Smart, dramatic, and constantly escalating. Lelouch is compelling because every brilliant decision seems to create an even more difficult consequence.',
  'anime-death-note': 'A tense battle of intelligence that turns simple rules into a gripping moral chess match. The early rivalry between Light and L is the highlight.',
  'anime-solo-leveling': 'Pure power-fantasy entertainment with sharp animation and satisfying progression. It knows exactly how to make each new level feel exciting.',
  'anime-clevatess': 'A dark fantasy with an unusual perspective and an atmosphere that immediately stands out. Its world feels dangerous, strange, and worth exploring.',
  'anime-kaiju-no-8': 'A fun mix of workplace comedy, monster action, and second chances. Kafka is easy to root for because his dream survives long after life gets in the way.',
  'anime-classroom-of-the-elite': 'A calculated school drama where nearly every conversation hides another motive. Ayanokoji makes the slow reveals especially satisfying.',
  'movie-spider-verse': 'A visually fearless movie with real emotional weight. Miles becoming Spider-Man feels personal, energetic, and completely earned.',
  'movie-tron-legacy': 'The story is simple, but the atmosphere is unforgettable. The production design and Daft Punk score make the Grid feel like a place unlike anything else.',
  'movie-puss-in-boots-last-wish': 'Funny, beautifully animated, and unexpectedly thoughtful about fear and mortality. The Wolf is one of animation\'s most memorable antagonists.',
  'movie-megamind': 'A clever superhero comedy that gets better with time. Its real strength is the idea that identity comes from choices rather than assigned roles.',
  'tv-tron-uprising': 'A stylish expansion of the Tron world with striking animation and a strong resistance story. It deserved far more time to develop its ideas.',
  'game-kingdom-hearts-1': 'Charming, strange, and full of discovery. Its rough edges are part of the appeal, and the mix of Disney worlds with an original mystery still works.',
  'game-kingdom-hearts-2-8': 'The series at its most confident, with faster combat, memorable worlds, and an emotional payoff that rewards the journey through the earlier games.',
  'game-gta-6': 'Review coming soon.',
  'game-fc-27': 'The familiar football loop remains easy to return to, especially with friends. Small gameplay changes matter most when they make matches feel more responsive.',
  'game-naruto-storm-4': 'A great playable celebration of Naruto, packed with cinematic battles and a huge roster. The story fights capture the scale of the anime remarkably well.',
};

let openReviewCard = null;

// Use the console-style tile selector for each About Me media collection.
const thoughtsShelf = document.querySelector('.thoughts');
if (thoughtsShelf) {
  thoughtsShelf.classList.add('game-library', 'thought-library');
  const list = thoughtsShelf.querySelector('.thoughts__list');
  list.classList.add('game-library__tiles');
  list.setAttribute('role', 'group');
  list.setAttribute('aria-label', 'Choose a recent thought. Use arrow keys to browse.');
  const entries = [...list.querySelectorAll('.thought-card')].map((card, index) => {
    const title = card.querySelector('h4').textContent.trim();
    const date = card.querySelector('time').cloneNode(true);
    const copy = card.querySelector('p').textContent.trim();
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'game-library__tile thought-library__tile';
    button.setAttribute('aria-label', title);
    button.setAttribute('aria-controls', 'selected-thought-details');
    const number = document.createElement('span');
    number.className = 'thought-library__number';
    number.textContent = String(index + 1).padStart(2, '0');
    button.append(number, date.cloneNode(true));
    card.classList.add('watch-card');
    card.replaceChildren(button);
    return { card, button, title, date, copy };
  });
  const details = document.createElement('div');
  details.className = 'game-library__details';
  details.id = 'selected-thought-details';
  details.setAttribute('aria-live', 'polite');
  details.setAttribute('aria-atomic', 'true');
  list.after(details);
  const select = (index) => {
    entries.forEach((entry, i) => {
      entry.card.classList.toggle('is-selected', i === index);
      entry.button.setAttribute('aria-pressed', String(i === index));
      entry.button.tabIndex = i === index ? 0 : -1;
    });
    const entry = entries[index];
    const heading = document.createElement('h4');
    heading.textContent = entry.title;
    const copy = document.createElement('p');
    copy.className = 'game-library__review';
    copy.textContent = entry.copy;
    const date = entry.date.cloneNode(true);
    date.className = 'game-library__eyebrow';
    details.replaceChildren(date, heading, copy);
  };
  entries.forEach((entry, index) => {
    entry.button.addEventListener('click', () => select(index));
    entry.button.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % entries.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + entries.length) % entries.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = entries.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      select(next);
      entries[next].button.focus({ preventScroll: true });
    });
  });
  if (entries.length) select(0);
}

const mediaShelves = [...document.querySelectorAll('.watch-shelf')];
const aboutContent = document.querySelector('.about-content');
if (aboutContent) {
  const gamesShelf = mediaShelves.find((shelf) => shelf.querySelector('[data-rating-key^="game-"]'));
  const animeShelf = mediaShelves.find((shelf) => shelf.querySelector('[data-rating-key^="anime-"]'));
  const moviesShelf = mediaShelves.find((shelf) => shelf.querySelector('[data-rating-key^="movie-"]'));
  const panels = [gamesShelf, animeShelf, moviesShelf, thoughtsShelf].filter(Boolean);
  panels.forEach((shelf) => aboutContent.append(shelf));
  aboutContent.classList.add('about-content--tabbed');
  const tabs = document.createElement('div');
  tabs.className = 'about-tabs';
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'About Me collections');
  aboutContent.prepend(tabs);
  const buttons = panels.map((panel, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.id = `about-tab-${index}`;
    button.className = 'about-tabs__tab';
    button.textContent = panel.querySelector('h3').textContent;
    button.setAttribute('role', 'tab');
    panel.id = `about-panel-${index}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', button.id);
    button.setAttribute('aria-controls', panel.id);
    tabs.append(button);
    return button;
  });
  const activate = (index) => {
    panels.forEach((panel, i) => {
      panel.hidden = i !== index;
      buttons[i].setAttribute('aria-selected', String(i === index));
      buttons[i].tabIndex = i === index ? 0 : -1;
    });
  };
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => activate(index));
    button.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      activate(next);
      buttons[next].focus();
    });
  });
  activate(0);
}
mediaShelves.forEach((shelf, shelfIndex) => {
  const gameCards = [...shelf.querySelectorAll('.watch-card')];
  if (!gameCards.length) return;
  const list = gameCards[0].parentElement;
  shelf.classList.add('game-library');
  if (gameCards[0].dataset.ratingKey.startsWith('game-')) shelf.classList.add('game-library--games');
  else shelf.classList.add('media-library--portrait');
  list.classList.add('game-library__tiles');
  list.removeAttribute('tabindex');
  list.setAttribute('role', 'group');
  list.setAttribute('aria-label', `Choose from ${shelf.querySelector('h3').textContent}. Use left and right arrow keys to browse.`);
  shelf.querySelector('.watch-shelf__heading > span').textContent = 'Select to explore';

  const backdrop = document.createElement('div');
  backdrop.className = 'game-library__backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  shelf.prepend(backdrop);
  const details = document.createElement('div');
  details.className = 'game-library__details';
  details.id = `selected-media-details-${shelfIndex}`;
  details.innerHTML = '<div class="game-library__copy" aria-live="polite" aria-atomic="true"><h4></h4><p class="game-library__genre"></p><p class="game-library__review"></p></div><div class="game-library__rating"><span>Your rating</span></div>';
  list.after(details);

  const games = gameCards.map((card) => {
    const cover = card.querySelector('img');
    const title = card.querySelector('h4').textContent.trim();
    const genre = card.querySelector('p').textContent.trim();
    const rating = card.querySelector('.rating');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'game-library__tile';
    button.setAttribute('aria-label', title);
    button.setAttribute('aria-controls', details.id);
    cover.alt = '';
    button.append(cover);
    card.replaceChildren(button);
    details.querySelector('.game-library__rating').append(rating);
    return { card, button, cover, title, genre, rating };
  });

  const circularGames = shelf.classList.contains('game-library--games');
  const renderedGames = circularGames
    ? [0, 1, 2].flatMap((copy) => games.map((game, index) => {
        if (copy === 1) return { ...game, index };
        const card = game.card.cloneNode(true);
        return { ...game, index, card, button: card.querySelector('button') };
      }))
    : games.map((game, index) => ({ ...game, index }));
  if (circularGames) {
    list.replaceChildren(...renderedGames.map((game) => game.card));
    list.classList.add('game-library__tiles--circular');
  }
  let activeSlot = circularGames ? games.length : 0;
  let carouselFrame;
  const selectGame = (index, scroll = true, clickedSlot) => {
    const selected = games[index];
    cancelAnimationFrame(carouselFrame);
    if (circularGames) {
      if (!scroll) activeSlot = games.length + index;
      else if (clickedSlot !== undefined) activeSlot = clickedSlot;
      else {
        const currentIndex = renderedGames[activeSlot].index;
        const forward = (index - currentIndex + games.length) % games.length;
        activeSlot += forward <= games.length / 2 ? forward : forward - games.length;
      }
      if (activeSlot < 0 || activeSlot >= renderedGames.length) activeSlot = games.length + index;
    }
    games.forEach((game, i) => {
      game.rating.hidden = i !== index;
    });
    renderedGames.forEach((game, slot) => {
      const isSelected = circularGames ? slot === activeSlot : game.index === index;
      game.card.classList.toggle('is-selected', isSelected);
      game.button.setAttribute('aria-pressed', String(isSelected));
      game.button.tabIndex = isSelected ? 0 : -1;
    });
    details.querySelector('h4').textContent = selected.title;
    details.querySelector('.game-library__genre').textContent = selected.genre;
    details.querySelector('.game-library__review').textContent = mediaReviews[selected.card.dataset.ratingKey];
    backdrop.style.backgroundImage = `url("${selected.cover.getAttribute('src')}")`;
    if (circularGames) {
      const startLeft = list.scrollLeft;
      const started = performance.now();
      const duration = scroll && !prefersReducedMotion ? 420 : 0;
      const align = (now) => {
        const progress = duration ? Math.min(1, (now - started) / duration) : 1;
        const target = renderedGames[activeSlot].card.offsetLeft - list.offsetLeft - 42;
        list.scrollLeft = startLeft + (target - startLeft) * (1 - Math.pow(1 - progress, 3));
        if (progress < 1) { carouselFrame = requestAnimationFrame(align); return; }
        // Reset to the equivalent middle copy out of view, preserving the visual position.
        const middleSlot = games.length + index;
        if (activeSlot !== middleSlot) {
          const restoreFocus = list.contains(document.activeElement);
          list.classList.add('is-rebasing');
          renderedGames[activeSlot].card.classList.remove('is-selected');
          renderedGames[activeSlot].button.setAttribute('aria-pressed', 'false');
          renderedGames[activeSlot].button.tabIndex = -1;
          activeSlot = middleSlot;
          const middle = renderedGames[activeSlot];
          middle.card.classList.add('is-selected');
          middle.button.setAttribute('aria-pressed', 'true');
          middle.button.tabIndex = 0;
          list.scrollLeft = middle.card.offsetLeft - list.offsetLeft - 42;
          if (restoreFocus) middle.button.focus({ preventScroll: true });
          void list.offsetWidth;
          list.classList.remove('is-rebasing');
        }
      };
      carouselFrame = requestAnimationFrame(align);
      return;
    }
    if (scroll) {
      const left = selected.card.offsetLeft - list.offsetLeft - 12;
      list.scrollTo({ left: Math.max(0, left), behavior: prefersReducedMotion ? 'instant' : 'smooth' });
    }
  };
  renderedGames.forEach((game, slot) => {
    const index = game.index;
    game.button.addEventListener('click', () => selectGame(index, true, slot));
    game.button.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % games.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + games.length) % games.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = games.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectGame(next);
      renderedGames[circularGames ? activeSlot : next].button.focus({ preventScroll: true });
    });
  });
  selectGame(0, false);
});

document.querySelectorAll('.about-content .game-library__tiles').forEach((list) => {
  const wrapAround = Boolean(list.closest('.game-library--games'));
  const hint = document.createElement('button');
  hint.className = 'tile-scroll-hint';
  hint.type = 'button';
  hint.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>';
  hint.setAttribute('aria-label', 'Scroll to more items');
  const viewport = document.createElement('div');
  viewport.className = 'tile-viewport';
  list.before(viewport);
  viewport.append(list, hint);
  hint.addEventListener('click', () => {
    if (wrapAround && list.scrollWidth - list.clientWidth - list.scrollLeft < 8) {
      list.scrollTo({ left: 0, behavior: prefersReducedMotion ? 'instant' : 'smooth' });
      return;
    }
    list.scrollBy({ left: list.clientWidth * 0.75, behavior: prefersReducedMotion ? 'instant' : 'smooth' });
  });
  const updateHint = () => {
    const atEnd = list.scrollWidth - list.clientWidth - list.scrollLeft < 8;
    hint.hidden = wrapAround ? list.scrollWidth <= list.clientWidth + 8 : atEnd;
    hint.setAttribute('aria-label', wrapAround && atEnd ? 'Return to the first games' : 'Scroll to more items');
  };
  list.addEventListener('scroll', updateHint, { passive: true });
  const resizeObserver = new ResizeObserver(updateHint);
  resizeObserver.observe(list);
  [...list.children].forEach((item) => resizeObserver.observe(item));
  updateHint();
  let drag = null;
  let suppressClick = false;
  list.querySelectorAll('img').forEach((image) => { image.draggable = false; });
  list.addEventListener('dragstart', (event) => event.preventDefault());
  list.addEventListener('pointerdown', (event) => {
    // Touch keeps native horizontal swiping and vertical page scrolling.
    if (event.pointerType === 'touch' || event.button !== 0) return;
    suppressClick = false;
    drag = { id: event.pointerId, x: event.clientX, scroll: list.scrollLeft, active: false };
  });
  list.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const distance = event.clientX - drag.x;
    if (!drag.active && Math.abs(distance) < 6) return;
    if (!drag.active) {
      drag.active = true;
      list.classList.add('is-dragging');
      list.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    list.scrollLeft = drag.scroll - distance;
  });
  const endDrag = (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    suppressClick = drag.active;
    drag = null;
    list.classList.remove('is-dragging');
    if (list.hasPointerCapture(event.pointerId)) list.releasePointerCapture(event.pointerId);
  };
  list.addEventListener('pointerup', endDrag);
  list.addEventListener('pointercancel', endDrag);
  list.addEventListener('lostpointercapture', endDrag);
  list.addEventListener('pointerleave', (event) => {
    if (drag && !drag.active) endDrag(event);
  });
  list.addEventListener('click', (event) => {
    if (!suppressClick || event.detail === 0) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick = false;
  }, true);
});

document.querySelectorAll('.watch-shelf:not(.game-library) .watch-card[data-rating-key]').forEach((card) => {
  const heading = card.querySelector('h4');
  const cover = card.querySelector(':scope > img');
  const title = heading.textContent.trim();
  const button = document.createElement('button');
  const review = document.createElement('aside');

  button.className = 'watch-title-button';
  button.type = 'button';
  button.textContent = title;
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', `Show my review of ${title}`);
  heading.replaceChildren(button);

  cover.setAttribute('role', 'button');
  cover.setAttribute('tabindex', '0');
  cover.setAttribute('aria-expanded', 'false');
  cover.setAttribute('aria-label', `Show my review of ${title}`);

  review.className = 'watch-review';
  review.hidden = true;
  review.innerHTML = `
    <span class="watch-review__label">My review</span>
    <p class="watch-review__text"></p>`;
  review.querySelector('.watch-review__text').textContent =
    mediaReviews[card.dataset.ratingKey] || 'Review coming soon.';
  card.append(review);

  let reviewHideTimer = null;

  const closeCard = () => {
    card.classList.remove('is-review-open');
    button.setAttribute('aria-expanded', 'false');
    cover.setAttribute('aria-expanded', 'false');

    clearTimeout(reviewHideTimer);
    reviewHideTimer = window.setTimeout(() => {
      if (!card.classList.contains('is-review-open')) review.hidden = true;
    }, prefersReducedMotion ? 0 : 320);
  };

  const toggleReview = () => {
    const isOpen = card.classList.contains('is-review-open');

    if (openReviewCard && openReviewCard !== card) {
      openReviewCard.querySelector('.watch-title-button').click();
    }

    if (isOpen) {
      closeCard();
      openReviewCard = null;
      return;
    }

    clearTimeout(reviewHideTimer);
    review.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    cover.setAttribute('aria-expanded', 'true');
    openReviewCard = card;

    requestAnimationFrame(() => {
      card.classList.add('is-review-open');
    });
  };

  button.addEventListener('click', toggleReview);
  cover.addEventListener('click', toggleReview);
  cover.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    toggleReview();
  });
});
