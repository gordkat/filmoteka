import modalMarkup from '../templates/modal-film-card.hbs';
import * as basicLightbox from 'basiclightbox';
import noposter from '../images/no-poster.png';
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
      const keyApi = 'be2bb7fd29eddf6e05cfa10ca2e7b19c';
      const baseUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${keyApi}`;
 
      return fetch(baseUrl)
        .then(res => res.json())
        .then(data => {

          //Сохраняет в массиве local storage только необходимые свойства объекта
          const poster_path = data.poster_path
            ? 'https://image.tmdb.org/t/p/w500' + data.poster_path
            : noposter;
          const modifiedData = {
            id: data.id,
            poster_path: poster_path,
            title: data.title,
            backdrop_path: data.backdrop_path,
            genres: data.genres,
            name: data.name,
            release_date: data.release_date,
          };

          data = { ...data, poster_path };
          localStorage.setItem('movie', JSON.stringify(modifiedData));
          return modalMarkup(data);
        })
        .then(result => {
          const instance = basicLightbox.create(result);
          instance.show();
          const imgRef = document.querySelector('.modal__poster');
          imgRef.setAttribute('src', event.target.src);
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
            const baseYoutubeUrl = `https://www.googleapis.com/youtube/v3/search?q=${targetName}+official+trailer&key=${youtubeKeyApi}&part=snippet,id&kind='youtube#video'order=date&maxResults=1`
            fetch(baseYoutubeUrl)
              .then(response => response.json())
              .then(data => {
                const movieId = data.items[0].id.videoId
                    return movieId;
              })
              .then(data => {
                trailerLinkRef.addEventListener('click', function() {
                  trailerLinkRef.href = `https://www.youtube.com/embed/${data}?enablejsapi=1`
                })
              })
          }

          // Выбирает кнопки "watch" и "queue" в модальном окне
          const addToWatchBtnRef = document.querySelector('.add-to-watched-btn');
          const addToQueueBtnRef = document.querySelector('.add-to-queue-btn');

          //Вешает слушателей событий на кнопки "watch" и "queue" в модальном окне
          addToWatchBtnRef.addEventListener('click', handleAddToWatchBtn);
          addToQueueBtnRef.addEventListener('click', handleAddToQueueBtn);

          function handleAddToWatchBtn() {
            const addedMovie = JSON.parse(localStorage.getItem('movie'));
            if (addToWatchBtnRef.classList.contains("add-to-watched-btn")) {
            // Сохраняет фильм в local storage при нажатии на кнопку "Add to watched"
    
              addToWatchBtnRef.classList.remove("add-to-watched-btn")
              addToWatchBtnRef.classList.add("remove-from-watched-btn")
              addToWatchBtnRef.innerText = "REMOVE FROM WATCHED"
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
              JSON.stringify(addedToWatchArray));
            // addToWatchBtnRef.disabled = true;
            } else {
               // Удаляет фильм из local storage при нажатии на кнопку "Remove from watched"

              addToWatchBtnRef.classList.add("add-to-watched-btn");
              addToWatchBtnRef.classList.remove("remove-from-watched-btn");
              addToWatchBtnRef.innerText = "ADD TO WATCHED";

              const idArray = addedToWatchArray.map(movie => {
                 console.log(movie);
              if (!movie) {
                return;
              }
              return movie.id;
            });

              const index = idArray.indexOf(addedMovie.id)
              addedToWatchArray.splice(index, 1);
              localStorage.setItem('movie-to-watch', JSON.stringify(addedToWatchArray));
                // addToWatchBtnRef.disabled = true;
            };        
          };

          function handleAddToQueueBtn() {
            const addedMovie = JSON.parse(localStorage.getItem('movie'));

            if (addToQueueBtnRef.classList.contains("add-to-queue-btn")) {
              // Сохраняет фильм в local storage при нажатии на кнопку "Add to queue"
              addToQueueBtnRef.classList.remove("add-to-queue-btn");
              addToQueueBtnRef.classList.add("remove-from-queue-btn");
              addToQueueBtnRef.innerText = "REMOVE FROM QUEUE";
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
            }
            else {
              // Удаляет фильм из local storage при нажатии на кнопку "Remove from queue"
              addToQueueBtnRef.classList.add("add-to-queue-btn");
              addToQueueBtnRef.classList.remove("remove-from-queue-btn");
              addToQueueBtnRef.innerText = "ADD TO QUEUE";
              const idArray = addedToQueueArray.map(movie => {
                console.log(movie);
                if (!movie) {
                  return;
                }
                return movie.id;
              });
              const index = idArray.indexOf(addedMovie.id)
              console.log(index);
              addedToQueueArray.splice(index, 1);
              localStorage.setItem('movie-to-queue', JSON.stringify(addedToQueueArray));
            }
          }
        });
    }
    return apiMovieCard(event.target.parentNode.dataset.id);
  }
}