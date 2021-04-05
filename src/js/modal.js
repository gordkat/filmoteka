import modalMarkup from '../templates/modal-film-card.hbs';
import * as basicLightbox from 'basiclightbox';
import noposter from '../images/no-poster.png';
import MovieApiService from './apiService';
import galleryTemplate from '../templates/film-card.hbs';

const mainRef = document.querySelector('.gallery-list');

const addedToWatchArray = [
  ...JSON.parse(localStorage.getItem('movie-to-watch')),
];
const addedToQueueArray = [
  ...JSON.parse(localStorage.getItem('movie-to-queue')),
];

mainRef.addEventListener('click', openModal);

function openModal(event) {
  if (event.target.parentNode.nodeName === 'LI') {
    function apiMovieCard(movieId) {
      const movieApiService = new MovieApiService();
      movieApiService
        .fetchMovieById(movieId)
        .then(data => {
          //Сохраняет в массиве local storage только необходимые свойства объекта
          const poster_path = data.poster_path
            ? 'https://image.tmdb.org/t/p/w500' + data.poster_path
            : noposter;
          const genres = data.genres.map(genre => genre.name);
          const release_date = data.release_date.split('-')[0];
          const modifiedData = {
            id: data.id,
            poster_path,
            title: data.title,
            backdrop_path: data.backdrop_path,
            genres,
            name: data.name,
            release_date,
          };

          data = { ...data, poster_path };
          localStorage.setItem('movie', JSON.stringify(modifiedData));
          return modalMarkup(data);
        })
        .then(result => {
          const instance = basicLightbox.create(result);
          instance.show();
          const articleRef = document.querySelector('article');
          const btnRef = document.querySelector('.close-button');
          articleRef.classList.add('modal-film-card-active');
          btnRef.addEventListener('click', closeModal);
          window.addEventListener('keydown', escapeBtn);
          enableTrailerLink();

          function closeModal() {
            instance.close();
            articleRef.classList.remove('modal-film-card-active');
          }

          function escapeBtn(event) {
            if (
              event.code === 'Escape' &&
              articleRef.classList.contains('modal-film-card-active')
            ) {
              closeModal();
            }
          }

          if (!articleRef.classList.contains('modal-film-card-active')) {
            window.removeEventListener('click', escapeBtn);
            btnRef.removeEventListener('click', closeModal);
          }

          function enableTrailerLink() {
            const targetName = document.querySelector('.title').textContent;
            const trailerLinkRef = document.querySelector('.trailer-link');

            const youtubeKeyApi = 'AIzaSyDJJjQz7c6w4qaiZdybkdQTYOdfJPDLMsE';
            const baseYoutubeUrl = `https://www.googleapis.com/youtube/v3/search?q=${targetName}+official+trailer&key=${youtubeKeyApi}&part=snippet,id&kind='youtube#video'order=date&maxResults=1`;
            fetch(baseYoutubeUrl)
              .then(response => response.json())
              .then(data => {
                const movieId = data.items[0].id.videoId;
                return movieId;
              })
              .then(data => {
                trailerLinkRef.addEventListener('click', function () {
                  trailerLinkRef.href = `https://www.youtube.com/embed/${data}?enablejsapi=1`;
                });
              });
          }

          // Выбирает кнопки "watch" и "queue" в модальном окне
          const addToWatchBtnRef = document.querySelector(
            '.add-to-watched-btn',
          );
          const addToQueueBtnRef = document.querySelector('.add-to-queue-btn');

          //Отображает статус кнопки "watched" при открытии модального окна
          saveBtnStatusOnModalOpen(addedToWatchArray, addToWatchBtnRef, "watched");

          //Отображает статус кнопки "queue" при открытии модального окна
          saveBtnStatusOnModalOpen(addedToQueueArray, addToQueueBtnRef, "queue");

          //Вешает слушателей событий на кнопки "watch" и "queue" в модальном окне
          addToWatchBtnRef.addEventListener('click', handleAddToWatchBtn);
          addToQueueBtnRef.addEventListener('click', handleAddToQueueBtn);

          function handleAddToWatchBtn() {
            const addedMovie = JSON.parse(localStorage.getItem('movie'));
            if (addToWatchBtnRef.classList.contains('add-to-watched-btn')) {

              // Сохраняет фильм в local storage при нажатии на кнопку "Add to watched"
              addToWatchBtnRef.classList.remove('add-to-watched-btn');
              addToWatchBtnRef.classList.add('remove-from-watched-btn');
              addToWatchBtnRef.innerText = 'REMOVE FROM WATCHED';
              const idArray = addedToWatchArray.map(movie => {
                if (!movie) {
                  return;
                }
                return movie.id;
              });

              if (idArray.includes(addedMovie.id)) {
                return;
              }

              addedToWatchArray.push(addedMovie);
              localStorage.setItem(
                'movie-to-watch',
                JSON.stringify(addedToWatchArray),
              );
            } else {
              // Удаляет фильм из local storage при нажатии на кнопку "Remove from watched"
              addToWatchBtnRef.classList.add('add-to-watched-btn');
              addToWatchBtnRef.classList.remove('remove-from-watched-btn');
              addToWatchBtnRef.innerText = 'ADD TO WATCHED';

              const idArray = addedToWatchArray.map(movie => {
                if (!movie) {
                  return;
                }
                return movie.id;
              });

              const index = idArray.indexOf(addedMovie.id);
              addedToWatchArray.splice(index, 1);
              localStorage.setItem(
                'movie-to-watch',
                JSON.stringify(addedToWatchArray),
              );
              // Проверяет на какой вкладке находимся
              const homeRef = document.querySelector('.home-page');
              if(!homeRef.classList.contains('current')){
              // Рендерит разметку с новым массивом без удаленного фильма
              pageRerender('movie-to-watch');}
            }
          }

          function handleAddToQueueBtn() {
            const addedMovie = JSON.parse(localStorage.getItem('movie'));

            if (addToQueueBtnRef.classList.contains('add-to-queue-btn')) {
              // Сохраняет фильм в local storage при нажатии на кнопку "Add to queue"
              addToQueueBtnRef.classList.remove('add-to-queue-btn');
              addToQueueBtnRef.classList.add('remove-from-queue-btn');
              addToQueueBtnRef.innerText = 'REMOVE FROM QUEUE';
              const idArray = addedToQueueArray.map(movie => {
                if (!movie) {
                  return;
                }
                return movie.id;
              });
              if (idArray.includes(addedMovie.id)) {
                return;
              }
              addedToQueueArray.push(addedMovie);
              localStorage.setItem(
                'movie-to-queue',
                JSON.stringify(addedToQueueArray),
              );
            } else {
              // Удаляет фильм из local storage при нажатии на кнопку "Remove from queue"
              addToQueueBtnRef.classList.add('add-to-queue-btn');
              addToQueueBtnRef.classList.remove('remove-from-queue-btn');
              addToQueueBtnRef.innerText = 'ADD TO QUEUE';
              const idArray = addedToQueueArray.map(movie => {
                if (!movie) {
                  return;
                }
                return movie.id;
              });
              const index = idArray.indexOf(addedMovie.id);
              addedToQueueArray.splice(index, 1);
              localStorage.setItem(
                'movie-to-queue',
                JSON.stringify(addedToQueueArray),
              );
              // Проверяет на какой вкладке находимся
              const homeRef = document.querySelector('.home-page');
              const queueRef = document.querySelector('.queue');
              if(!homeRef.classList.contains('current') && queueRef.classList.contains('queue')){
              // Рендерит разметку с новым массивом без удаленного фильма
              pageRerender('movie-to-queue');}
            }
          }
        });
    }
    return apiMovieCard(event.target.parentNode.dataset.id);
  }
}


function saveBtnStatusOnModalOpen(array, btnRef, className) {
  const addedMovie = JSON.parse(localStorage.getItem('movie'));
  const idArray = array.map(movie => {
      if (!movie) {
        return;
      }
      return movie.id;
    });

if (idArray.includes(addedMovie.id)) {

  btnRef.classList.remove(`add-to-${className}-btn`);
  btnRef.classList.add(`remove-from-${className}-btn`);
  btnRef.innerText = `REMOVE FROM ${className.toUpperCase()}`;
}
}


function pageRerender(localStorageKey) {
  const galleryRef = document.querySelector('.gallery-list');
  const clearAll = () => {
  galleryRef.innerHTML = '';
};
  const renderMovieCard = results => {
  galleryRef.insertAdjacentHTML('beforeend', galleryTemplate(results));
              };
              clearAll();
    let movieArray = JSON.parse(
    localStorage.getItem(`${localStorageKey}`));
    if (!movieArray) {
    return
  }
  movieArray = movieArray.slice(1);

  renderMovieCard(movieArray);
}