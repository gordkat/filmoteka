import refs from './refs';

const Theme = {
  LIGHT: 'light-theme',
  DARK: 'dark-theme',
};


refs.switchToggle.addEventListener('change', checkedTheme);

removeTheme();

function checkedTheme() {
  if (refs.switchToggle.checked) {
    refs.body.classList.remove(Theme.LIGHT);
    refs.body.classList.add(Theme.DARK);
    localStorage.setItem('theme', Theme.DARK)
  } else {
    refs.body.classList.remove(Theme.DARK);
    refs.body.classList.add(Theme.LIGHT);
    localStorage.setItem('theme', Theme.LIGHT)
  }
}

function removeTheme() {
  if (localStorage.getItem('theme') !== Theme.LIGHT) {
    refs.body.classList.add(Theme.DARK);
    refs.switchToggle.checked = true;
  } 
}