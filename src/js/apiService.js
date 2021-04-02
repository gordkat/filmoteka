import galleryTemplate from '../templates/film-card.hbs';
import { BASE_URL, API_KEY } from './settings';
import noposter from '../images/no-poster.png';
const galleryRef = document.querySelector('.gallery-list');

export default class MovieApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchPopularMovies() {
    const url = `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=en-US&page=${this.page}`;
    const response = await fetch(url);
    const popularMoviesObj = await response.json();
    const popularMovies = await popularMoviesObj.results;
    return popularMovies;
  }

  async fetchMovieBySearch() {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&page=${this.page}&language=en&query='${this.searchQuery}'`;
    const response = await fetch(url);
    const searchedMoviesObj = await response.json();
    const searchedMovies = await searchedMoviesObj.results;
    // console.log(searchedMovies);
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
    console.log(movieById);
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
    console.log(updatedMoviesarr);
    return updatedMoviesarr;
  }

  // fetchNormalizer(fetchedData) {
  //   console.log(fetchedData);
  //   return fetchedData.then(response => {
  //     //Затем делам запрос к жанрам
  //     return this.fetchGenres().then(genres => {
  //       return response.map(movie => ({
  //         ...movie,
  //         genres: movie.genre_ids
  //           //Для каждого id находим жанр и делаем один array
  //           .flatMap(id => genres.filter(genre => genre.id === id)),
  //         //Обрезам дату
  //         release_date: movie.release_date.split('-')[0],
  //         // подгружаем noPosterImg если с бэкэнда не прихожит картинка
  //         poster_path: movie.poster_path
  //           ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path
  //           : noposter,
  //       }));
  //     });
  //   });
  // }

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

  async renderPopularMovies() {
    const normalizedMovies = await this.getPopularMovies();
    // console.log(normalizedMovies);
    this.renderMovieCard(normalizedMovies);
  }

  async renderSerchedMovies() {
    const normalizedMovies = await this.searchMovies();
    this.renderMovieCard(normalizedMovies);
  }

  renderMovieCard(results) {
    const moviesMarkup = galleryTemplate(results);
    console.log(moviesMarkup);
    galleryRef.insertAdjacentHTML('beforeend', moviesMarkup);
  }

  increamentPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}

/////////////////////////////////////////// Without Async

// export default class MovieApiService {
//   constructor() {
//     this.searchQuery = '';
//     this.page = 1;
//   }
//   // получает промис популярных фильмов, но без названия жанров (только с id-номером жанра)
//   fetchPopularMovies() {
//     const url = `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=en-US&page=${this.page}`;

//     return fetch(url)
//       .then(response => response.json())
//       .then(response => response.results)
//       .catch(error => console.log(error));
//   }

//   fetchMovieBySearch() {
//     const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&page=${this.page}&language=en&query=${this.searchQuery}`;
//     return fetch(url)
//       .then(response => response.json())
//       .then(response => response.results)
//       .catch(error => console.log(error));
//   }

//   // получает промис с парой id-жанра/имя жанра
//   fetchGenres() {
//     const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`;

//     return fetch(url)
//       .then(response => response.json())
//       .then(response => response.genres)
//       .catch(error => console.log(error));
//   }

//   //метод для приведение промиса к одному виду (с жанраами) вне зависимости от запроса
//   fetchNormalizer(fetchedData) {
//     return fetchedData.then(response => {
//       //Затем делам запрос к жанрам
//       return this.fetchGenres().then(genres => {
//         return response.map(movie => ({
//           ...movie,
//           genres: movie.genre_ids
//             //Для каждого id находим жанр и делаем  один array
//             .flatMap(id => genres.filter(genre => genre.id === id)),
//           //Обрезам дату
//           release_date: movie.release_date.split('-')[0],
//         }));
//       });
//     });
//   }

//   get query() {
//     return this.searchQuery;
//   }

//   set query(newQuery) {
//     this.searchQuery = newQuery;
//   }

//   // популярные фильмы, готовые к рендеру
//   getPopularMovies() {
//     return this.fetchNormalizer(this.fetchPopularMovies());
//   }

//   // фильмы из поиска, готовые к рендеру
//   searchMovie() {
//     return this.fetchNormalizer(this.fetchMovieBySearch());
//   }

//   increamentPage() {
//     this.page += 1;
//   }

//   resetPage() {
//     this.page = 1;
//   }
//   renderMovieCard(results) {
//     galleryRef.insertAdjacentHTML('beforeend', galleryTemplate(results));
//   }
//   renderMovies() {
//     this.getPopularMovies().then(this.renderMovieCard);
//   }
// }
