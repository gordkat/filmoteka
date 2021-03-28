import './sass/main.scss';
import './js/modal';
import './js/pagination';
import './js/search';
import './js/apiService';
import footerMarkup from './partials/footer.html';
const body = document.querySelector('body');
body.insertAdjacentHTML('beforeend', footerMarkup);
