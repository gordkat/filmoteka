import galleryTemplate from '../templates/film-card.hbs';
import MovieApiService from './apiService';
import debounce from 'lodash';
const galleryRef = document.querySelector('.gallery-list');

const movieApiServie = new MovieApiService();
movieApiServie.renderPopularMovies();


export function renderMovieCard(results) {
  galleryRef.insertAdjacentHTML('beforeend', galleryTemplate(results));
}
