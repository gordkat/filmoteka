import * as basicLightbox from 'basiclightbox';

const markup = `<div class="team__wrapper">
<div class="team__card">
    <img src=" " alt="Kateryna" class="team__image">
    <p class="team__name">Kateryna</p>
    <p class="team__role">Team Lead / Developer </p>
    
</div>
<div class="team__card">
    <img src=" " alt="Zoya" class="team__image">
    <p class="team__name">Zoya</p>
    <p class="team__role">Scrum Master / Developer</p>
</div>
<div class="team__card">
    <img src=" " alt="Anna" class="team__image">
    <p class="team__name">Anna</p>
    <p class="team__role">Developer</p>
</div>
<div class="team__card">
    <img src=" " alt="Anatoliy" class="team__image">
    <p class="team__name">Anatoliy</p>
    <p class="team__role">Developer</p>
</div>
<div class="team__card">
    <img src=" " alt="Liubov" class="team__image">
    <p class="team__name">Liubov</p>
    <p class="team__role">Developer</p>
</div>
<div class="team__card">
    <img src=" " alt="Iryna" class="team__image">
    <p class="team__name">Iryna</p>
    <p class="team__role">Developer</p>
</div>
<div class="team__card">
    <img src=" " alt="Andrey" class="team__image">
    <p class="team__name">Andrey</p>
    <p class="team__role">Developer</p>
</div>
<div class="team__card">
    <img src=" " alt="Elena" class="team__image">
    <p class="team__name">Elena</p>
    <p class="team__role">Developer</p>
</div></div>`;

const container = document.querySelector('.js-team__modal');
// const markup2 = `<img src=" "/>`;

container.addEventListener('click', openModal);

const modal = basicLightbox.create(markup);

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