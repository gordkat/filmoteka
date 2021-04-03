import galleryTemplate from '../templates/film-card.hbs';
import { BASE_URL, API_KEY } from './settings';
import noposter from '../images/no-poster.png';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';

const galleryRef = document.querySelector('.gallery-list');

const notice = message => {
  error({
    text: message,
    maxTextHeight: null,
    delay: 2000,
  });
};

export default class MovieApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.genreId;
    this.genre = '';
  }

  async fetchPopularMovies() {
    const url = `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=en-US&page=${this.page}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error();
    }
    const popularMoviesObj = await response.json();
    this.totalPages = popularMoviesObj.total_pages;
    const popularMovies = await popularMoviesObj.results;

    return popularMovies;
  }

  async fetchMovieBySearch() {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&page=${this.page}&language=en&query='${this.searchQuery}'`;
    const response = await fetch(url);
    const searchedMoviesObj = await response.json();
    const searchedMovies = await searchedMoviesObj.results;
    return searchedMovies;
  }

  async fetchMoviesByGenre() {
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${this.genreId}`;
    // ${this.genreId}
    const response = await fetch(url);
    const searchedMoviesObj = await response.json();
    const searchedMovies = await searchedMoviesObj.results;

    return searchedMovies;
  }

  async fetchGenres() {
    const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`;
    const response = await fetch(url);
    const genresObj = await response.json();
    const genres = await genresObj.genres;
    return genres;
  }

  async fetchMovieById(movieId) {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
    const response = await fetch(url);
    const movieById = await response.json();
    return movieById;
  }

  // метод для приведение промиса к одному виду (с жанраами) вне зависимости от запроса
  async fetchNormalizer(fetchedData) {
    const moviesArr = await fetchedData;
    const genresArr = await this.fetchGenres();

    //Функция,которая для каждого id находим имя жанра
    const findGenreName = id => {
      const genreObj = genresArr.find(gener => id === gener.id);
      return genreObj.name;
    };

    //Функция, которая обновляет информацию о фильме и добавляя имена жанров
    const updateMovie = movie => {
      const genres = [];
      const genresIdArr = movie.genre_ids;

      // Проходимся по массиву id жанров и добавляем в новый массив имена жанров соответсвующие id
      genresIdArr.forEach(id => {
        const genreName = findGenreName(id);
        genres.push(genreName);
      });

      //Обрезаем дату
      const release_date = movie.release_date.split('-')[0];

      // Подгружаем noPosterImg если с бэкэнда не прихожит картинка
      const poster_path = movie.poster_path
        ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path
        : noposter;
      const movieUpdate = { ...movie, genres, release_date, poster_path };
      return movieUpdate;
    };

    // Обновляем информацию фильмов в массиве
    const updatedMoviesarr = moviesArr.map(movie => updateMovie(movie));
    return updatedMoviesarr;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  // // популярные фильмы, готовые к рендеру
  async getPopularMovies() {
    const fetchedPopularMovies = await this.fetchPopularMovies();
    const normalizedMovies = await this.fetchNormalizer(fetchedPopularMovies);
    return normalizedMovies;
  }

  // // фильмы из поиска, готовые к рендеру
  async searchMovies() {
    const fetchedMovieBySearch = await this.fetchMovieBySearch();
    const normalizedMovies = await this.fetchNormalizer(fetchedMovieBySearch);
    return normalizedMovies;
  }

  // // фильмы по жанрам, готовые к рендеру
  async getMoviesByGenre(genre) {
    const genresArray = await this.fetchGenres();
    this.genre = genre;
    const findId = genresArray
      .filter(genresObj => genresObj.name === this.genre)
      .map(obj => obj.id);
    this.genreId = findId;
    const fetchedMoviesByGenre = await this.fetchMoviesByGenre(genre);
    const normalizedMovies = await this.fetchNormalizer(fetchedMoviesByGenre);

    return normalizedMovies;
  }

  async renderPopularMovies() {
    try {
      const normalizedMovies = await this.getPopularMovies();
      this.renderMovieCard(normalizedMovies);
    } catch {
      notice('Упс! Что-то пошло не так. Попробуйте еще раз!');
    }
  }

  async renderSerchedMovies() {
    const normalizedMovies = await this.searchMovies();
    this.renderMovieCard(normalizedMovies);
  }

  async renderMoviesByGenre(genre) {
    const normalizedMovies = await this.getMoviesByGenre(genre);
    this.renderMovieCard(normalizedMovies);
  }

  renderMovieCard(results) {
    const moviesMarkup = galleryTemplate(results);

    galleryRef.insertAdjacentHTML('beforeend', moviesMarkup);
  }

  increamentPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}

const movieApiService = new MovieApiService();

// console.log(movieApiService.searchMoviesbyGenre());

// console.log(movieApiService.searchMoviesbyGenre());
// movieApiService.searchMoviesbyGenre('Action');
// movieApiService.searchMoviesbyGenre('Horror');
// console.log(movieApiService.searchMoviesbyGenre('Horror'));

// console.log(movieApiService.fetchMovieByGenre(''));
// console.log(movieApiService.searchMoviesbyGenre(''));
