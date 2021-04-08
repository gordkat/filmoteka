import refs from './refs';

const Theme = {
  LIGHT: 'light-theme',
  DARK: 'dark-theme',
};

loadingThem();
refs.switchToggle.addEventListener('change', chengeTheme);

function chengeTheme() {
  refs.body.classList.toggle(Theme.DARK);
  refs.body.classList.toggle(Theme.LIGHT);

  getCurrentTheme(refs.body.classList);
}

function getCurrentTheme(currentThem) {
  localStorage.setItem('Theme', currentThem);
}

function loadingThem() {
  const savedThem = localStorage.getItem('Theme');
  if (savedThem === Theme.DARK) {
    refs.body.classList.add(savedThem);
    refs.switchToggle.checked = true;
  } else {
    refs.body.classList.add(Theme.LIGHT);
  }
}
