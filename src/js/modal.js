import modalMarkup from '../templates/modal-film-card.hbs';
import * as basicLightbox from 'basiclightbox';

const mainRef = document.querySelector('.gallery-list');

let addedToWatchArray = [...JSON.parse(localStorage.getItem("movie-to-watch"))];
let addedToQueueArray = [...JSON.parse(localStorage.getItem("movie-to-queue"))];

mainRef.addEventListener('click', openModal);


function openModal(event) {
    if (event.target.parentNode.nodeName === 'LI') {

        function apiMovieCard (movieId) {
            const keyApi = 'be2bb7fd29eddf6e05cfa10ca2e7b19c';
            const baseUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${keyApi}`;
            return fetch(baseUrl)
              .then(res => res.json())
              .then(data => {

                const modifiedData = {
                  id: data.id,
                  poster_path: data.poster_path,
                  title: data.title,
                  backdrop_path: data.backdrop_path,
                  genres: data.genres,
                  name: data.name,
                  release_date: data.release_date,
                };

                localStorage.setItem("movie", JSON.stringify(modifiedData));
                return modalMarkup(data);
              })
              .then(result => {
                const instance = basicLightbox.create(result);
                instance.show();
                const mRef = document.querySelector('article')
                mRef.classList.add('modal-film-card-active')

                function escapeBtn(event) {
                  if (event.code === 'Escape' && mRef.classList.contains('modal-film-card-active')) {
                      instance.close();
                      mRef.classList.remove('modal-film-card-active');
                  }
                }

                window.addEventListener('keydown', escapeBtn) ;


               const addToWatchBtnRef = document.querySelector('.add-to-watched-btn');
               const addToQueueBtnRef = document.querySelector('.add-to-queue-btn');

                addToWatchBtnRef.addEventListener('click', handleAddToWatchBtn);
                addToQueueBtnRef.addEventListener('click', handleAddToQueueBtn);

                function handleAddToWatchBtn() {
                  const addedMovie = JSON.parse(localStorage.getItem("movie"));
                  addedToWatchArray.push(addedMovie);
                  localStorage.setItem("movie-to-watch", JSON.stringify(addedToWatchArray));
                  addToWatchBtnRef.disabled = true;
                }

                function handleAddToQueueBtn() {
                  const addedMovie = JSON.parse(localStorage.getItem("movie"));
                  addedToQueueArray.push(addedMovie);
                  localStorage.setItem("movie-to-queue", JSON.stringify(addedToQueueArray));
                  addToQueueBtnRef.disabled = true;
                }
             })
        }

        return apiMovieCard(event.target.parentNode.dataset.id);
      }
    }


