import MovieApiService from './apiService';
import galleryTemplate from '../templates/film-card.hbs';
import '@pnotify/core/dist/BrightTheme.css';
import refs from './refs.js';
import spinnerModal from './spinner'; //Функция которая добавляет или убирает клас is-hidden (toggle)

// import { notice, error } from '@pnotify/core';

const searchMovie = new MovieApiService();

// const refs = {
//   heder: document.querySelector('.main-container'),
//   inputForm: document.querySelector('.input-text'),
//   gallery: document.querySelector('.gallery-list'),
//   form: document.querySelector('.form-search'),
//   lensSearch: document.querySelector('.logo-search'),
// };

refs.lensSearch.addEventListener('click', onSearch);
refs.form.addEventListener('submit', onSearch);

function onSearch(e) {
  spinnerModal(); //Убирает клас is-hidden
  e.preventDefault();
  if (refs.inputForm.value === '') {
    refs.gallery.innerHTML = '';
    //  window.location.reload();
    return searchMovie.getPopularMovies().then(renderMovieCard);
    
  }

  searchMovie.resetPage();
  searchMovie.query = refs.inputForm.value.trim();
  // const find = searchMovie.query;
  console.log(searchMovie.query)
  refs.gallery.innerHTML = '';
  searchMovie.searchMovies().then(checkedResult);
  

}

// export function checkedResult(results){
//   if (results.length == 0) {
//     searchMovie.query = Auto(searchMovie.query);
    
// }
// searchMovie.searchMovies().then(renderMovieCard);
// }

export function checkedResult(results){
  if (results.length == 0) {
    searchMovie.query = Auto(searchMovie.query);
    refs.inputForm.value = searchMovie.query;
    
}
searchMovie.searchMovies().then(secondCheckedResult);
}

export function secondCheckedResult(results){
  if (results.length == 0) {
    searchMovie.query = AutofromRus(searchMovie.query);
    refs.inputForm.value = searchMovie.query;
    
}
searchMovie.searchMovies().then(renderMovieCard);
}


export function renderMovieCard(results) {
  if (results.length == 0) {
    const error = document.createElement('p');
    error.classList.add('error-message');
    error.textContent =
      'Search result not successful. Enter the correct movie name and try again';
    refs.form.append(error);

    setTimeout(() => {
      refs.inputForm.value = '';
    }, 1800);

    setTimeout(() => {
      refs.form.removeChild(error);
    }, 2300);

    setTimeout(() => {
      spinnerModal(); //Убирает клас is-hidden
      searchMovie.getPopularMovies().then(renderMovieCard);
    }, 2500);
  }
  refs.gallery.insertAdjacentHTML('beforeend', galleryTemplate(results));
  spinnerModal(); //Добавляет клас is-hidden
}


function Auto(str)
{
  const search = new Array(
  "й","ц","у","к","е","н","г","ш","щ","з","х","ъ",
  "ф","ы","в","а","п","р","о","л","д","ж","э",
  "я","ч","с","м","и","т","ь","б","ю"
  );
  const replace = new Array(
      "q","w","e","r","t","y","u","i","o","p","\\[","\\]",
      "a","s","d","f","g","h","j","k","l",";","'",
      "z","x","c","v","b","n","m",",","\\."
      );
     
    for (let i = 0; i < replace.length; i++) {
        let reg = new RegExp(replace[i], 'mig');
        str = str.replace(reg, function (a) {
            return a == a.toLowerCase() ? search[i] : search[i].toUpperCase();
        })
    }
      return str
    }
    
    function AutofromRus(str){
  const search = new Array(
    "q","w","e","r","t","y","u","i","o","p","\\[","\\]",
    "a","s","d","f","g","h","j","k","l",";","'",
    "z","x","c","v","b","n","m",",","\\."
  );
  const replace = new Array(
    "й","ц","у","к","е","н","г","ш","щ","з","х","ъ",
    "ф","ы","в","а","п","р","о","л","д","ж","э",
    "я","ч","с","м","и","т","ь","б","ю"
      );
     
    for (let i = 0; i < replace.length; i++) {
        let reg = new RegExp(replace[i], 'mig');
        str = str.replace(reg, function (a) {
            return a == a.toLowerCase() ? search[i] : search[i].toUpperCase();
        })
    }
      return str
    }

