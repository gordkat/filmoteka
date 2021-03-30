import MovieApiService from './apiService';

const movieApiService = new MovieApiService();
const galleryRef = document.querySelector('.list');
const paginationElement = document.getElementById('pagination');
const arrowLeft = document.querySelector('.arrow_left');
const arrowRight = document.querySelector('.arrow_right');

let currentPage = 1;
let pageCount;
const pagesOnWindow = 5;
let rows = 20;

function resetCurrentPage() {
  currentPage = 1;
}

function renderPagination(totalPages, listItems, callback, searchQuery) {
  paginationElement.innerHTML = '';
  resetCurrentPage();
  arrowLeft.removeEventListener('click', onArrowLeftClick);
  arrowRight.removeEventListener('click', onArrowRightClick);

  function setupPagination(items, wrapper, rowsPage) {
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
  // создает ... для pagination
  function addThreeDotsBlock() {
    const threeDots = document.createElement('div');
    threeDots.classList.add('threeDots');
    threeDots.innerText = '...';
    return threeDots;
  }

  function paginationButton(page, items) {
    let button = document.createElement('button');
    button.innerText = page;

    if (currentPage == page) button.classList.add('active');

    button.addEventListener('click', function () {
      warningField.textContent = ``;
      currentPage = page;
      callback(galleryRef, currentPage, searchQuery);

      let current_btn = document.querySelector('.pagenumbers button.active');
      current_btn.classList.remove('active');

      button.classList.add('active');
      setupPagination(listItems, paginationElement, rows);
    });

    return button;
  }

  // для отслеживания кликов по стрелке влево
  function onArrowLeftClick() {
    if (currentPage > 1) {
      currentPage--;
      setupPagination(listItems, paginationElement, rows);
      callback(galleryRef, currentPage, searchQuery);
    }

    disableArrowBtn(totalPages);
  }

  // для отслеживания кликов по стрелке вправо
  function onArrowRightClick() {
    if (currentPage < totalPages) {
      currentPage++;
      setupPagination(listItems, paginationElement, rows);
      callback(galleryRef, currentPage, searchQuery);
    }
    disableArrowBtn(totalPages);
  }

  setupPagination(listItems, paginationElement, rows);
  arrowLeft.onclick = onArrowLeftClick;
  arrowRight.onclick = onArrowRightClick;
  disableArrowBtn(totalPages);
}

// прячет первую и последнюю страницу для мобильных гаджетов

paginationElement.addEventListener('click', disableArrowBtnAfterPageClick);

function disableArrowBtnAfterPageClick(e) {
  if (e.target.tagName != 'BUTTON') {
    return;
  } else {
    disableArrowBtn(pageCount);
  }
}

// делает неактивными стрелки на первой и последней  страницах
function disableArrowBtn(totalPages) {
  if (currentPage === 1) {
    arrowLeft.classList.add('disabled-arrow');
  } else {
    arrowLeft.classList.remove('disabled-arrow');
  }

  if (currentPage === totalPages) {
    arrowRight.classList.add('disabled-arrow');
  } else {
    arrowRight.classList.remove('disabled-arrow');
  }
}

//подключение пагинации
function displayGallery(wrapper, page) {
  wrapper.innerHTML = '';
  fetchPopularFilmsOnPage(page)
    .then(response => response.json())
    .then(response => response.results)
    .catch(err => {
      console.log('error in displayGallery', err);
    });

  function fetchPopularFilmsOnPage(page) {
    movieApiService.pageNum = page;
    return movieApiService.fetchGenres();
  }
}
function fetchDataPopularFilms() {
  movieApiService
    .fetchPopularMovies()
    .then(results => {
      renderPagination(results.totalPages, results.results, displayGallery);
    })
    .catch(err => {
      console.log('error in function fetchDataPopularFilms', err);
    });
}
function displaySearchListByPage(wrapper, page, searchQuery) {
  wrapper.innerHTML = '';
  fetchMovieBySearch(page, searchQuery)
    .then(response => response.json())
    .then(response => response.results)
    .catch(err => {
      console.log('error in function displaySearchListByPage');
    });
}
function fetchDataOfSearchFilms(searchQuery) {
  movieApiService.query = searchQuery;

  movieApiService
    .fetchMovieBySearch()
    .then(results => {
      renderPagination(
        results.totalPages,
        results.results,
        displaySearchListByPage,
        searchQuery,
      );
      if (results.pages === 0) {
        return;
      }
    })
    .catch(err => {
      console.log('error in function fetchMovieBySearch');
    });
}
fetchDataPopularFilms();
fetchDataOfSearchFilms();
