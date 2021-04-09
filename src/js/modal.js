import modalMarkup from '../templates/modal-film-card.hbs';
import * as basicLightbox from 'basiclightbox';
import noposter from '../images/no-poster.png';
import MovieApiService from './apiService';
import galleryTemplate from '../templates/film-card.hbs';
import refs from './refs';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { error } from '@pnotify/core';
import { defaults } from '@pnotify/core';
defaults.closerHover = false;
import empty from '../images/empty.jpg';


const addedToWatchArray = [
  ...JSON.parse(localStorage.getItem('movie-to-watch')),
];
const addedToQueueArray = [
  ...JSON.parse(localStorage.getItem('movie-to-queue')),
];

refs.gallery.addEventListener('click', openModal);

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
          articleRef.classList.add('modal-active');
          btnRef.addEventListener('click', closeModal);
          window.addEventListener('keydown', escapeBtn);
          const searchRef = document.querySelector('.trailer-Q')
          searchRef.addEventListener('click', enableTrailerLink)

          function closeModal() {
            instance.close();
            articleRef.classList.remove('modal-active');
          }

          function escapeBtn(event) {
            if (
              event.code === 'Escape' &&
              articleRef.classList.contains('modal-active')
            ) {
              closeModal();
            }
          }

          if (!articleRef.classList.contains('modal-active')) {
            window.removeEventListener('click', escapeBtn);
            btnRef.removeEventListener('click', closeModal);
          }

          function enableTrailerLink() {
            const targetName = document.querySelector('.modal__film-title').textContent;
            const trailerLinkRef = document.querySelector('.trailer-link');
            trailerLinkRef.classList.add('enable');

            const youtubeKeyApi = 'AIzaSyDJJjQz7c6w4qaiZdybkdQTYOdfJPDLMsE';
            const baseYoutubeUrl = `https://www.googleapis.com/youtube/v3/search?q=${targetName}+official+trailer&key=${youtubeKeyApi}&part=snippet,id&kind='youtube#video'order=date&maxResults=1`;
            fetch(baseYoutubeUrl)
              .then(response => {
                if (!response.ok) {
                    
                    trailerLinkRef.target = '_self';
                    document.querySelector('.trailer-link__text').textContent = 'Sorry, CURRENTLY UNAVAILABLE'
                }
                return response.json();
              })
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
          const refs = {
          addToWatchBtn: document.querySelector('.add-to-watched-btn'),
          addToQueueBtn: document.querySelector('.add-to-queue-btn'),
          }

          //Отображает статус кнопки "watched" при открытии модального окна
          saveBtnStatusOnModalOpen(addedToWatchArray, refs.addToWatchBtn, "watched");

          //Отображает статус кнопки "queue" при открытии модального окна
          saveBtnStatusOnModalOpen(addedToQueueArray, refs.addToQueueBtn, "queue");

          //Вешает слушателей событий на кнопки "watch" и "queue" в модальном окне
          refs.addToWatchBtn.addEventListener('click', handleAddToWatchBtn);
          refs.addToQueueBtn.addEventListener('click', handleAddToQueueBtn);

          function handleAddToWatchBtn() {
            const addedMovie = JSON.parse(localStorage.getItem('movie'));
            if (refs.addToWatchBtn.classList.contains('add-to-watched-btn')) {

              // Сохраняет фильм в local storage при нажатии на кнопку "Add to watched"
              refs.addToWatchBtn.classList.remove('add-to-watched-btn');
              refs.addToWatchBtn.classList.add('remove-from-watched-btn');
              refs.addToWatchBtn.innerText = 'REMOVE FROM WATCHED';
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
              refs.addToQueueBtn.disabled = true;
            } else {
              // Удаляет фильм из local storage при нажатии на кнопку "Remove from watched"
              refs.addToWatchBtn.classList.add('add-to-watched-btn');
              refs.addToWatchBtn.classList.remove('remove-from-watched-btn');
              refs.addToWatchBtn.innerText = 'ADD TO WATCHED';

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
                pageRerender('movie-to-watch');
                if (addedToWatchArray.length === 1) {
                const refs = {
                  gallery: document.querySelector('.gallery-list'),
                }
                refs.gallery.innerHTML = `<img src="${empty}"  alt="There is nothing" />`;
                }
              }
              refs.addToQueueBtn.disabled = false;
            }
          }

          function handleAddToQueueBtn() {
            const addedMovie = JSON.parse(localStorage.getItem('movie'));

            if (refs.addToQueueBtn.classList.contains('add-to-queue-btn')) {
              // Сохраняет фильм в local storage при нажатии на кнопку "Add to queue"
              refs.addToQueueBtn.classList.remove('add-to-queue-btn');
              refs.addToQueueBtn.classList.add('remove-from-queue-btn');
              refs.addToQueueBtn.innerText = 'REMOVE FROM QUEUE';
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
              refs.addToWatchBtn.disabled = true;
            } else {
              // Удаляет фильм из local storage при нажатии на кнопку "Remove from queue"
              refs.addToQueueBtn.classList.add('add-to-queue-btn');
              refs.addToQueueBtn.classList.remove('remove-from-queue-btn');
              refs.addToQueueBtn.innerText = 'ADD TO QUEUE';
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
                pageRerender('movie-to-queue');
              if (addedToQueueArray.length === 1) {
                const refs = {
                  gallery: document.querySelector('.gallery-list'),
                }
                refs.gallery.innerHTML = `<img src="${empty}"  alt="There is nothing" />`;
                }
              }
              refs.addToWatchBtn.disabled = false;
            }
          }
        });
    }
    return apiMovieCard(event.target.parentNode.dataset.id);
  }
}

//Сохраняет статус кнопок при открытии модального окна
function saveBtnStatusOnModalOpen(array, btnRef, className) {
    const refs = {
  addToWatchBtn: document.querySelector('.add-to-watched-btn'),
  addToQueueBtn: document.querySelector('.add-to-queue-btn'),
  }
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
  if (className === 'watched') {
    refs.addToQueueBtn.disabled = true;
  } if (className === 'queue') {
    refs.addToWatchBtn.disabled = true;
  }
}
}

// Рендерит разметку с новым массивом без удаленного фильма
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