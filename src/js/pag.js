import MovieApiService from './apiService';
// import filmsCardTpl from '../templates/film-card.hbs';
const refs = {
  btnPagination: document.querySelector('.pagination__container_pages'),
  pageNumbers: document.querySelector('.pagenumbers'),
  firstBtn: document.querySelector('[data-number="first"]'),
  secondBtn: document.querySelector('[data-number="second"]'),
  centerBtn: document.querySelector('[data-number="center"]'),
  fourthBtn: document.querySelector('[data-number="fourth"]'),
  fifthBtn: document.querySelector('[data-number="fifth"]'),
  lastBtn: document.querySelector('[data-number="last-page"]'),
  endDots: document.querySelector('.end'),
};

const movieApiService = new MovieApiService();
movieApiService.renderPopularMovies();
const onBtnPagination = event => {
  const pressedBtn = event.target;
  const btnDataAction = event.target.dataset.action;
  switch (btnDataAction) {
    case 'next-page':
      movieApiService.goToNextPage();
      break;

    case 'prev-page':
      movieApiService.goToPrevPage();
      break;

    case 'number-page':
      //Получаем номер нажатой страницы и убираем активный класс у предыдущей страницы
      const btnNumber = Number(pressedBtn.textContent);
      const pastActiveBtn = refs.btnPagination.querySelector('.active');
      pastActiveBtn.classList.remove('active');

      if (btnNumber === 1) {
        removeStartPage();
        removeStartDot();
        changeNumbersByStart();
        refs.firstBtn.classList.add('active');
      }

      if (btnNumber === 2) {
        removeStartPage();
        removeStartDot();
        changeNumbersByStart();
        refs.secondBtn.classList.add('active');
      }

      if (btnNumber === 3) {
        removeStartPage();
        removeStartDot();
        changeNumbersByStart();
        refs.centerBtn.classList.add('active');
      }

      //Если нажата страница с номером 4, добавляем блок с точками вначало, если его там еще нет
      if (btnNumber === 4) {
        addStartDot();
        removeStartPage();
        changeNumbersByCenter(btnNumber);
      }

      //Если нажата страница с номером 5 или больше и не последняя страница, добавляем блок с первой страницой
      const isLastPage = pressedBtn.dataset.number === 'last-page';
      if (btnNumber >= 5 && !isLastPage) {
        changeNumbersByCenter(btnNumber);
        addStartDot();
        addStartPage();
      }
      //Если нажата последняя страница удаляем вконце блок с точками и последнюю страницу
      if (btnNumber === movieApiService.totalPages) {
        console.log(movieApiService.totalPages);
        changeNumbersByEnd(movieApiService.totalPages);
        refs.endDots.remove();
        refs.lastBtn.remove();
        addStartDot();
        addStartPage();
        refs.fifthBtn.classList.add('active');
      }
      if (btnNumber === movieApiService.totalPages - 1) {
        console.log(btnNumber);
        refs.endDots.remove();
        refs.lastBtn.remove();
        changeNumbersByEnd(movieApiService.totalPages);
        refs.fourthBtn.classList.add('active');
      }
      if (btnNumber === movieApiService.totalPages - 2) {
        console.log(btnNumber);
        refs.endDots.remove();
        refs.lastBtn.remove();
        changeNumbersByEnd(movieApiService.totalPages);
        refs.centerBtn.classList.add('active');
      }
      if (btnNumber === movieApiService.totalPages - 3) {
        addEndDot();
        refs.lastBtn.remove();
        changeNumbersByCenter(movieApiService.totalPages);
        changeNumbersByCenter(btnNumber);
        refs.secondBtn.classList.add('active');
      }

      //Меняем номер текущей страницы в movieApiService и рендерим фильмы
      movieApiService.page = btnNumber;
      movieApiService.goToNumberPage();
      break;
  }
};

function removeStartDot() {
  const startDot = document.querySelector('.start');
  if (startDot) {
    startDot.remove();
  }
}

function removeStartPage() {
  const startPage = document.querySelector('.start-page');
  if (startPage) {
    startPage.remove();
  }
}

function addStartDot() {
  const startDot = document.querySelector('.start');
  if (!startDot) {
    const markupDots = '<div class="threeDots start">...</div>';
    refs.pageNumbers.insertAdjacentHTML('afterbegin', markupDots);
  }
}

function addEndDot() {
  const startDot = document.querySelector('.end');
  if (!startDot) {
    const markupDots = '<div class="threeDots end">...</div>';
    refs.pageNumbers.insertAdjacentHTML('beforeend', markupDots);
  }
}

function addStartPage() {
  const startPage = document.querySelector('.start-page');
  if (!startPage) {
    const markupStartPage =
      '<button class="start-page" data-action="number-page">1</button>';
    refs.pageNumbers.insertAdjacentHTML('afterbegin', markupStartPage);
  }
}

//Добавляем активный класс на центральную страницу и меняем номера страниц
function changeNumbersByCenter(number) {
  refs.centerBtn.classList.add('active');
  refs.centerBtn.textContent = number;
  refs.firstBtn.textContent = number - 2;
  refs.secondBtn.textContent = number - 1;
  refs.fourthBtn.textContent = number + 1;
  refs.fifthBtn.textContent = number + 2;
}

function changeNumbersByEnd(number) {
  refs.firstBtn.textContent = number - 4;
  refs.secondBtn.textContent = number - 3;
  refs.centerBtn.textContent = number - 2;
  refs.fourthBtn.textContent = number - 1;
  refs.fifthBtn.textContent = number;
}

function changeNumbersByStart() {
  refs.firstBtn.textContent = 1;
  refs.secondBtn.textContent = 2;
  refs.centerBtn.textContent = 3;
  refs.fourthBtn.textContent = 4;
  refs.fifthBtn.textContent = 5;
}

// arrowLeft.addEventListener('click', movieApiService.goToPrevPage);
// arrowRight.addEventListener('click', onRightArrow);
refs.btnPagination.addEventListener('click', onBtnPagination);
