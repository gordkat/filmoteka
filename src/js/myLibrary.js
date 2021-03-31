import galleryTemplate from '../templates/film-card.hbs';
// import { renderMovies, renderMovieCard } from './renderPopularMovies';
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

const isClassListContain = () => {
  const isHiddenForm = refs.formSearch.classList.contains(
    'form-search--hidden',
  );
  const isVisibleForm = !isHiddenForm;
  const isVisibleBtnAction = !refs.btnAction.classList.contains(
    'btn-my-library--hidden',
  );
  const isHiddenBtnAction = !isVisibleBtnAction;
  return { isHiddenForm, isVisibleForm, isVisibleBtnAction, isHiddenBtnAction };
};

const renderMovieCard = results => {
  refs.gallery.insertAdjacentHTML('beforeend', galleryTemplate(results));
};

const clearAll = () => {
  refs.gallery.innerHTML = '';
};

const onHome = event => {
  console.log('рендерятся популярные фильмы, резетится форма');
  refs.formSearch.reset();
  const { isHiddenForm, isVisibleBtnAction } = isClassListContain();
  if (isHiddenForm) {
    refs.formSearch.classList.remove('form-search--hidden');
  }
  if (isVisibleBtnAction) {
    refs.btnAction.classList.add('btn-my-library--hidden');
  }
  const movieApiServie = new MovieApiService();
  movieApiServie.renderMovies();
};

const onMyLibrary = event => {
  console.log(
    'рендерятся из локалстораж просмотренные фильмы, скрывается поиск, появляются кнопки, меняется фон',
  );
  isClassListContain();
  const { isVisibleForm, isHiddenBtnAction } = isClassListContain();
  if (isVisibleForm) {
    refs.formSearch.classList.add('form-search--hidden');
  }
  if (isHiddenBtnAction) {
    refs.btnAction.classList.remove('btn-my-library--hidden');
  }
  onWatched();
};

const onWatched = () => {
  clearAll();
  const watchedMovieArray = JSON.parse(localStorage.getItem('movie-to-watch')).slice(1);
  renderMovieCard(watchedMovieArray);
};

const onQueue = () => {
  clearAll();
  const queueMovieArray = JSON.parse(localStorage.getItem('movie-to-queue')).slice(1);
  renderMovieCard(queueMovieArray);
};

refs.btnHome.addEventListener('click', onHome);
refs.btnMyLibrary.addEventListener('click', onMyLibrary);
refs.btnWatched.addEventListener('click', onWatched);
refs.btnQueue.addEventListener('click', onQueue);
