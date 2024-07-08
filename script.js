const API_Key = 'api_key=a2805b3c8b447be6c589bd85f95e7c0c';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_Key;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?sort_by=popularity.desc&' + API_Key;
const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
]

const main = document.getElementById('main');
const form = document.getElementById('form');
const searchButton = document.querySelector('.searchButton');

const tags1 = document.getElementById('tags');
const searchResult = document.querySelector('.searchResult');

const searchClass = document.querySelector('.search');


let currentPage = 1;
let lastUrl = '';
let totalPages = 100;

function reloadWeb(){
	location.reload();
}


AmbilFilm(API_URL);

	
function AmbilFilm(url){
	lastUrl = url;
		fetch(url)
		.then(response => response.json())
		.then(data => {
			if(data.results.length !== 0){
			tampilkanFilm(data.results)
			console.log(data);
			currentPage = data.page;
			totalPages = data.total_pages;
			pageGenerator(totalPages, currentPage)
			} else {
			main.innerHTML = `<h1 class="no-result">Result Not Found</h1>`;
			}
		})
		.catch(err => { 
		console.log(err);
	});
}


function tampilkanFilm(data){
	main.innerHTML = '';
	data.forEach((movie) =>{
		const movies1 = document.createElement('div');
		movies1.classList.add('movie');
		movies1.innerHTML = card(movie);
		
		main.appendChild(movies1);
	})
}


function card(movie){
	return `<img src='${movie.poster_path? IMG_URL + movie.poster_path: "https://placehold.co/500x750?text=Picture+Not+Found&font=roboto"}' alt="${movie.title}">
			<div class="movie-info">
				<h3>${movie.title}</h3>
				<span class="${cariColor(movie.vote_average)}">${movie.vote_average}</span>
			</div>
			<div class="overview">
			
				<h3>Overview</h3>
				${movie.overview}
			</div>`;
}

function cariColor(vote){
	return (vote > 8) ? 'green' : (vote > 5) ? 'orange' : 'red' ;
}

searchButton.addEventListener('click', (e) => {
	e.preventDefault();
	search()
})

form.addEventListener('keypress', e => {
	if( e.key === 'Enter'){
		search()
	}
});

function search(){
	const search = document.getElementById('search');
	const searchTerm = search.value.trim();
	genreTerikat = []
	aturGenre();
	if(searchTerm){
		AmbilFilm(searchURL + '&query=' + searchTerm);
		searchResult.innerHTML = `<h3>Hasil pencarian untuk \'${searchTerm}\'</h3>`;
		
		pageGenerator(totalPages, currentPage)
	} else {
		reloadWeb();  
	}
}

function pageGenerator(allPages, page) {
    let div = '';

    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;

    if (page > 1) {
        div += `<div class="page" id="prev">previous</div>`;
    }

    for (let pageLength = beforePages; pageLength <= afterPages; pageLength++) {
        if (pageLength > allPages || pageLength < 1) {
            continue;
        }
        
        page === pageLength ? liActive = 'current' : liActive = '';

        div += `<div class="numberPage ${liActive}">${pageLength}</div>`;
    }

    if (page < allPages) {
        div += `<div class="page" id="next">next</div>`;
    }

    // Assuming 'pagination' is the container where this pagination is inserted
    const pagination = document.querySelector('.pagination');
    if (pagination) {
        pagination.innerHTML = div;

        // Adding event listeners after setting innerHTML
        const prev = pagination.querySelector('#prev');
        if (prev) {
            prev.addEventListener('click', () => {
                pageCall(page - 1); // Call pageCall function with previous page number
				window.scrollTo({top: 0, behavior: 'smooth'})
            });
        }

        const next = pagination.querySelector('#next');
        if (next) {
            next.addEventListener('click', () => {
                pageCall(page + 1); // Call pageCall function with next page number
				window.scrollTo({top: 0, behavior: 'smooth'})
            });
        }

        const numberPages = pagination.querySelectorAll('.numberPage');
        if (numberPages) {
            numberPages.forEach(button => {
                button.addEventListener('click', () => {
                    pageCall(parseInt(button.textContent)); // Call pageCall function with clicked page number
					window.scrollTo({top: 0, behavior: 'smooth'})
                });
            });
        }
    }
}
pageGenerator(totalPages, currentPage)

function pageCall(page){
	let urlSplit = lastUrl.split('?');
	let queryParams = urlSplit[1].split('&');
	let key = queryParams[queryParams.length - 1].split('=');
//jika key bagian terakhir tak ada page berarti 
	if(key[0] != 'page'){
		url = lastUrl + '&page=' + page;
		AmbilFilm(url);
		}else {
		key[1] = page.toString();//pastikan page sudah diubah menjadi string
		let buatPageBaru = key.join('='); //[page, 1] menjadi page=1
		queryParams[queryParams.length - 1] = buatPageBaru; //hasil page ditimpa dari variabel let sebelumnya 
		let halamanLink = queryParams.join('&'); //menggabungkan base_url, code api, dan page dengan &
		let url = urlSplit[0] + '?' + halamanLink; 
		AmbilFilm(url);
		
	}
}

aturGenre();
let genreTerikat = [];
function aturGenre(){
	tags1.innerHTML= '';
	genres.forEach(genre => {
		const t = document.createElement('div');
		t.classList.add('tags');
		t.id = genre.id;
		t.innerText = genre.name;
		//jika tombol tag diklik maka
		t.addEventListener( 'click' , () =>{
			searchResult.innerHTML = '';
			if(genreTerikat.length == 0){
				genreTerikat.push(genre.id)
			}else{
				if(genreTerikat.includes(genre.id)){
					genreTerikat.forEach((id, idx) => {
						if(id == genre.id){
							genreTerikat.splice(idx, 1);
						}
					})
				} else {
					genreTerikat.push(genre.id);
				}
			}
			pageGenerator(totalPages, currentPage)
			AmbilFilm(API_URL + '&with_genres='+ encodeURIComponent(genreTerikat.join(',')))
			penandaPilihan()
		})
			 
		tags1.append(t);
	})
}

function penandaPilihan(){
	const tags = document.querySelectorAll('.tags');
	tags.forEach(tag => {
		tag.classList.remove('highlight');
	})
	tombolKosongkan()
	if(genreTerikat.length!==0){
		genreTerikat.forEach(id => {
			const penandaTombol = document.getElementById(id);
			penandaTombol.classList.add('highlight');
		})
	}
}

function tombolKosongkan(){
	const tombolHapus = document.getElementById('clear');
	if(tombolHapus){
		tombolHapus.classList.add('highlight');
		if(genreTerikat.length == 0){
			tombolHapus.remove();
		}
	} else {
		const clear = document.createElement('div');
		//tambahkan class dengan nama tags highlight
		clear.classList.add('tags','highlight');
		//tambahkan id dengan nama clear
		clear.id = 'clear';
		clear.innerText = 'Clear x';
		//jika tombol clear di klik
		clear.addEventListener('click', () => {
			//tombol clear x akan tergabung menjadi satu
			let genreTerikat = [];
			//lalu menghasilkan genre
			reloadWeb()
		})
		//digabungkan dengan tags1
		tags1.append(clear);
	}
}

