const BASAL_URL = "https://webdev.alphacamp.io"
const INDEX_URL = BASAL_URL + "/api/movies/"
const POSTER_URL = BASAL_URL + "/posters/" //+ response.data.result.image
const movies = []
let dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const MOVIES_PER_PAGE = 12;
let filteredMovies = []
const paginator = document.querySelector("#paginator")

//search function
searchForm.addEventListener("click", function onSearchFormSubmitted(event){
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase()

  filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyword))

  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))

  if(filteredMovies.length === 0){
    return alert(`No results found with：${keyword}`)   
  }
})

function renderMovieList (data) {
  let rawHTML = ''
  data.forEach((item) => { 
    
    rawHTML +=  `<div class="col-sm-3">
                  <div class="mb-2">
                    <div class="card">
                      <img
                        src="${POSTER_URL + item.image}"
                        class="card-img-top" alt="Movie Poster" />
                      <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                      </div>
                      <div class="card-footer">
                        <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
                        <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                      </div>
                    </div>
                  </div>
                </div>
                `
    dataPanel.innerHTML = rawHTML
  })
}

function getMoviesByPage(page){
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderPaginator(amount){
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages ;page++) {
    rawHTML += `
       <li class="page-item"><a class="page-link" data-page="${page}" href="#">${page}</a></li>
    `
  }
    paginator.innerHTML = rawHTML
}

paginator.addEventListener("click", function onPaginatorClicked(event){
  if (event.target.tagName !== 'A') return
  const page = event.target.dataset.page
  renderMovieList(getMoviesByPage(page))
})

function showMovieModal (id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then ((response) => {
    const data = response.data.results

  modalTitle.innerText = data.title
  modalDate.innerText = 'Release date:' + data.release_date
  modalDescription.innerText = data.description
  modalImage.innerHTML = `
    <img src= ${POSTER_URL + data.image}
    alt="movie-poster" class="img-fluid">
  `
  })
}
//將使用者點擊到的那一部電影送進 local storage 儲存起來
  function addToFavorite (id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = movies.find((movie) => movie.id === id)
    if (list.some((movie) => movie.id === id)) {
      return alert('This movie is already added to your favorite movie list')
    }
    list.push(movie)
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  

//Linking Modal & adding to favorite 
dataPanel.addEventListener("click", function onPanelClicked (event){
  if(event.target.matches(".btn-show-movie")){
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches(".btn-add-favorite")){
    addToFavorite(Number(event.target.dataset.id))
     //get movie id
  }
})

// get API
axios.get(INDEX_URL).then((response) => {
  movies.push(...response.data.results)
  renderPaginator(movies.length)
  renderMovieList(getMoviesByPage(1))
}).catch((error) => {
  console.log(error)
})