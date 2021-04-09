import galleryTemplate from '../templates/film-card.hbs';
import MovieApiService from './apiService';
import empty from '../images/empty.jpg';
import { notice } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import refs from './refs';
import unsetInfiniteScroll from './genresSearch';

const news = message => {
  notice({
    text: message,
    maxTextHeight: null,
    delay: 2000,
  });
};

//Рендерим фильмы из массива объектов
const renderMovieCard = results => {
  refs.gallery.insertAdjacentHTML('beforeend', galleryTemplate(results));
};

//Очищаем галлерею
const clearAll = () => {
  unsetInfiniteScroll();
  refs.gallery.innerHTML = '';
};

//Колбек для кнопки Home
const onHome = () => {
  refs.form.reset();
  clearAll();
  refs.paginationContainer.style.display = 'block';
  refs.form.classList.remove('form-search--hidden');
  refs.btnAction.classList.add('btn-my-library--hidden');
  refs.btnMyLibrary.classList.remove('current');
  refs.btnHome.classList.add('current');
  refs.headerContainer.classList.remove('library-main');
  const movieApiServie = new MovieApiService();
  movieApiServie.renderPopularMovies();
};

//Колбек для кнопки My library
const onMyLibrary = () => {
  clearAll();
  refs.paginationContainer.style.display = 'none';
  refs.form.classList.add('form-search--hidden');
  refs.btnAction.classList.remove('btn-my-library--hidden');
  refs.btnMyLibrary.classList.add('current');
  refs.btnHome.classList.remove('current');
  refs.headerContainer.classList.add('library-main');
  onWatched();
};

//Колбек для кнопки Watched
const onWatched = () => {
  clearAll();
  refs.btnWatched.classList.add('active');
  refs.btnQueue.classList.remove('active');
  let watchedMovieArray = JSON.parse(localStorage.getItem('movie-to-watch'));
  if (!watchedMovieArray || (!watchedMovieArray[0] && !watchedMovieArray[1])) {
    refs.gallery.innerHTML = `<img src="${empty}"  alt="There is nothing" />`;
    news('There is nothing her');
    return;
  }

  watchedMovieArray = watchedMovieArray.slice(1);
  renderMovieCard(watchedMovieArray);
};

//Колбек для кнопки Queue
const onQueue = () => {
  clearAll();
  refs.btnQueue.classList.add('active');
  refs.btnWatched.classList.remove('active');
  let queueMovieArray = JSON.parse(localStorage.getItem('movie-to-queue'));
  if (!queueMovieArray || (!queueMovieArray[0] && !queueMovieArray[1])) {
    refs.gallery.innerHTML = `<img src="${empty}"  alt="There is nothing" />`;
    news('There is nothing here');
    return;
  }
  queueMovieArray = queueMovieArray.slice(1);
  renderMovieCard(queueMovieArray);
};

//Вешаем слушателей событий на кнопки
refs.btnHome.addEventListener('click', onHome);
refs.btnMyLibrary.addEventListener('click', onMyLibrary);
refs.btnWatched.addEventListener('click', onWatched);
refs.btnQueue.addEventListener('click', onQueue);
