const refs = {
  btnMyLibrary: document.querySelector('.library-page'),
  btnHome: document.querySelector('.home-page'),
  formSearch: document.querySelector('.form-search'),
  btnAction: document.querySelector('.btn-my-library'),
};

const isClassListContain = () => {
  const isHiddenForm = refs.formSearch.classList.contains(
    'form-search--hidden',
  );
  const isVisibleForm = !isHiddenForm;
  const isVisibleBtnAction = !refs.btnAction.classList.contains(
    'btn-my-library--hidden',
  );
  const isHiddenBtnAction = !isVisibleBtnAction;
  return { isHiddenForm, isVisibleForm, isVisibleBtnAction, isHiddenBtnAction };
};

const onHome = event => {
  console.log('рендерятся популярные фильмы, резетится форма');
  refs.formSearch.reset();
  const { isHiddenForm, isVisibleBtnAction } = isClassListContain();
  if (isHiddenForm) {
    refs.formSearch.classList.remove('form-search--hidden');
  }
  if (isVisibleBtnAction) {
    refs.btnAction.classList.add('btn-my-library--hidden');
  }
};

const onMyLibrary = event => {
  console.log(
    'рендерятся из локалстораж просмотренные фильмы, скрывается поиск, появляются кнопки, меняется фон',
  );
  isClassListContain();
  const { isVisibleForm, isHiddenBtnAction } = isClassListContain();
  if (isVisibleForm) {
    refs.formSearch.classList.add('form-search--hidden');
  }
  if (isHiddenBtnAction) {
    refs.btnAction.classList.remove('btn-my-library--hidden');
  }
};
refs.btnHome.addEventListener('click', onHome);
refs.btnMyLibrary.addEventListener('click', onMyLibrary);
