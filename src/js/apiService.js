import { renderMovieCard } from './renderPopularMovies';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'be2bb7fd29eddf6e05cfa10ca2e7b19c';

export default class MovieApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  // получает промис популярных фильмов, но без названия жанров (только с id-номером жанра)
  fetchPopularMovies() {
    const url = `${BASE_URL}/trending/movie/day?api_key=${API_KEY}`;

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

  //добавление имя жанра в промис с популярными фильмами
  addGenresToMovieObj() {
    return this.fetchPopularMovies().then(response => {
      return this.fetchGenres().then(genresList => {
        return response.map(movie => ({
          ...movie,
          release_date: movie.release_date.split('-')[0],
          genres: movie.genre_ids
            .map(id => genresList.filter(el => el.id === id))
            .flat(),
        }));
      });
    });
  }

  increamentPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

const movieApiServie = new MovieApiService();

movieApiServie.addGenresToMovieObj().then(renderMovieCard);
