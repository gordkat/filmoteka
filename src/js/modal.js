import modalMarkup from '../templates/modal-film-card.hbs';
import * as basicLightbox from 'basiclightbox';

const mainRef = document.querySelector('.gallery-list');

let addedToWatchArray = [];
let addedToQueueArray = [];

mainRef.addEventListener('click', openModal)

function openModal(event) {
    if (event.target.localName === 'img') {

        function apiMovieCard (movieId) {
            const keyApi = 'be2bb7fd29eddf6e05cfa10ca2e7b19c';
            const baseUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${keyApi}`;
            return fetch(baseUrl)
              .then(res => res.json())
              .then(data => {
                localStorage.setItem("movie", JSON.stringify(data));
                return modalMarkup(data);
              })
              .then(result => {
               basicLightbox.create(result).show();
               const addToWatchBtnRef = document.querySelector('.add-to-watched-btn');
               const addToQueueBtnRef = document.querySelector('.add-to-queue-btn');

                addToWatchBtnRef.addEventListener('click', handleAddToWatchBtn);
                function handleAddToWatchBtn(){
                  const addedMovie = JSON.parse(localStorage.getItem("movie"));
                  addedToWatchArray.push(addedMovie);
                  console.log(addedToWatchArray);
                  localStorage.setItem("movie-to-watch", JSON.stringify(addedToWatchArray));
                }

                addToQueueBtnRef.addEventListener('click', handleAddToQueueBtn);
                function handleAddToQueueBtn() {
                  const addedMovie = JSON.parse(localStorage.getItem("movie"));
                  addedToQueueArray.push(addedMovie);
                  console.log(addedToQueueArray);
                  localStorage.setItem("movie-to-queue", JSON.stringify(addedToQueueArray));
                }
             })
        }

        return apiMovieCard(event.target.dataset.id);
    }
}

