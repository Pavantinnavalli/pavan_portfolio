/* ==========================================================================
   PAVAN TINNAVALLI — PORTFOLIO APP.JS
   Handles: typing effect · navbar scroll · mobile menu · project filter · contact form
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. TYPING EFFECT
     -------------------------------------------------------------------------- */
  const phrases = [
    'Data Analyst',
    'AI-Powered Developer',
    'Power BI Expert',
    'Python Enthusiast',
    'Web & App Builder',
  ];

  const typingEl = document.getElementById('typing-text');
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pauseTimer = null;

  function typeLoop() {
    if (!typingEl) return;

    const current = phrases[phraseIdx];

    if (!deleting) {
      typingEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        pauseTimer = setTimeout(typeLoop, 1800);
        return;
      }
      setTimeout(typeLoop, 85);
    } else {
      typingEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, 45);
    }
  }

  typeLoop();


  /* --------------------------------------------------------------------------
     2. NAVBAR — scroll class + active link highlighting
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Add scrolled class for darker bg
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* --------------------------------------------------------------------------
     3. MOBILE MENU
     -------------------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));


  /* --------------------------------------------------------------------------
     4. PROJECT FILTER
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.4s var(--ease-out) both';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* --------------------------------------------------------------------------
     5. CONTACT FORM
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const btnSendText = document.getElementById('btn-send-text');
  const btnSendIcon = document.getElementById('btn-send-icon');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('contact-name')?.value.trim();
    const email   = document.getElementById('contact-email')?.value.trim();
    const message = document.getElementById('contact-message')?.value.trim();

    if (!name || !email || !message) {
      // Shake animation on empty required fields
      [document.getElementById('contact-name'),
       document.getElementById('contact-email'),
       document.getElementById('contact-message')].forEach(el => {
        if (el && !el.value.trim()) {
          el.style.borderColor = '#ef4444';
          el.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.15)';
          setTimeout(() => {
            el.style.borderColor = '';
            el.style.boxShadow = '';
          }, 2500);
        }
      });
      return;
    }

    // Simulate send
    if (btnSendText) btnSendText.textContent = 'Sending…';
    if (btnSendIcon) btnSendIcon.textContent = '⏳';

    setTimeout(() => {
      contactForm.reset();
      if (btnSendText) btnSendText.textContent = 'Send Message';
      if (btnSendIcon) btnSendIcon.textContent = '→';
      formSuccess?.classList.add('show');
      setTimeout(() => formSuccess?.classList.remove('show'), 4000);
    }, 1200);
  });


  /* --------------------------------------------------------------------------
     6. SCROLL-TRIGGERED ANIMATIONS
        All sections visible by default (no opacity:0 on .section)
        Elements inside get a subtle entrance when they come into view.
     -------------------------------------------------------------------------- */
  const animItems = document.querySelectorAll(
    '.info-card, .bento-card, .timeline-item, .project-card, .contact-item'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Small staggered delay based on DOM order
        const delay = (Array.from(animItems).indexOf(entry.target) % 6) * 60;
        entry.target.style.animation =
          `fadeInUp 0.55s var(--ease-out) ${delay}ms both`;
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  animItems.forEach(el => {
    // Default state — visible (no opacity:0 applied via CSS class)
    revealObserver.observe(el);
  });


  /* --------------------------------------------------------------------------
     7. SMOOTH ANCHOR SCROLLING (close mobile menu on nav click)
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        closeMobileMenu();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* --------------------------------------------------------------------------
     8. SKILL BAR ANIMATION — triggered when bento grid enters view
     -------------------------------------------------------------------------- */
  const bentoGrid = document.querySelector('.bento-grid');
  if (bentoGrid) {
    const barObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.bar-fill').forEach((bar, i) => {
          bar.style.animation = `barGrow 1.2s var(--ease-out) ${i * 120 + 200}ms both`;
        });
        barObserver.unobserve(entry.target);
      }
    }, { threshold: 0.2 });
    barObserver.observe(bentoGrid);
  }

});
