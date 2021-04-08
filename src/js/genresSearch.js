import MovieApiService from './apiService';
import refs from './refs.js';

let observerRef = '';
let genre = '';
let observer;
const movieApiService = new MovieApiService();

refs.gallery.addEventListener('click', filterHandler);

function filterHandler(e) {
  unsetInfiniteScroll();
  if (e.target.parentNode.nodeName === 'P') {
    genre = e.target.innerText;
    refs.gallery.innerHTML = '';
    movieApiService.resetPage();
    setInfiniteScroll();
  }
}

function setInfiniteScroll() {
  refs.paginationContainer.classList.add('visually-hidden');
  const observerEl = document.createElement('div');
  observerEl.classList.add('observer');
  refs.galleryContainer.after(observerEl);
  observerRef = document.querySelector('.observer');
  const onEntry = (entries, observer) => {
    {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          movieApiService.increamentPage();
          movieApiService.renderMoviesByGenre(genre);
        }
      });
    }
  };
  observer = new IntersectionObserver(onEntry);
  observer.observe(observerRef);
}

export default function unsetInfiniteScroll() {
  refs.paginationContainer.classList.remove('visually-hidden');
  if (observer) {
    observer.disconnect();
  }
}
