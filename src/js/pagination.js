import filmsCardTpl from '../templates/film-card.hbs';
import MovieApiService from './apiService';
import { BASE_URL, API_KEY } from './settings';
import {Spinner} from 'spin.js';

const movieApiService = new MovieApiService();
const spinner = new Spinner().spin();


const listElement = document.querySelector('.list');
const paginationElement = document.getElementById('pagination');
const arrowLeft = document.querySelector('.arrow_left');
const arrowRight = document.querySelector('.arrow_right');
let currentPage = 1;
const pagesOnWindow = 5;
let pageCount;
let rows = 20;

fetchDataOfPopularFilms();

function fetchDataOfPopularFilms() {
  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US`;
  return fetch(url)
    .then(response => {
      return response.json();
    })
    .then(results => {
      renderPagination(results.total_pages, results.results, displayList);
    });
}

function fetchPopularFilmsByPage(page) {
  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
  return fetch(url)
    .then(response => response.json())
    .then(({ results }) => {
      return results;
    });
}

function fetchSearchFilmsByPage(page) {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&page=${page}&include_adult=true`;
  return fetch(url)
    .then(response => response.json())
    .then(({ results }) => {
      return results;
    });
}

function fetchFilmsSearch(searchQuery) {
  const url = `${BASE_URL}/search/movie?api_key=${KEY}&query=${searchQuery}`;
  return fetch(url)
    .then(response => response.json())
    .then(results => {
      renderPagination(
        results.total_pages,
        results.results,
        displaySearchListByPage,
      );
    });
} 
export function renderFilmsCard(articles) {
  listElement.innerHTML = filmsCardTpl(articles);
}

// function displayList(wrapper, page) {
//   wrapper.innerHTML = '';
//   fetchPopularFilmsByPage(page).then(renderFilmsCard);
// }
// function displaySearchListByPage(wrapper, page) {
//   wrapper.innerHTML = '';
//   fetchSearchFilmsByPage(page).then(renderFilmsCard);
// }

////////пропустила через нормалайз, пр пагинации всё подгружается
function displayList(wrapper, page, searchQuery) {
  wrapper.innerHTML = '';
  //Call normalizer списка жанры, год, noposter
  movieApiService
    .fetchNormalizer(fetchPopularFilmsByPage(page, searchQuery))
    .then(renderFilmsCard);
}
function displaySearchListByPage(wrapper, page, searchQuery) {
  wrapper.innerHTML = '';
  //Call normalizer списка жанры, год, noposter
  movieApiService
    .fetchNormalizer(fetchPopularFilmsByPage(page, searchQuery))
    .then(renderFilmsCard);
}

function renderPagination(totalPages, listItems, callback) {
  paginationElement.innerHTML = '';
  currentPage = 1;

  function setupPagination(items, wrapper, rowsPerPage) {
    wrapper.innerHTML = '';

    pageCount = totalPages;
    let maxLeftPage = currentPage - Math.floor(pagesOnWindow / 2);
    let maxRightPage = currentPage + Math.floor(pagesOnWindow / 2);

    if (maxLeftPage < 1) {
      maxLeftPage = 1;
      maxRightPage = pagesOnWindow;
    }
    if (maxRightPage > totalPages) {
      maxLeftPage = totalPages - (pagesOnWindow - 1);

      if (maxLeftPage < 1) {
        maxLeftPage = 1;
      }
      maxRightPage = totalPages;
    }

    for (let i = 1; i <= totalPages; i++) {
      if (maxLeftPage !== 1 && i == 1) {
        let btn = paginationButton(i, items);
        wrapper.appendChild(btn);
      }
      if (maxRightPage !== totalPages && i == totalPages) {
        let btn = paginationButton(i, items);
        wrapper.appendChild(btn);
      }
      if (i >= maxLeftPage && i <= maxRightPage) {
        let btn = paginationButton(i, items);
        wrapper.appendChild(btn);
      }

      if (
        totalPages >= 6 &&
        i == 1 &&
        currentPage !== 1 &&
        currentPage !== 2 &&
        currentPage !== 3
      ) {
        const threeDotsEl = addThreeDotsBlock();
        wrapper.insertBefore(threeDotsEl, wrapper[wrapper.length - 2]);
      }
      if (
        pageCount >= 7 &&
        i == pageCount - 1 &&
        currentPage !== pageCount &&
        currentPage !== pageCount - 2 &&
        currentPage !== pageCount - 1
      ) {
        const threeDotsEl = addThreeDotsBlock();
        wrapper.insertBefore(threeDotsEl, wrapper[1]);
      }
    }
  }

  function addThreeDotsBlock() {
    const threeDots = document.createElement('div');
    threeDots.classList.add('threeDots');
    threeDots.innerText = '...';
    return threeDots;
  }
  function paginationButton(page, items, searchQuery) {
    let button = document.createElement('button');
    button.innerText = page;

    if (currentPage == page) button.classList.add('active');

    button.addEventListener('click', function () {

      currentPage = page;
      callback(listElement, currentPage, searchQuery);

      let current_btn = document.querySelector('.pagenumbers button.active');
      current_btn.classList.remove('active');

      button.classList.add('active');
      setupPagination(listItems, paginationElement, rows);
    });
    return button;
  }
  function onArrowLeftClick() {
    if (currentPage > 1) {
      currentPage--;
      setupPagination(listItems, paginationElement, rows);
      callback(listElement, currentPage, searchQuery);
    }
  }

  function onArrowRightClick() {
    if (currentPage < totalPages) {
      currentPage++;
      setupPagination(listItems, paginationElement, rows);
      callback(listElement, currentPage, searchQuery);
    }
  }

  setupPagination(listItems, paginationElement, rows);
  arrowLeft.addEventListener('click', onArrowLeftClick);
  arrowRight.addEventListener('click', onArrowRightClick);
}
