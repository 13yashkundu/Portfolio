const menuOpen = document.getElementById('menuOpen');
const menuClose = document.getElementById('menuClose');
const drawer = document.getElementById('mobileDrawer');
const overlay = document.getElementById('drawerOverlay');

function openDrawer() {
  drawer.classList.add('open');
  overlay.hidden = false;
  drawer.setAttribute('aria-hidden', 'false');
  menuOpen.setAttribute('aria-expanded', 'true');
}

function closeDrawer() {
  drawer.classList.remove('open');
  overlay.hidden = true;
  drawer.setAttribute('aria-hidden', 'true');
  menuOpen.setAttribute('aria-expanded', 'false');
}

menuOpen.addEventListener('click', openDrawer);
menuClose.addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);

document.querySelectorAll('.drawer-nav a').forEach(link => {
  link.addEventListener('click', closeDrawer);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDrawer();
});

document.querySelectorAll('a[href="#home"]').forEach(link => {
  link.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});
