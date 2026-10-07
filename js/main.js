document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const mobileViewport = window.matchMedia('(max-width: 800px)');

function closeMenu(returnFocus = false) {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = 'Menú';
  if (returnFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  navigation.classList.toggle('is-open', !expanded);
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.textContent = expanded ? 'Menú' : 'Cerrar menú';
});

navigation.addEventListener('click', event => {
  if (event.target.closest('a') && mobileViewport.matches) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
mobileViewport.addEventListener('change', () => closeMenu());

const lightbox = document.querySelector('.lightbox');
if (lightbox) {
  const image = lightbox.querySelector('img');
  const caption = lightbox.querySelector('p');
  const originalLink = lightbox.querySelector('[data-original-image]');
  let opener;
  let savedScrollY = 0;
  document.querySelectorAll('[data-lightbox]').forEach(button => {
    button.addEventListener('click', () => {
      const figure = button.closest('figure');
      const source = figure.querySelector('img');
      image.src = source.currentSrc || source.src;
      image.alt = source.alt;
      image.width = source.naturalWidth || source.width;
      image.height = source.naturalHeight || source.height;
      caption.textContent = figure.querySelector('.capture-caption').textContent;
      if (originalLink) originalLink.href = source.src;
      opener = button;
      savedScrollY = window.scrollY;
      lightbox.showModal();
      document.body.style.top = `-${savedScrollY}px`;
      document.body.classList.add('modal-open');
    });
  });
  lightbox.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    document.body.style.top = '';
    window.scrollTo({top: savedScrollY, behavior: 'instant'});
    opener?.focus({preventScroll: true});
  });
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => {
    const bounds = lightbox.getBoundingClientRect();
    if (event.target === lightbox && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) lightbox.close();
  });
}
