import galleryTemplate from '../templates/film-card.hbs';
import { BASE_URL, API_KEY } from './settings';
import noposter from '../images/no-poster.png';
import refs from './refs.js';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import spinnerModal from './spinner'; //Функция которая добавляет или убирает клас is-hidden (toggle)

const notice = message => {
  error({
    text: message,
    maxTextHeight: null,
    delay: 2000,
  });
};

export default class MovieApiService {
  // #movies = [];
  constructor() {
    // this.#movies = [];
    this.searchQuery = '';
    this.page = 1;
    // this.totalPages = 0;
    this.genreId;
    this.genre = '';
    // this.goToPrevPage = this.goToPrevPage.bind(this);
    // this.goToNextPage = this.goToNextPage.bind(this);
  }

  // get movies() {
  //   return this.#movies;
  // }

  // set movies(movieList) {
  //   this.#movies = movieList;
  //   this.renderMovies();
  // }

  // async goToPrevPage() {
  //   if (this.page === 1) return;
  //   this.page -= 1;
  //   try {
  //     this.movies = await this.getPopularMovies();
  //   } catch {
  //     notice('Упс! Что-то пошло не так. Попробуйте еще раз!');
  //   }
  // }

  // async goToNextPage() {
  //   if (this.page === this.totalPages) return;
  //   this.page += 1;
  //   try {
  //     this.movies = await this.getPopularMovies();
  //   } catch {
  //     notice('Упс! Что-то пошло не так. Попробуйте еще раз!');
  //   }
  // }

  // async goToNumberPage() {
  //   try {
  //     this.movies = await this.getPopularMovies();
  //   } catch {
  //     notice('Упс! Что-то пошло не так. Попробуйте еще раз!');
  //   }
  // }

  // renderMovies() {
  //   const moviesMarkup = galleryTemplate(this.movies);
  //   refs.gallery.innerHTML = moviesMarkup;
  // }

  async fetchPopularMovies() {
    const url = `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=en-US&page=${this.page}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error();
    }
    const popularMoviesObj = await response.json();
    // this.totalPages = popularMoviesObj.total_pages;
    // endBtnRef.textContent = this.totalPages;
    const popularMovies = await popularMoviesObj.results;
    return popularMovies;
  }

  async fetchMovieBySearch() {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&page=${this.page}&language=en&query='${this.searchQuery}'`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error();
    }
    const searchedMoviesObj = await response.json();

    // this.totalPages = searchedMoviesObj.total_pages;

    const searchedMovies = await searchedMoviesObj.results;
    return searchedMovies;
  }

  async fetchMoviesByGenre() {
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${this.page}&with_genres=${this.genreId}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error();
    }
    const searchedMoviesObj = await response.json();
    const searchedMovies = await searchedMoviesObj.results;
    return searchedMovies;
  }

  async fetchGenres() {
    const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error();
    }
    const genresObj = await response.json();
    const genres = await genresObj.genres;
    return genres;
  }

  async fetchMovieById(movieId) {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error();
    }
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
      const release_date = movie.release_date
        ? movie.release_date.split('-')[0]
        : 'NA';

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

  // популярные фильмы, готовые к рендеру
  async getPopularMovies() {
    const fetchedPopularMovies = await this.fetchPopularMovies();
    const normalizedMovies = await this.fetchNormalizer(fetchedPopularMovies);
    return normalizedMovies;
  }

  // фильмы из поиска, готовые к рендеру
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
    spinnerModal(); //Убирает клас is-hidden
    try {
      const normalizedMovies = await this.getPopularMovies();
      this.renderMovieCard(normalizedMovies);
      spinnerModal(); //Добавляет клас is-hidden
    } catch (error) {
      notice('Oops! Something went wrong!');
      spinnerModal(); //Добавляет клас is-hidden
    }
  }

  // async renderSerchedMovies() {
  //   try {
  //     const normalizedMovies = await this.searchMovies();
  //     this.renderMovieCard(normalizedMovies);
  //   } catch {
  //     notice('Oops! Something went wrong!');
  //   }
  // }

  async renderMoviesByGenre(genre) {
    try {
      const normalizedMovies = await this.getMoviesByGenre(genre);
      this.renderMovieCard(normalizedMovies);
    } catch (error) {
      notice('Oops! Something went wrong!');
    }
  }

  renderMovieCard(results) {
    const moviesMarkup = galleryTemplate(results);
    refs.gallery.insertAdjacentHTML('beforeend', moviesMarkup);
  }

  increamentPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
