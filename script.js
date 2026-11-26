document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Dynamic Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Vanta Background (skip if reduced motion is preferred)
  if (!prefersReducedMotion && window.VANTA && document.querySelector('.s-section')) {
    try {
      window.VANTA.NET({
        el: '.s-section',
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0xc5a4a4,
        backgroundColor: 0x09090d,
        points: 8.0,
        maxDistance: 21.0,
        spacing: 18.0
      });
    } catch (_) {
      // Fallback CSS radial background stays active if WebGL is unavailable
    }
  }

  // 3. Toast Notification Helper
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2600);
  }

  // 4. Mobile Drawer (with scroll lock & focus management)
  const menuOpen = document.getElementById('menuOpen');
  const menuClose = document.getElementById('menuClose');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');

  function openDrawer() {
    if (!drawer || !overlay) return;
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('open'));
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    menuOpen?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    menuClose?.focus();
  }

  function closeDrawer(restoreFocus = true) {
    if (!drawer || !overlay || !drawer.classList.contains('open')) return;
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    menuOpen?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!drawer.classList.contains('open')) overlay.hidden = true;
    }, 260);
    if (restoreFocus) menuOpen?.focus();
  }

  menuOpen?.addEventListener('click', openDrawer);
  menuClose?.addEventListener('click', () => closeDrawer(true));
  overlay?.addEventListener('click', () => closeDrawer(true));
  document.querySelectorAll('.drawer-nav a').forEach((link) => {
    link.addEventListener('click', () => closeDrawer(false));
  });

  // 5. Scroll Progress, Sticky Topbar, Back-to-Top, & Active Nav Scroll-Spy
  const topbar = document.getElementById('topbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.desktop-nav a, .drawer-nav a')];

  function updateOnScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min((scrollY / docHeight) * 100, 100) : 0;

    if (scrollProgress) scrollProgress.style.width = `${progress}%`;
    topbar?.classList.toggle('scrolled', scrollY > 24);
    backToTop?.classList.toggle('visible', scrollY > 420);

    // Accurate Scroll-Spy (handles top and bottom of page reliably)
    let activeId = sections[0]?.id || 'home';
    if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 40) {
      activeId = sections[sections.length - 1].id;
    } else {
      const offset = scrollY + 150;
      for (const sec of sections) {
        if (sec.offsetTop <= offset) activeId = sec.id;
      }
    }

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
    });
  }

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
  updateOnScroll();

  // 6. Scroll-Entrance Reveal Animations
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  // 7. Project Details Modal
  const PROJECTS = {
    weatherz: {
      title: 'Weatherz',
      tag: 'Web App',
      image: 'weather.png',
      alt: 'Weatherz Weather App interface',
      description:
        'A weather dashboard built with vanilla HTML, CSS, and JavaScript that visualizes live atmospheric conditions in a clean interface.',
      highlights: [
        'Real-time weather metrics with dynamic animated rain effects',
        'Extended 3-day weather forecast breakdown',
        'Air Quality Index (AQI) monitoring and responsive mobile layout'
      ],
      tech: ['HTML', 'CSS', 'JavaScript'],
      liveUrl: 'https://13yashkundu.github.io/weatherZ-web/',
      liveLabel: 'Live Demo',
      githubUrl: 'https://github.com/13yashkundu/weatherZ-web'
    },
    rajnibhasin: {
      title: 'Rajni Bhasin',
      tag: 'Client Project',
      image: 'rb.png',
      alt: 'Rajni Bhasin Career Guidance Platform',
      description:
        'A production website crafted for a career guidance and counseling platform, focused on clarity, trust, and smooth navigation across devices.',
      highlights: [
        'Clean service presentation tailored for students and parents',
        'Responsive layout optimized for mobile and desktop visitors',
        'Fast static delivery with accessible navigation structure'
      ],
      tech: ['HTML', 'CSS', 'JavaScript'],
      liveUrl: 'https://rajnibhasin.in/',
      liveLabel: 'Live Site',
      githubUrl: null
    }
  };

  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalImg = document.getElementById('modalImg');
  const modalTag = document.getElementById('modalTag');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalHighlights = document.getElementById('modalHighlights');
  const modalTech = document.getElementById('modalTech');
  const modalActions = document.getElementById('modalActions');
  let lastTrigger = null;

  function openProjectModal(key, triggerEl) {
    const data = PROJECTS[key];
    if (!data || !modal) return;
    lastTrigger = triggerEl || null;

    modalImg.src = data.image;
    modalImg.alt = data.alt;
    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.description;

    modalHighlights.innerHTML = data.highlights.map((item) => `<li>${item}</li>`).join('');
    modalTech.innerHTML = data.tech.map((t) => `<span class="tech-badge">${t}</span>`).join('');

    modalActions.innerHTML = `
      <a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-btn project-btn-primary">
        <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> ${data.liveLabel}
      </a>
      ${
        data.githubUrl
          ? `<a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-btn project-btn-secondary">
               <i class="fa-brands fa-github" aria-hidden="true"></i> GitHub
             </a>`
          : ''
      }
    `;

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose?.focus();
  }

  function closeProjectModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    lastTrigger?.focus();
  }

  document.querySelectorAll('[data-open-project]').forEach((btn) => {
    btn.addEventListener('click', () => openProjectModal(btn.dataset.openProject, btn));
  });

  modalClose?.addEventListener('click', closeProjectModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeProjectModal();
  });

  // Escape key closes drawer or modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer(true);
      closeProjectModal();
    }
  });

  // 8. Copy Email & Contact Form Composer
  async function copyText(text, successMsg) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(successMsg);
      return true;
    } catch {
      showToast('Copy failed — please select and copy manually.');
      return false;
    }
  }

  const copyEmailBtn = document.getElementById('copyEmailBtn');
  copyEmailBtn?.addEventListener('click', async () => {
    const ok = await copyText(copyEmailBtn.dataset.copy, 'Email copied to clipboard!');
    if (ok) {
      const label = copyEmailBtn.querySelector('span');
      if (label) {
        label.textContent = 'Copied!';
        setTimeout(() => (label.textContent = 'Copy'), 2000);
      }
    }
  });

  const contactForm = document.getElementById('contactForm');
  const copyMessageBtn = document.getElementById('copyMessageBtn');
  const formHint = document.getElementById('formHint');

  function getValidatedFormData() {
    const name = document.getElementById('senderName')?.value.trim();
    const email = document.getElementById('senderEmail')?.value.trim();
    const message = document.getElementById('senderMessage')?.value.trim();

    if (!name || !email || !message) {
      formHint.textContent = 'Please fill in your name, email, and message.';
      return null;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formHint.textContent = 'Please enter a valid email address.';
      return null;
    }
    formHint.textContent = '';
    return { name, email, message };
  }

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = getValidatedFormData();
    if (!data) return;

    const subject = encodeURIComponent(`Portfolio Inquiry from ${data.name}`);
    const body = encodeURIComponent(`Hi Yash,\n\n${data.message}\n\nBest,\n${data.name}\n(${data.email})`);
    window.location.href = `mailto:yshkundu@gmail.com?subject=${subject}&body=${body}`;
    formHint.textContent = 'Opening your email app with your drafted message...';
    showToast('Email draft ready!');
  });

  copyMessageBtn?.addEventListener('click', async () => {
    const data = getValidatedFormData();
    if (!data) return;

    const formatted = `To: yshkundu@gmail.com\nFrom: ${data.name} (${data.email})\n\n${data.message}`;
    const ok = await copyText(formatted, 'Message copied! Paste it into any email app.');
    if (ok) {
      formHint.textContent = 'Formatted message copied to clipboard.';
    }
  });
});