import * as basicLightbox from 'basiclightbox';
import Kateryna from '../images/team/Kateryna.jpg';
import Zoya from '../images/team/Zoya.jpg';
import Anna from '../images/team/Anna.jpg';
import Anatoliy from '../images/team/Anatoliy.jpg';
import Liubov from '../images/team/Liubov.jpg';
import Maria from '../images/team/Maria.jpg';
import Andrey from '../images/team/Andrey.jpg';
import Elena from '../images/team/Elena.jpg';
import Andrii from '../images/team/Andrii.jpg';
import social from '../images/sprite.svg';

const markup = `<ul class="team__wrapper">

<li class="team__lead list">
<img src="${Kateryna}" alt="Kateryna" class="team__image">
    <p class="team__name">Kateryna</p>
    <p class="team__role">Team Lead / Developer </p>
  <ul class="team__git">
  <a class="" href="https://github.com/gordkat" target="_blank" ><svg class="logo__icon" width="16" height="16">
  <use href="${social}#github"></use>
  </svg></a>
  <a class="" href="https://linkedin.com" target="_blank" ><svg class="logo__icon" width="16" height="16">
  <use href="${social}#linkedin"></use>
</svg></a>
</ul>
</li>

<li class="team__card">
    <img src="${Zoya}" alt="Zoya" class="team__image">
    <p class="team__name">Zoya</p>
    <p class="team__role">Scrum/Developer</p>

     <ul class="team__git">
    <a class="" href="https://github.com/apostoloska-z" target="_blank" ><svg class="logo__icon" width="16" height="16">
      <use href="${social}#github"></use>
    </svg></a>
    <a class="" href="https://linkedin.com" target="_blank" ><svg class="logo__icon" width="16" height="16">
      <use href="${social}#linkedin"></use>
    </svg></a>
    </ul>
</li>

<li class="team__card">
    <img src="${Anna}" alt="Anna" class="team__image">
    <p class="team__name">Anna</p>
    <p class="team__role">Developer</p>

    <ul class="team__git">
    <a class="" href="https://github.com/Uaskoa" target="_blank" ><svg class="logo__icon" width="16" height="16">
      <use href="${social}#github"></use>
    </svg></a>
    <a class="" href="https://linkedin.com" target="_blank" ><svg class="logo__icon" width="16" height="16">
      <use href="${social}#linkedin"></use>
    </svg></a>
    </ul>
</li>

<li class="team__card">
    <img src="${Anatoliy}" alt="Anatoliy" class="team__image">
    <p class="team__name">Anatoliy</p>
    <p class="team__role">Developer</p>
    <ul class="team__git">
    <a class="" href="https://github.com/AnatoliiYarovyi" target="_blank" ><svg class="logo__icon" width="16" height="16">
      <use href="${social}#github"></use>
    </svg></a>
    <a class="" href="https://linkedin.com" target="_blank" ><svg class="logo__icon" width="16" height="16">
      <use href="${social}#linkedin"></use>
    </svg></a>
    </ul>
</li>

<li class="team__card">
    <img src="${Liubov}" alt="Liubov" class="team__image">
    <p class="team__name">Liubov</p>
    <p class="team__role">Developer</p>
    <ul class="team__git">
    <a class="" href="https://github.com/Lubasia" target="_blank" ><svg class="logo__icon" width="16" height="16">
      <use href="${social}#github"></use>
    </svg></a>
    <a class="" href="https://linkedin.com" target="_blank" ><svg class="logo__icon" width="16" height="16">
      <use href="${social}#linkedin"></use>
    </svg></a>
    </ul>
</li>
<li class="team__card">
    <img src="${Maria}" alt="Mariya" class="team__image">
    <p class="team__name">Mariya</p>
    <p class="team__role">Developer</p>
    <ul class="team__git">
    <a class="" href="https://github.com/Narmony" target="_blank" ><svg class="logo__icon" width="16" height="16">
      <use href="${social}#github"></use>
    </svg></a>
    <a class="" href="https://linkedin.com" target="_blank" ><svg class="logo__icon" width="16" height="16">
      <use href="${social}#linkedin"></use>
    </svg></a>
    </ul>
</li>
<li class="team__card">
    <img src="${Andrey}" alt="Andrey" class="team__image">
    <p class="team__name">Andrey</p>
    <p class="team__role">Developer</p>
    <ul class="team__git">
    <a class="" href="https://github.com/koval-andrey" target="_blank" ><svg class="logo__icon" width="16" height="16">
      <use href="${social}#github"></use>
    </svg></a>
    <a class="" href="https://linkedin.com" target="_blank" ><svg class="logo__icon" width="16" height="16">
      <use href="${social}#linkedin"></use>
    </svg></a>
    </ul>
</li>
<li class="team__card">
    <img src="${Elena}" alt="Elena" class="team__image">
    <p class="team__name">Elena</p>
    <p class="team__role">Developer</p>
    <ul class="team__git">
    <a class="" href="https://github.com/el-ki" target="_blank" ><svg class="logo__icon" width="16" height="16">
      <use href="${social}#github"></use>
    </svg></a>
    <a class="" href="https://linkedin.com" target="_blank" ><svg class="logo__icon" width="16" height="16">
      <use href="${social}#linkedin"></use>
    </svg></a>
    </ul>
</li>
<li class="team__card">
    <img src="${Andrii}" alt="Andrii" class="team__image">
    <p class="team__name">Andrii</p>
    <p class="team__role">Developer</p>
    <ul class="team__git">
    <a class="" href="https://github.com/Kondes" target="_blank" ><svg class="logo__icon" width="16" height="16">
      <use href="${social}#github"></use>
    </svg></a>
    <a class="" href="https://linkedin.com" target="_blank" ><svg class="logo__icon" width="16" height="16">
      <use href="${social}#linkedin"></use>
    </svg></a>
    </ul>
</li></ul>`;

const container = document.querySelector('.js-team__modal');

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