const Theme = {
  LIGHT: 'light-theme',
  DARK: 'dark-theme',
};

const elems = {
  body: document.querySelector('body'),
  galleryList: document.querySelector('.gallery-list'),
  footer: document.querySelector('.footer'),
  ftPage: document.querySelector('.footer__page'),
  up: document.querySelector('.up-btn__icon'),
  pgBtn: document.querySelector('.pagenumbers'),
  pgLeftRight: document.querySelector('.pagination__container_pages'),
  switchToggle: document.querySelector('#codepen'),
};

elems.switchToggle.addEventListener('change', checkedTheme);

removeTheme();

function checkedTheme() {
  if (elems.switchToggle.checked) {
    elems.body.classList.remove(Theme.LIGHT);
    elems.body.classList.add(Theme.DARK);
    elems.galleryList.classList.remove(Theme.LIGHT);
    elems.galleryList.classList.add(Theme.DARK);
    elems.footer.classList.remove(Theme.LIGHT);
    elems.footer.classList.add(Theme.DARK);
    elems.ftPage.classList.remove(Theme.LIGHT);
    elems.ftPage.classList.add(Theme.DARK);
    elems.up.classList.remove(Theme.LIGHT);
    elems.up.classList.add(Theme.DARK);
    elems.pgBtn.classList.remove(Theme.LIGHT);
    elems.pgBtn.classList.add(Theme.DARK);
    elems.pgLeftRight.classList.remove(Theme.LIGHT);
    elems.pgLeftRight.classList.add(Theme.DARK);
    localStorage.setItem('theme', Theme.DARK)
  } else {
    elems.body.classList.remove(Theme.DARK);
    elems.body.classList.add(Theme.LIGHT);
    elems.galleryList.classList.remove(Theme.DARK);
    elems.galleryList.classList.add(Theme.LIGHT);
    elems.footer.classList.remove(Theme.DARK);
    elems.footer.classList.add(Theme.LIGHT);
    elems.ftPage.classList.remove(Theme.DARK);
    elems.ftPage.classList.add(Theme.LIGHT);
    elems.up.classList.remove(Theme.DARK);
    elems.up.classList.add(Theme.LIGHT);
    elems.pgBtn.classList.remove(Theme.DARK);
    elems.pgBtn.classList.add(Theme.LIGHT);
    elems.pgLeftRight.classList.remove(Theme.DARK);
    elems.pgLeftRight.classList.add(Theme.LIGHT);
    localStorage.setItem('theme', Theme.LIGHT)
  }
}

function removeTheme() {
  if (localStorage.getItem('theme') !== Theme.LIGHT) {
    elems.body.classList.add(Theme.DARK);
    elems.galleryList.classList.add(Theme.DARK);
    elems.footer.classList.add(Theme.DARK);
    elems.ftPage.classList.add(Theme.DARK);
    elems.up.classList.add(Theme.DARK);
    elems.pgBtn.classList.add(Theme.DARK);
    elems.pgLeftRight.classList.add(Theme.DARK);
    elems.switchToggle.checked = true;
  } 
}