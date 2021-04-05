import throttle from 'lodash.throttle';

const upBtn = document.querySelector('[data-up-btn]');

window.addEventListener('scroll', throttle(hideElOnScroll(upBtn), 250));
upBtn.addEventListener('click', toPageTopOnClick);

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