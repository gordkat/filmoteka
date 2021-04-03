import galleryTemplate from '../templates/film-card.hbs';
import MovieApiService from './apiService';
//import { renderPagination } from './pagination';

const refs = {
  headerContainer: document.querySelector('.main-container'),
  btnMyLibrary: document.querySelector('.library-page'),
  btnHome: document.querySelector('.home-page'),
  formSearch: document.querySelector('.form-search'),
  btnAction: document.querySelector('.btn-my-library'),
  btnWatched: document.querySelector('.watched'),
  btnQueue: document.querySelector('.queue'),
  gallery: document.querySelector('.gallery-list'),
  /*пагинация
  paginationContainer: document.querySelector('.pagination__container'),*/
};

//Рендерим фильмы из массива объектов
const renderMovieCard = results => {
  refs.gallery.insertAdjacentHTML('beforeend', galleryTemplate(results));
};

//Очищаем галлерею
const clearAll = () => {
  refs.gallery.innerHTML = '';
};

//Колбек для кнопки Home
const onHome = event => {
  refs.formSearch.reset();
  clearAll();
  refs.formSearch.classList.remove('form-search--hidden');
  refs.btnAction.classList.add('btn-my-library--hidden');
  refs.btnMyLibrary.classList.remove('current');
  refs.btnHome.classList.add('current');
  refs.headerContainer.classList.remove('library-main');
  const movieApiServie = new MovieApiService();
  movieApiServie.renderPopularMovies();
  // movieApiServie.fetchMovieById(464052);
};

//Колбек для кнопки My library
const onMyLibrary = event => {
  refs.formSearch.classList.add('form-search--hidden');
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
  let watchedMovieArray = JSON.parse(
    localStorage.getItem('movie-to-watch'));
    if (!watchedMovieArray) {
    return
  } watchedMovieArray = watchedMovieArray.slice(1);

  /*пагинация 
  if(localStorage.getItem('movie-to-watch').lenght) 
  {renderMovieCard(localStorage.getItem('movie-to-watch').slice(0, 20))
  .then(results => {
      renderMovieCard(results);
      refs.paginationContainer.style.display = 'block';})}
      else {refs.paginationContainer.style.display = 'none';}*/

  renderMovieCard(watchedMovieArray);
};

//Колбек для кнопки Queue
const onQueue = () => {
  clearAll();
  refs.btnQueue.classList.add('active');
  refs.btnWatched.classList.remove('active');
  let queueMovieArray = JSON.parse(
    localStorage.getItem('movie-to-queue'));
  if (!queueMovieArray) {
    return
  }
    queueMovieArray = queueMovieArray.slice(1);

 /*пагинация 
  if(localStorage.getItem('movie-to-queue').lenght) 
  {renderMovieCard(localStorage.getItem('movie-to-queue').slice(0, 20))
  .then(results => {
      renderMovieCard(results);
      refs.paginationContainer.style.display = 'block';})}
      else {refs.paginationContainer.style.display = 'none';}*/
  
  renderMovieCard(queueMovieArray);
};

//Вешаем слушателей событий на кнопки
refs.btnHome.addEventListener('click', onHome);
refs.btnMyLibrary.addEventListener('click', onMyLibrary);
refs.btnWatched.addEventListener('click', onWatched);
refs.btnQueue.addEventListener('click', onQueue);
