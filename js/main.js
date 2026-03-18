/* ============================================
   SONORIA — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Preloader ---
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
      initCounters();
    }, 1800);
  });

  // Fallback: hide preloader after 4s max
  setTimeout(() => {
    if (!preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
      initCounters();
    }
  }, 4000);

  // --- Custom Cursor ---
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;

      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects for cursor
    document.querySelectorAll('[data-cursor="pointer"]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        follower.classList.add('active');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        follower.classList.remove('active');
      });
    });
  }

  // --- Header scroll effect ---
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  // --- Mobile Menu ---
  const burger = document.getElementById('nav-burger');
  const navMenu = document.getElementById('nav-menu');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // --- Language Toggle ---
  const langToggle = document.getElementById('lang-toggle');
  let currentLang = 'en';

  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ru' : 'en';
    document.documentElement.setAttribute('data-lang', currentLang);

    // Update active button
    langToggle.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.classList.toggle('lang-toggle__option--active', btn.dataset.langBtn === currentLang);
    });

    // Update all translatable elements
    document.querySelectorAll('[data-' + currentLang + ']').forEach(el => {
      const text = el.getAttribute('data-' + currentLang);
      if (text) {
        el.innerHTML = text;
      }
    });
  });

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animation
        const el = entry.target;
        const siblings = el.closest('.courses__grid, .instructors__grid, .pricing__grid, .testimonials__grid, .hero__stats');
        let delay = 0;

        if (siblings) {
          const items = siblings.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
          const idx = Array.from(items).indexOf(el);
          delay = idx * 100;
        }

        setTimeout(() => {
          el.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Counter Animation ---
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          animateCount(el, target);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  function animateCount(el, target) {
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-item__question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // --- Hero Canvas — Sound Wave Visualization ---
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const waves = [
    { amplitude: 50, frequency: 0.008, speed: 0.02, color: 'rgba(201, 168, 76, 0.08)', y: 0.5 },
    { amplitude: 35, frequency: 0.012, speed: 0.015, color: 'rgba(201, 168, 76, 0.05)', y: 0.55 },
    { amplitude: 25, frequency: 0.018, speed: 0.025, color: 'rgba(201, 168, 76, 0.03)', y: 0.45 },
    { amplitude: 60, frequency: 0.006, speed: 0.01, color: 'rgba(255, 255, 255, 0.02)', y: 0.5 },
  ];

  let time = 0;

  function drawWaves() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    waves.forEach(wave => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * wave.y);

      for (let x = 0; x <= canvas.width; x += 2) {
        const y = canvas.height * wave.y +
          Math.sin(x * wave.frequency + time * wave.speed * 60) * wave.amplitude +
          Math.sin(x * wave.frequency * 2.5 + time * wave.speed * 40) * (wave.amplitude * 0.3);
        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();

      ctx.fillStyle = wave.color;
      ctx.fill();
    });

    time += 0.016;
    requestAnimationFrame(drawWaves);
  }
  drawWaves();

  // --- Floating Music Notes ---
  const notesContainer = document.getElementById('floating-notes');
  const noteSymbols = ['\u266A', '\u266B', '\u266C', '\u2669'];

  function createNote() {
    const note = document.createElement('span');
    note.className = 'floating-note';
    note.textContent = noteSymbols[Math.floor(Math.random() * noteSymbols.length)];
    note.style.left = Math.random() * 100 + '%';
    note.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
    note.style.animationDuration = (Math.random() * 6 + 6) + 's';
    note.style.animationDelay = Math.random() * 2 + 's';
    notesContainer.appendChild(note);

    setTimeout(() => note.remove(), 14000);
  }

  // Create initial notes
  for (let i = 0; i < 6; i++) {
    setTimeout(createNote, i * 800);
  }
  setInterval(createNote, 2500);

  // --- Parallax Effect ---
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax);
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.style.transform = `translateY(${scrollY * speed}px)`;
      }
    });
  }, { passive: true });

  // --- Card Tilt Effect ---
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;

        card.style.transform = `translateY(-8px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(section => sectionObserver.observe(section));

});
