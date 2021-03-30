import galleryTemplate from '../templates/film-card.hbs';
import MovieApiService from './apiService';
import debounce from 'lodash';
const galleryRef = document.querySelector('.gallery-list');


const movieApiServie = new MovieApiService();
movieApiServie.renderMovies();

export function renderMovieCard(results) {
  galleryRef.insertAdjacentHTML('beforeend', galleryTemplate(results));
}

// movieApiServie.getPopularMovies().then(renderMovieCard);



  

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
//     galleryRef.innerHTML = '';
//     movieApiServie.getPopularMovies().then(renderMovieCard);
//     return
//   }
//   movieApiServie.query = inputRef.value;
//   galleryRef.innerHTML = '';
//   movieApiServie.searchMovie().then(renderMovieCard);

// }
