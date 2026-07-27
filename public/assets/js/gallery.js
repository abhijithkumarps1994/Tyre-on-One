/* TYREON Gallery Interactivity */
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('[data-gallery-filter]');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImg = document.querySelector('[data-lightbox-image]');
  const lightboxCaption = document.querySelector('[data-lightbox-caption]');
  const lightboxClose = document.querySelector('[data-lightbox-close]');

  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const filter = btn.getAttribute('data-gallery-filter');

        galleryItems.forEach(item => {
          const categories = item.getAttribute('data-gallery-category') || '';
          if (filter === 'all' || categories.includes(filter)) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Lightbox Modal Handling
  if (lightbox && galleryItems.length > 0) {
    let previousActiveElement = null;

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.getAttribute('data-gallery-image');
        const imgAlt = item.getAttribute('data-gallery-alt') || '';
        const caption = item.getAttribute('data-gallery-caption') || '';

        if (imgSrc && lightboxImg) {
          previousActiveElement = document.activeElement;
          lightboxImg.src = imgSrc;
          lightboxImg.alt = imgAlt;
          if (lightboxCaption) lightboxCaption.textContent = caption;
          lightbox.removeAttribute('hidden');
          document.body.style.overflow = 'hidden';
          if (lightboxClose) lightboxClose.focus();
        }
      });
    });

    const closeLightbox = () => {
      lightbox.setAttribute('hidden', '');
      document.body.style.overflow = '';
      if (lightboxImg) lightboxImg.src = '';
      if (previousActiveElement) previousActiveElement.focus();
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightbox.hasAttribute('hidden')) {
        closeLightbox();
      }
    });
  }
});
