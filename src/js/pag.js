import MovieApiService from './apiService';

// import filmsCardTpl from '../templates/film-card.hbs';
export const refs = {
  btnPagination: document.querySelector('.pagination__container_pages'),
  pageNumbers: document.querySelector('.pagenumbers'),
  firstBtn: document.querySelector('[data-number="first"]'),
  secondBtn: document.querySelector('[data-number="second"]'),
  centerBtn: document.querySelector('[data-number="center"]'),
  fourthBtn: document.querySelector('[data-number="fourth"]'),
  fifthBtn: document.querySelector('[data-number="fifth"]'),
  endBtn: document.querySelector('[data-number="end-page"]'),
  endDots: document.querySelector('.end'),
};

const movieApiService = new MovieApiService();

function onBtnPagination(event) {
  const pressedBtn = event.target;
  const btnDataAction = event.target.dataset.action;

  //Убираем активный класс у предыдущей страницы
  const pastActiveBtn = refs.btnPagination.querySelector('.active');
  pastActiveBtn.classList.remove('active');
  const pastActiveBtnNumber = Number(pastActiveBtn.textContent);

  switch (btnDataAction) {
    case 'next-page':
      if (pastActiveBtnNumber === movieApiService.totalPages) {
        pastActiveBtn.classList.add('active');
        return;
      }
      makePaginationPages(pastActiveBtnNumber + 1);
      movieApiService.goToNextPage();
      break;

    case 'prev-page':
      if (pastActiveBtnNumber === 1) {
        pastActiveBtn.classList.add('active');
        return;
      }
      makePaginationPages(pastActiveBtnNumber - 1);
      movieApiService.goToPrevPage();
      break;

    case 'number-page':
      //Получаем номер нажатой страницы
      const btnNumberPressed = Number(pressedBtn.textContent);

      //Меняем номера страниц в зависимости от нажатой страницы
      makePaginationPages(btnNumberPressed);

      //Меняем номер текущей страницы в movieApiService и рендерим фильмы
      console.log('pagin', movieApiService.typeOfFetch);
      movieApiService.page = btnNumberPressed;
      movieApiService.goToNumberPage();
      break;
  }

  function removeStartDots() {
    const startDots = document.querySelector('.start');
    if (startDots) {
      startDots.remove();
    }
  }
  function removeEndtDots() {
    const endDots = document.querySelector('.end');
    if (endDots) {
      endDots.remove();
    }
  }

  function removeStartPage() {
    const startPage = document.querySelector('[data-number="start-page"]');
    if (startPage) {
      startPage.remove();
    }
  }
  function removeEndPage() {
    const endPage = document.querySelector('[data-number="end-page"]');
    if (endPage) {
      endPage.remove();
    }
  }

  function addStartDots() {
    const startDots = document.querySelector('.start');
    if (!startDots) {
      const markupDots = '<div class="threeDots start">...</div>';
      refs.pageNumbers.insertAdjacentHTML('afterbegin', markupDots);
    }
  }

  function addEndDots() {
    const endDots = document.querySelector('.end');
    if (!endDots) {
      const markupDots = '<div class="threeDots end">...</div>';
      refs.pageNumbers.insertAdjacentHTML('beforeend', markupDots);
    }
  }

  function addStartPage() {
    const startPage = document.querySelector('[data-number="start-page"]');
    if (!startPage) {
      const markupStartPage =
        '<button data-action="number-page" data-number="start-page">1</button>';
      refs.pageNumbers.insertAdjacentHTML('afterbegin', markupStartPage);
    }
  }

  function addEndPage() {
    const endPage = document.querySelector('[data-number="end-page"]');
    if (!endPage) {
      const markupEndPage = `<button data-action="number-page" data-number="end-page">${movieApiService.totalPages}</button>`;
      refs.pageNumbers.insertAdjacentHTML('beforeend', markupEndPage);
    }
  }

  //Добавляем активный класс на центральную страницу и меняем номера страниц
  function changeNumbersByCenter(number) {
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

  function makePaginationPages(btnNumber) {
    if (btnNumber === 1) {
      changeNumbersByStart();
      refs.firstBtn.classList.add('active');
      removeStartPage();
      removeStartDots();
    }

    if (btnNumber === 2) {
      changeNumbersByStart();
      refs.secondBtn.classList.add('active');
      removeStartPage();
      removeStartDots();
    }

    if (btnNumber === 3) {
      changeNumbersByStart();
      refs.centerBtn.classList.add('active');
      removeStartPage();
      removeStartDots();
    }

    //Если нажата страница с номером 4 или больше и не последняя страница, добавляем блок с первой страницой
    const fourthPagByEnd = movieApiService.totalPages - 3;
    if (btnNumber >= 4 && btnNumber <= fourthPagByEnd) {
      refs.centerBtn.classList.add('active');
      changeNumbersByCenter(btnNumber);
      addStartDots();
      addStartPage();
      addEndDots();
      addEndPage();
    }
    //Если нажата последняя страница удаляем вконце блок с точками и последнюю страницу
    if (btnNumber === movieApiService.totalPages) {
      changeNumbersByEnd(movieApiService.totalPages);
      removeEndtDots();
      removeEndPage();
      addStartDots();
      addStartPage();

      refs.fifthBtn.classList.add('active');
    }
    if (btnNumber === movieApiService.totalPages - 1) {
      removeEndtDots();
      removeEndPage();
      changeNumbersByEnd(movieApiService.totalPages);
      refs.fourthBtn.classList.add('active');
    }
    if (btnNumber === movieApiService.totalPages - 2) {
      removeEndtDots();
      removeEndPage();
      changeNumbersByEnd(movieApiService.totalPages);
      refs.centerBtn.classList.add('active');
    }
  }
}

// refs.btnPagination.addEventListener('click', onBtnPagination);
