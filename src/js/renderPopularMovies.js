import galleryTemplate from '../templates/film-card.hbs';

export const galleryRef = document.querySelector('.gallery-list');

export function renderMovieCard(results) {
  galleryRef.insertAdjacentHTML('beforeend', galleryTemplate(results));
}
