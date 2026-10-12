document.querySelectorAll('[data-preview-print]').forEach(button => {
  button.addEventListener('click', () => window.print());
});

const image = document.getElementById('imageStack');
if (image) {
  image.setAttribute('role', 'button');
  image.setAttribute('aria-pressed', 'false');
  const toggle = () => {
    const clean = image.classList.toggle('is-clean');
    image.setAttribute('aria-pressed', String(clean));
  };
  image.addEventListener('click', toggle);
  image.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
  });
}
