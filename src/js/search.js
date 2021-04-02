import MovieApiService from './apiService';
import galleryTemplate from '../templates/film-card.hbs';
import '@pnotify/core/dist/BrightTheme.css';

import spinnerModal from './spinner'; //Функция которая добавляет или убирает клас is-hidden (toggle)

// import { notice, error } from '@pnotify/core';

const searchMovie = new MovieApiService();

const refs = {
  heder: document.querySelector('.main-container'),
  inputForm: document.querySelector('.input-text'),
  gallery: document.querySelector('.gallery-list'),
  form: document.querySelector('.form-search'),
  lensSearch: document.querySelector('.logo-search'),
};

refs.lensSearch.addEventListener('click', onSearch);
refs.form.addEventListener('submit', onSearch);

function onSearch(e) {
  spinnerModal(); //Убирает клас is-hidden
  e.preventDefault();
  if (refs.inputForm.value === '') {
    refs.gallery.innerHTML = '';
    //  window.location.reload();
    return searchMovie.getPopularMovies().then(renderMovieCard);
  }

  searchMovie.resetPage();
  searchMovie.query = refs.inputForm.value.trim();
  const find = searchMovie.query;

  refs.gallery.innerHTML = '';
  searchMovie.searchMovies().then(renderMovieCard);
}
export function renderMovieCard(results) {
  if (results.length == 0) {
    const error = document.createElement('p');
    error.classList.add('error-message');
    error.textContent =
      'Search result not successful. Enter the correct movie name and try again';
    refs.heder.append(error);

    setTimeout(() => {
      refs.inputForm.value = '';
    }, 1800);

    setTimeout(() => {
      refs.heder.removeChild(error);
    }, 2300);

    setTimeout(() => {
      spinnerModal(); //Убирает клас is-hidden
      searchMovie.getPopularMovies().then(renderMovieCard);
    }, 2500);
  }
  refs.gallery.insertAdjacentHTML('beforeend', galleryTemplate(results));
  spinnerModal(); //Добавляет клас is-hidden
}
