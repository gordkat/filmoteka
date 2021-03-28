import './sass/main.scss';
import footerMarkup from './partials/footer.html';

const body = document.querySelector('body');

body.insertAdjacentHTML('beforeend', footerMarkup);

import './js/modal';
import './js/pagination';
import './js/search';
