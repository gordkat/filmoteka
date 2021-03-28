import modalMarkup from '../templates/modal-film-card.hbs';
import * as basicLightbox from 'basiclightbox';

const mainRef = document.querySelector('main');
mainRef.addEventListener('click', openModal)

function openModal(event) {
    if (event.target.localName === 'img') {

        function apiMovieCard (movieId) {
            const keyApi = 'be2bb7fd29eddf6e05cfa10ca2e7b19c';
            const baseUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${keyApi}`;
            return fetch(baseUrl)
              .then(res => res.json())
              .then(data => {
                modalMarkup(data);
              })
              .then(data => {
                basicLightbox.create(data).show();
             })
            .catch(err => console.log(err));
        }

        apiMovieCard(event.target.dataset.id);
    }
}


  