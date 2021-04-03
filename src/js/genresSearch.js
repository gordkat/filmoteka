// import MovieApiService from './apiService';
// import galleryTemplate from '../templates/film-card.hbs';

// const galleryRef = document.querySelector('.gallery-list');
// // console.dir(galleryRef)

// const movieApiService = new MovieApiService();
// const itemRef = document.querySelector('.gallery-list__item');
// galleryRef.addEventListener('click', filterRender);

// function filterRender(e) {
//   if (e.target.parentNode.nodeName === 'P') {
//     const genre = e.target.innerText;
//     console.dir(genre);
//     movieApiService
//       .getPopularMovies()
//       .then(response => {
//         console.dir(response);
//         const res = response.filter(res => res.genres.includes(genre));
//         console.log(res);
//         return res;
//       })
//       .then(renderMovieCard);
//     movieApiService.resetPage();
//     galleryRef.innerHTML = '';
//   }
// }

// export function renderMovieCard(res) {
//   galleryRef.insertAdjacentHTML('beforeend', galleryTemplate(res));
// }

import MovieApiService from './apiService';
import galleryTemplate from '../templates/film-card.hbs';

const galleryRef = document.querySelector('.gallery-list');

const movieApiService = new MovieApiService();
const itemRef = document.querySelector('.gallery-list__item');
galleryRef.addEventListener('click', filterRender);

function filterRender(e) {
  if (e.target.parentNode.nodeName === 'P') {
    const genre = e.target.innerText;

    movieApiService.renderMoviesByGenre(genre);

    movieApiService.resetPage();
    galleryRef.innerHTML = '';
  }
}

export function renderMovieCard(res) {
  galleryRef.insertAdjacentHTML('beforeend', galleryTemplate(res));
}
