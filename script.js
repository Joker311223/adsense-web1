/* ============================================================
   Clair Obscur: Expedition 33 — Main Script
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     NAVBAR: Scroll Effect + Mobile Toggle
  ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  /* ----------------------------------------------------------
     HERO PARTICLES
  ---------------------------------------------------------- */
  const particlesContainer = document.getElementById('particles');

  if (particlesContainer) {
    const PARTICLE_COUNT = 40;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      createParticle();
    }

    function createParticle() {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      // Random size
      const size = Math.random() * 3 + 1;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';

      // Random horizontal position
      particle.style.left = Math.random() * 100 + '%';

      // Random delay and duration
      const duration = Math.random() * 12 + 8;
      const delay = Math.random() * 10;
      particle.style.animationDuration = duration + 's';
      particle.style.animationDelay = delay + 's';

      // Random color: gold or purple
      const colors = ['#f0a855', '#7c3aed', '#db2777', '#c4b5fd'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];

      particlesContainer.appendChild(particle);
    }
  }

  /* ----------------------------------------------------------
     SCROLL REVEAL ANIMATION
  ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* ----------------------------------------------------------
     AUTO-ADD REVEAL CLASS to section children
  ---------------------------------------------------------- */
  const autoRevealSelectors = [
    '.overview-card',
    '.guide-card',
    '.character-card',
    '.update-card',
    '.boss-card',
    '.char-build-card',
    '.tips-list li',
  ];

  autoRevealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, idx) => {
      el.classList.add('reveal');
      el.style.transitionDelay = (idx * 0.08) + 's';
    });
  });

  // Re-observe after adding classes
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  /* ----------------------------------------------------------
     SMOOTH ANCHOR SCROLLING
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80; // account for fixed navbar
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     STAT BAR ANIMATION
  ---------------------------------------------------------- */
  const statBars = document.querySelectorAll('.stat-fill');

  if (statBars.length > 0 && 'IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const targetWidth = el.dataset.width || '0%';
            setTimeout(() => {
              el.style.width = targetWidth;
            }, 200);
            statObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    statBars.forEach(bar => {
      // Store the target width and set initial to 0
      const computed = bar.style.width;
      bar.dataset.width = computed;
      bar.style.width = '0%';
      statObserver.observe(bar);
    });
  }

  /* ----------------------------------------------------------
     ACTIVE NAV LINK HIGHLIGHT (scroll-spy)
  ---------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a[href]');

  if (sections.length > 0 && navItems.length > 0) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = '#' + entry.target.id;
            navItems.forEach(link => {
              const href = link.getAttribute('href');
              if (href === id || (href && href.includes(id))) {
                link.classList.add('active');
              } else if (!href || !href.includes('html')) {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach(section => spyObserver.observe(section));
  }

  /* ----------------------------------------------------------
     READING PROGRESS BAR (for article pages)
  ---------------------------------------------------------- */
  const articleContent = document.querySelector('.article-content');

  if (articleContent) {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      width: 0%;
      background: linear-gradient(90deg, #7c3aed, #db2777, #f0a855);
      z-index: 9999;
      transition: width 0.1s linear;
      pointer-events: none;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / docHeight) * 100;
      progressBar.style.width = Math.min(scrolled, 100) + '%';
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     COPY CODE BLOCKS (if any)
  ---------------------------------------------------------- */
  document.querySelectorAll('pre code').forEach(block => {
    const btn = document.createElement('button');
    btn.textContent = 'Copy';
    btn.style.cssText = `
      position: absolute;
      top: 8px; right: 8px;
      padding: 4px 12px;
      font-size: 0.75rem;
      background: rgba(124,58,237,0.3);
      color: #fff;
      border: 1px solid rgba(124,58,237,0.5);
      border-radius: 6px;
      cursor: pointer;
    `;
    const pre = block.parentElement;
    pre.style.position = 'relative';
    pre.appendChild(btn);

    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(block.textContent).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => (btn.textContent = 'Copy'), 2000);
      });
    });
  });

  /* ----------------------------------------------------------
     SEARCH FUNCTIONALITY (if search input present)
  ---------------------------------------------------------- */
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  if (searchInput && searchResults) {
    const guideIndex = [
      { title: 'Full Walkthrough', url: 'walkthrough.html', desc: 'Complete chapter-by-chapter story guide' },
      { title: 'Characters & Builds', url: 'characters.html', desc: 'Best builds for Gustave, Maelle, Lune, Verso' },
      { title: 'Boss Strategies', url: 'bosses.html', desc: 'How to defeat every boss in the game' },
      { title: 'Tips & Secrets', url: 'tips.html', desc: 'Hidden items, secret areas, and pro tips' },
      { title: 'Parry System Guide', url: 'tips.html#parry', desc: 'Master the parry and dodge mechanics' },
      { title: 'Paintress Final Boss', url: 'bosses.html#paintress', desc: 'Complete guide to the final boss fight' },
    ];

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      if (query.length < 2) {
        searchResults.innerHTML = '';
        searchResults.hidden = true;
        return;
      }

      const matches = guideIndex.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query)
      );

      if (matches.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
      } else {
        searchResults.innerHTML = matches.map(m => `
          <a href="${m.url}" class="search-result-item">
            <strong>${m.title}</strong>
            <span>${m.desc}</span>
          </a>
        `).join('');
      }

      searchResults.hidden = false;
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.hidden = true;
      }
    });
  }

  /* ----------------------------------------------------------
     TOOLTIP SYSTEM
  ---------------------------------------------------------- */
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = el.dataset.tooltip;
    tooltip.style.cssText = `
      position: absolute;
      background: rgba(15,15,26,0.98);
      border: 1px solid rgba(124,58,237,0.4);
      color: #f0ede6;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
      pointer-events: none;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.2s;
      white-space: nowrap;
    `;
    document.body.appendChild(tooltip);

    el.addEventListener('mouseenter', (e) => {
      const rect = el.getBoundingClientRect();
      tooltip.style.top = (rect.bottom + window.scrollY + 8) + 'px';
      tooltip.style.left = (rect.left + window.scrollX) + 'px';
      tooltip.style.opacity = '1';
    });

    el.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
  });

})();
