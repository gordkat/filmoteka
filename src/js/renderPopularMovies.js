import galleryTemplate from '../templates/film-card.hbs';
import MovieApiService from './apiService';
import debounce from 'lodash';

const movieApiServie = new MovieApiService();
const galleryRef = document.querySelector('.gallery-list');

export function renderMovieCard(results) {
  galleryRef.insertAdjacentHTML('beforeend', galleryTemplate(results));
}

movieApiServie.getPopularMovies().then(renderMovieCard);

// Пример для Марии. показывает, что отрисовывает по поиску

// const inputRef = document.querySelector('.input-text')

// inputRef.addEventListener(
//   'input',
//   _.debounce(() => {
//     onSearch();
//   }, 1000),
// );

// function onSearch() {

//   if (!inputRef.value) {
//     return
//   }
//   movieApiServie.query = inputRef.value;
//   galleryRef.innerHTML = '';
//   movieApiServie.searchMovie().then(renderMovieCard);
// }
