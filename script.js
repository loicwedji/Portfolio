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
  'game-kingdom-hearts-2': 'The series at its most confident, with faster combat, memorable worlds, and an emotional payoff that rewards the journey through the earlier games.',
  'game-kingdom-hearts-3': 'A visually spectacular finale with fluid combat and wonderfully detailed Disney worlds. Its best moments deliver the reunion and closure fans waited for.',
  'game-fc-26': 'The familiar football loop remains easy to return to, especially with friends. Small gameplay changes matter most when they make matches feel more responsive.',
  'game-naruto-storm-4': 'A great playable celebration of Naruto, packed with cinematic battles and a huge roster. The story fights capture the scale of the anime remarkably well.',
};

let openReviewCard = null;

document.querySelectorAll('.watch-card[data-rating-key]').forEach((card) => {
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
