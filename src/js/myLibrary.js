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

const renderMovieCard = results => {
  refs.gallery.insertAdjacentHTML('beforeend', galleryTemplate(results));
};

const clearAll = () => {
  refs.gallery.innerHTML = '';
};

const onHome = event => {
  refs.formSearch.reset();
  clearAll();
  refs.btnHome.classList.add('current');
  refs.btnMyLibrary.classList.remove('current');
  refs.formSearch.classList.remove('form-search--hidden');
  refs.btnAction.classList.add('btn-my-library--hidden');
  const movieApiServie = new MovieApiService();
  movieApiServie.renderMovies();
};

const onMyLibrary = event => {
  refs.btnHome.classList.remove('current');
  refs.btnMyLibrary.classList.add('current');
  refs.formSearch.classList.add('form-search--hidden');
  refs.btnAction.classList.remove('btn-my-library--hidden');
  onWatched();
};

const onWatched = () => {
  clearAll();
  refs.btnWatched.classList.add('active');
  refs.btnQueue.classList.remove('active');
  const watchedMovieArray = JSON.parse(
    localStorage.getItem('movie-to-watch'),
  ).slice(1);
  renderMovieCard(watchedMovieArray);
};

const onQueue = () => {
  clearAll();
  refs.btnWatched.classList.remove('active');
  refs.btnQueue.classList.add('active');
  const queueMovieArray = JSON.parse(
    localStorage.getItem('movie-to-queue'),
  ).slice(1);
  renderMovieCard(queueMovieArray);
};

refs.btnHome.addEventListener('click', onHome);
refs.btnMyLibrary.addEventListener('click', onMyLibrary);
refs.btnWatched.addEventListener('click', onWatched);
refs.btnQueue.addEventListener('click', onQueue);
