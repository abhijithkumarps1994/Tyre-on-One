/* TYREON Core Client Script */
document.addEventListener('DOMContentLoaded', () => {
  // Hide page loader
  const loader = document.querySelector('.page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('loaded');
      setTimeout(() => loader.remove(), 400);
    }, 150);
  }

  // Header scroll state
  const header = document.querySelector('[data-header]');
  if (header) {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 30) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Mobile menu toggle & nav auto-close on link click
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const siteNav = document.querySelector('[data-menu]');

  if (menuToggle && siteNav) {
    const closeMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('open');
      document.body.style.overflow = '';
    };

    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      siteNav.classList.toggle('open');
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });

    // Auto-close menu when clicking links on mobile
    siteNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (siteNav.classList.contains('open')) {
          closeMenu();
        }
      });
    });

    // Close menu on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && siteNav.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // Set current year
  const yearEls = document.querySelectorAll('[data-year]');
  const currentYear = new Date().getFullYear();
  yearEls.forEach(el => el.textContent = currentYear);

  // Scroll reveal observer
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('active'));
  }

  // Stat Counter Animation
  const statNumbers = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-count'));
          const suffix = el.getAttribute('data-suffix') || '';
          const isDecimal = target % 1 !== 0;
          let current = 0;
          const duration = 1500;
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              el.textContent = (isDecimal ? target.toFixed(1) : Math.round(target)) + suffix;
              clearInterval(timer);
            } else {
              el.textContent = (isDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
            }
          }, stepTime);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => countObserver.observe(el));
  }

  // Product Filter & Search
  const productSearch = document.querySelector('[data-product-search]');
  const filterButtons = document.querySelectorAll('[data-filter]');
  const productCards = document.querySelectorAll('.tyre-card');
  const productCount = document.querySelector('[data-product-count]');
  const emptyResults = document.querySelector('[data-empty-results]');

  if (productCards.length > 0) {
    let currentFilter = 'all';
    let currentQuery = '';

    const updateProducts = () => {
      let visible = 0;
      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const searchText = card.getAttribute('data-search') ? card.getAttribute('data-search').toLowerCase() : '';
        const matchesCategory = currentFilter === 'all' || category === currentFilter;
        const matchesQuery = !currentQuery || searchText.includes(currentQuery.toLowerCase());

        if (matchesCategory && matchesQuery) {
          card.style.display = '';
          visible++;
        } else {
          card.style.display = 'none';
        }
      });

      if (productCount) {
        productCount.textContent = `Showing ${visible} tyre${visible === 1 ? '' : 's'}`;
      }

      if (emptyResults) {
        emptyResults.hidden = visible > 0;
      }
    };

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        currentFilter = btn.getAttribute('data-filter');
        updateProducts();
      });
    });

    if (productSearch) {
      productSearch.addEventListener('input', (e) => {
        currentQuery = e.target.value.trim();
        updateProducts();
      });
    }
  }

  // Contact Form Handling with Feedback
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending enquiry...';
      }

      setTimeout(() => {
        const successBanner = document.createElement('div');
        successBanner.className = 'form-success-banner';
        successBanner.setAttribute('role', 'alert');
        successBanner.style.cssText = 'background: rgba(34,197,94,0.15); border: 1px solid #22c55e; color: #4ade80; padding: 1.25rem; border-radius: 8px; margin-bottom: 1.5rem; font-weight: 500; text-align: center;';
        successBanner.innerHTML = '<strong>Enquiry Sent Successfully!</strong><br><span style="font-size: 0.9rem; color: #f3f4f6;">Thank you for contacting TYREON. Our team will get back to you shortly.</span>';

        const existingAlert = contactForm.querySelector('.form-success-banner');
        if (existingAlert) existingAlert.remove();

        contactForm.prepend(successBanner);
        contactForm.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send enquiry <span aria-hidden="true">↗</span>';
        }

        successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 800);
    });
  }
});
