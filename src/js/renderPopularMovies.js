import galleryTemplate from '../templates/film-card.hbs';
import MovieApiService from './apiService'


const movieApiServie = new MovieApiService();
const galleryRef = document.querySelector('.gallery-list');

 export function renderMovieCard(results) {
  galleryRef.insertAdjacentHTML('beforeend', galleryTemplate(results));
}



movieApiServie.normalizedMovies().then(renderMovieCard);