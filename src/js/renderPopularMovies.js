import galleryTemplate from '../templates/film-card.hbs';
import MovieApiService from './apiService';
import debounce from 'lodash';
const galleryRef = document.querySelector('.gallery-list');

const movieApiService = new MovieApiService();
movieApiService.renderPopularMovies();


export function renderMovieCard(results) {
  galleryRef.insertAdjacentHTML('beforeend', galleryTemplate(results));
}
