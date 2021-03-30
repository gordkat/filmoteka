import galleryTemplate from '../templates/film-card.hbs';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'be2bb7fd29eddf6e05cfa10ca2e7b19c';
const galleryRef = document.querySelector('.gallery-list');

export default class MovieApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  // получает промис популярных фильмов, но без названия жанров (только с id-номером жанра)
  fetchPopularMovies() {
    const url = `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=en-US&page=${this.page}`;

    return fetch(url)
      .then(response => response.json())
      .then(response => response.results)
      .catch(error => console.log(error));
  }


  fetchMovieBySearch() {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&page=${this.page}&language=en&query=${this.searchQuery}`;
    return fetch(url)
      .then(response => response.json())
      .then(response => response.results)
      .catch(error => console.log(error));
  }

  fetchMovieBySearch() {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&page=${this.page}&language=en&query=${this.searchQuery}`;
    return fetch(url)
      .then(response => response.json())
      .then(response => response.results)
      .catch(error => console.log(error));
  }

  // получает промис с парой id-жанра/имя жанра
  fetchGenres() {
    const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`;

    return fetch(url)
      .then(response => response.json())
      .then(response => response.genres)
      .catch(error => console.log(error));
  }

  //метод для приведение промиса к одному виду (с жанраами) вне зависимости от запроса
  fetchNormalizer(fetchedData) {
    return fetchedData.then(response => {
      //Затем делам запрос к жанрам
      return this.fetchGenres().then(genres => {
        return response.map(movie => ({
          ...movie,
          genres: movie.genre_ids
            //Для каждого id находим жанр
            .map(id => genres.filter(genre => genre.id === id))
            //Делаем один array
            .flat(),
          //Обрезам дату
          release_date: movie.release_date.split('-')[0],
        }));
      });
    });
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  // популярные фильмы, готовые к рендеру
  getPopularMovies() {
    return this.fetchNormalizer(this.fetchPopularMovies());
  }

  // фильмы из поиска, готовые к рендеру
  searchMovie() {
    return this.fetchNormalizer(this.fetchMovieBySearch());
  }


  increamentPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
  renderMovieCard(results) {
    galleryRef.insertAdjacentHTML('beforeend', galleryTemplate(results));
  }
  renderMovies() {
    this.getPopularMovies().then(this.renderMovieCard);
  }
}

