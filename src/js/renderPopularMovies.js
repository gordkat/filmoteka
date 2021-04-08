import galleryTemplate from '../templates/film-card.hbs';
import MovieApiService from './apiService';
import refs from './refs.js';
// import debounce from 'lodash';


const movieApiService = new MovieApiService();
movieApiService.renderPopularMovies();

export function renderMovieCard(results) {
  refs.gallery.insertAdjacentHTML('beforeend', galleryTemplate(results));
}
