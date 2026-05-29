(function () {
  'use strict';

  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const menuPanel = document.getElementById('menuPanel');
  const menuOverlay = document.getElementById('menuOverlay');
  const menuClose = document.getElementById('menuClose');
  const contactForm = document.getElementById('contactForm');

  function openMenu() {
    menuPanel.classList.add('is-open');
    menuOverlay.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuPanel.setAttribute('aria-hidden', 'false');
    menuOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    menuPanel.classList.remove('is-open');
    menuOverlay.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuPanel.setAttribute('aria-hidden', 'true');
    menuOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }

  function toggleMenu() {
    if (menuPanel.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  /* Header scroll effect */
  function handleScroll() {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* Hero video — autoplay en todos los navegadores */
  const heroVideo = document.querySelector('.hero__video');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.setAttribute('muted', '');

    const playHeroVideo = () => {
      const promise = heroVideo.play();
      if (promise !== undefined) {
        promise.catch(() => {});
      }
    };

    playHeroVideo();
    heroVideo.addEventListener('loadeddata', playHeroVideo, { once: true });
    heroVideo.addEventListener('canplay', playHeroVideo, { once: true });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) playHeroVideo();
    });
  }

  /* Menú lateral */
  menuToggle.addEventListener('click', toggleMenu);
  menuClose.addEventListener('click', closeMenu);
  menuOverlay.addEventListener('click', closeMenu);

  menuPanel.querySelectorAll('.menu-panel__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuPanel.classList.contains('is-open')) {
      closeMenu();
    }
  });

  /* Scroll reveal */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  /* Hero: reveal on load with stagger */
  const heroReveals = document.querySelectorAll('.hero .reveal');
  heroReveals.forEach((el, i) => {
    el.style.transitionDelay = `${0.3 + i * 0.15}s`;
    requestAnimationFrame(() => el.classList.add('visible'));
  });

  revealElements.forEach((el) => {
    if (el.closest('.hero')) return;
    revealObserver.observe(el);
  });

  /* Counter animation */
  const statNumbers = document.querySelectorAll('[data-target]');
  let statsAnimated = false;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statNumbers.forEach(animateCounter);
        }
      });
    },
    { threshold: 0.4 }
  );

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) statsObserver.observe(statsSection);

  /* Novedades — video players */
  const newsPlayers = document.querySelectorAll('.news-card__player');

  newsPlayers.forEach((player) => {
    const video = player.querySelector('.news-card__video');
    const playBtn = player.querySelector('.news-card__play');
    if (!video || !playBtn) return;

    const startPlay = () => {
      newsPlayers.forEach((other) => {
        if (other === player) return;
        const otherVideo = other.querySelector('.news-card__video');
        if (otherVideo && !otherVideo.paused) {
          otherVideo.pause();
          other.classList.remove('is-playing');
          otherVideo.removeAttribute('controls');
        }
      });
      video.setAttribute('controls', '');
      player.classList.add('is-playing');
      video.play().catch(() => {
        player.classList.remove('is-playing');
        video.removeAttribute('controls');
      });
    };

    playBtn.addEventListener('click', startPlay);

    video.addEventListener('ended', () => {
      player.classList.remove('is-playing');
      video.removeAttribute('controls');
      video.currentTime = 0;
    });

    video.addEventListener('play', () => {
      player.classList.add('is-playing');
    });
  });

  /* Typewriter — marca sutil */
  document.querySelectorAll('.typewriter[data-typewriter]').forEach((el) => {
    const text = el.dataset.typewriter;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = text;
      el.classList.add('is-done');
      return;
    }

    el.textContent = '';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(el);

          let i = 0;
          el.classList.add('is-typing');
          const speed = el.classList.contains('about__brand-line') ? 65 : 90;

          const tick = () => {
            el.textContent = text.slice(0, i);
            i += 1;
            if (i <= text.length) {
              setTimeout(tick, speed);
            } else {
              el.classList.remove('is-typing');
              el.classList.add('is-done');
            }
          };
          tick();
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
  });

  /* Contact form */
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Enviado — Gracias';
    btn.disabled = true;

    setTimeout(() => {
      contactForm.reset();
      btn.textContent = originalText;
      btn.disabled = false;
    }, 3000);
  });

  /* Smooth anchor offset for fixed header */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
