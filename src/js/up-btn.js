import throttle from 'lodash.throttle';
import refs from './refs';


window.addEventListener('scroll', throttle(hideElOnScroll(refs.upBtn), 250));
refs.upBtn.addEventListener('click', toPageTopOnClick);

function hideElOnScroll(el) {
  return function hideOnScroll() {
    if (pageYOffset < document.documentElement.clientHeight) {
      el.classList.add('visually-hidden');
    } else {
      el.classList.remove('visually-hidden');
    }
  };
}

function toPageTopOnClick() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}