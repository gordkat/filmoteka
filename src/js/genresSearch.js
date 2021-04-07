import MovieApiService from './apiService';
import galleryTemplate from '../templates/film-card.hbs';

const galleryRef = document.querySelector('.gallery-list');

const movieApiService = new MovieApiService();
const itemRef = document.querySelector('.gallery-list__item');
const paginationRef = document.querySelector('.pagination__container');
galleryRef.addEventListener('click', filterRender);
const galleryContainerRef = document.querySelector('.cards-container');

let observerRef = '';
let genre = '';
let observer;

function filterRender(e) {
  if (e.target.parentNode.nodeName === 'P') {
    genre = e.target.innerText;
    movieApiService.renderMoviesByGenre(genre);

    movieApiService.increamentPage();
    galleryRef.innerHTML = '';

    // для возврата отображения пагинации нужно удалить только функцию setinfinitScroll()
    setInfiniteScroll();
  }
}

function setInfiniteScroll() {
  paginationRef.classList.add('visually-hidden');
  const observerEl = document.createElement('div');
  observerEl.classList.add('observer');
  galleryContainerRef.after(observerEl);
  observerRef = document.querySelector('.observer');
  const onEntry = (entries, observer) => {
    {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          movieApiService.renderMoviesByGenre(genre);
          movieApiService.increamentPage();
        }
      });
    }
  };
  observer = new IntersectionObserver(onEntry);
  observer.observe(observerRef);
}

export default function unsetInfiniteScroll() {
  paginationRef.classList.remove('visually-hidden');
  if (observer) {
    observer.disconnect();
  }
}
