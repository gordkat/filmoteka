import * as basicLightbox from 'basiclightbox';

const signInModal = document.querySelector('.js-sign-in__modal');

signInModal.addEventListener('click', openModal);

// const modal = basicLightbox.create(markup);

function openModal(e) {
  modal.show();

  window.addEventListener('keydown', closeModalHandler);

  function closeModalHandler(e) {
    if (e.code === 'Escape') {
      modal.close();
      window.removeEventListener('keydown', closeModalHandler);
    }
  }
}