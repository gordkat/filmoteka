import galleryTemplate from '../templates/film-card.hbs';
import MovieApiService from './apiService';

const refs = {
  btnMyLibrary: document.querySelector('.library-page'),
  btnHome: document.querySelector('.home-page'),
  formSearch: document.querySelector('.form-search'),
  btnAction: document.querySelector('.btn-my-library'),
  btnWatched: document.querySelector('.watched'),
  btnQueue: document.querySelector('.queue'),
  gallery: document.querySelector('.gallery-list'),
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
  console.log('рендерятся популярные фильмы, резетится форма');
  refs.formSearch.reset();
  clearAll();
  refs.formSearch.classList.remove('form-search--hidden');
  refs.btnAction.classList.add('btn-my-library--hidden');
  refs.btnMyLibrary.classList.remove('current');
  refs.btnHome.classList.add('current');
  const movieApiServie = new MovieApiService();
  movieApiServie.renderMovies();
};

//Колбек для кнопки My library
const onMyLibrary = event => {
  console.log(
    'рендерятся из локалстораж просмотренные фильмы, скрывается поиск, появляются кнопки, меняется фон',
  );
  refs.formSearch.classList.add('form-search--hidden');
  refs.btnAction.classList.remove('btn-my-library--hidden');
  refs.btnMyLibrary.classList.add('current');
  refs.btnHome.classList.remove('current');
  onWatched();
};

//Колбек для кнопки Watched
const onWatched = () => {
  clearAll();
  refs.btnWatched.classList.add('active');
  refs.btnQueue.classList.remove('active');
  const watchedMovieArray = JSON.parse(
    localStorage.getItem('movie-to-watch'),
  ).slice(1);
  renderMovieCard(watchedMovieArray);
};

//Колбек для кнопки Queue
const onQueue = () => {
  clearAll();
  refs.btnQueue.classList.add('active');
  refs.btnWatched.classList.remove('active');
  const queueMovieArray = JSON.parse(
    localStorage.getItem('movie-to-queue'),
  ).slice(1);
  renderMovieCard(queueMovieArray);
};

//Вешаем слушателей событий на кнопки
refs.btnHome.addEventListener('click', onHome);
refs.btnMyLibrary.addEventListener('click', onMyLibrary);
refs.btnWatched.addEventListener('click', onWatched);
refs.btnQueue.addEventListener('click', onQueue);
