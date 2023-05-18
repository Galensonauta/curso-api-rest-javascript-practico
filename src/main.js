const api= axios.create({
    baseURL: "https://api.themoviedb.org/3/",
    headers: {
        "Content-Type": "aplication/json:charset=utf-8",
    },
    params: {
        "api_key":API_KEY,
        'language': navigator.language||'es-LA',
    },
});
function likedMoviesLis(){
    const item= JSON.parse(localStorage.getItem("liked_movies"));
    let movies;

    if(item){
        movies= item;
    }else{
        movies={};
    }
    return movies;
}
function likeMovie(movie){
    const likedMovies = likedMoviesLis();
    console.log(likedMovies)

    if(likedMovies[movie.id]){
      likedMovies[movie.id]=undefined;
    }else{
   likedMovies[movie.id]= movie;
    }
    localStorage.setItem("liked_movies",JSON.stringify(likedMovies));
}
const observador = new IntersectionObserver((elemens)=>{
    elemens.forEach((elemen)=>{
      if(elemen.isIntersecting){
      const url =elemen.target.getAttribute("data-img")
      elemen.target.setAttribute("src", url);
    }
    });
});

function crearPeliculas(movies, container, {observa=false,clean=true}){
    if(clean){
        container.innerHTML="";
    }
    movies.forEach(movie=>{
        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie-container");
        const movieImg = document.createElement("img");
        movieImg.classList.add("movie-img");
        movieImg.setAttribute("alt", movie.title);
        movieImg.setAttribute(
            observa ? "data-img":"src",
            "https://image.tmdb.org/t/p/w300"+ movie.poster_path,);
            movieImg.addEventListener("click", ()=>{
                location.hash = "movie="+movie.id  
            });
        movieImg.addEventListener(
            "error",()=>{
            movieImg.setAttribute("src","https://i.ytimg.com/vi/4O-U5V_bQ3k/maxresdefault.jpg")
        });
        const movieBo =document.createElement("button");
        movieBo.classList.add("movie-bo");
        likedMoviesLis()[movie.id]&&movieBo.classList.add("movie-bo--liked");
         movieBo.addEventListener("click",()=>{
            movieBo.classList.toggle("movie-bo--liked");
            likeMovie(movie);
            getLikedMovie();

        });
/*const movieDetailDescription= document.createElement("p");
        movieDetailDescription.classList.add("movieDetail-description");
        movieContainer.addEventListener(
            "mouseover",()=>{
                movieDetailDescription.textContent = movie.overview
        });*/
            if(observa){observador.observe(movieImg)}

         movieContainer.appendChild(movieImg);
         movieContainer.appendChild(movieBo)
         container.appendChild(movieContainer);

    });
}
function crearAfiche (movie, container){
    container.innerHTML="";
    const movieContainer=document.createElement("div");
    movieContainer.classList.add("movie-container");
    const movieImg=document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute("alt", movie.title);
    movieImg.setAttribute(
        "src",
        "https://image.tmdb.org/t/p/w400"+ movie.poster_path);
        movieContainer.appendChild(movieImg)
         container.appendChild(movieContainer);
    }

function crearCategories(categories, container){
    container.innerHTML="";
    categories.forEach(category=>{
        const categoryContainer = document.createElement("div");
        categoryContainer.classList.add("category-container");

        const categoryTitle = document.createElement("h3");
        categoryTitle.classList.add("category-title");
        categoryTitle.setAttribute("id", "id" + category.id);
        categoryTitle.addEventListener("click", ()=>{
            location.hash="#category="+ category.id +"-"+ category.name;
        })
    
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    })
}
async function getTrendingMoviesPreview(){
    const {data} = await api ("trending/movie/day");
    const movie =data.results;
    maxPage=data.total_pages;
crearPeliculas(movie, trendingPreviewMovieList,{observa:true,clean:true});
}
async function getCargarTrendingMoviesPreview() {
    const {
        scrollTop,
        clientHeight,
        scrollHeight
    }=document.documentElement
    const scrollAlFinal= (scrollTop + clientHeight) >= (scrollHeight -15);
    const pageISNomAX=page<maxPage;
    if(scrollAlFinal && pageISNomAX){
        page++;
        const {data}=await api ("trending/movie/day",{
           params: {
               page,
           },
       });
           
           const movie = data.results;
           crearPeliculas(movie,trendingPreviewMovieList,{observa:true,clean:false});
    }
}    

async function getMovieCategory(id){
    const {data} = await api ("discover/movie?", {
        params: {
            with_genres: id,
        },
    });
    const movies =data.results;
       crearPeliculas(movies, genericList, {observa:true,clean:true});
}
function getCargarCategory(id){
return async function (){
    const {
        scrollTop,
        clientHeight,
        scrollHeight
    }=document.documentElement
    const scrollAlFinal= (scrollTop + clientHeight) >= (scrollHeight -15);
    const pageISNomAX=page<maxPage;
    if(scrollAlFinal && pageISNomAX){
        page++;
        const {data} = await api ("discover/movie?", {
            params: {
                with_genres: id,
                page,
            },
        });
        const movie =data.results;
           crearPeliculas(movie,genericList,{observa:true,clean:false});
    }
}
}
    
async function getCategoriesPreview(){
    const {data} = await api ("genre/movie/list");
    const categories =data.genres;
    crearCategories(categories,categoriesPreviewList);
}

async function getMoviePorSearch(query){
    const {data} = await api ("search/multi", {
        params: {
            query,
        },
    });
    const movies =data.results;
    maxPage=data.total_pages;
    console.log(maxPage);
       crearPeliculas(movies, genericList,{observa:true,clean:true});
}
  function getCargarSearch(query) {
    return async function (){
    const {
        scrollTop,
        clientHeight,
        scrollHeight
    }=document.documentElement
    const scrollAlFinal= (scrollTop + clientHeight) >= (scrollHeight -15);
    const pageISNomAX=page<maxPage;
    if(scrollAlFinal && pageISNomAX){
        page++;
        const {data} = await api ("search/multi", {
            params: {
                query,
                page,
            },
        });
        const multi =data.results;
           crearPeliculas(multi,genericList,{observa:true,clean:false});
    }
}
}
async function getTrendingMovies(){
    const {data} = await api ("trending/movie/day");
    const movies =data.results;
crearPeliculas(movies, genericList);
}

  function crearVideo(movie, container){
    container.innerHTML="";
    const videoContainer=document.createElement("div");
    videoContainer.classList.add("video-container");
    const movieVideo=document.createElement("iframe");
    movieVideo.classList.add("movie-video");
    movieVideo.setAttribute(
        "src",
        "https://www.youtube.com/embed/" + movie);
        videoContainer.appendChild(movieVideo);
         container.appendChild(videoContainer);
  }
  async function getVideo(id){
    const {data} = await api ("movie/"+ id,{
        params:{
            append_to_response: "videos",
            
            language: 'en-US'
        }
    });
    const oficial = data.videos.results.find(
        (vid)=>vid.name.toLowerCase().includes("trailer")).key;
    crearVideo(oficial, videoS )
    console.log(data);

}
function crearCas(movies, container ){
    container.innerHTML="";
    movies.forEach(movie=>{
        
        const casS = document.createElement("div");
        casS.classList.add("cas");
        const casImg = document.createElement("img");
        casImg.classList.add("casting-img");
        casImg.setAttribute(
            "src",
            "https://image.tmdb.org/t/p/w300"+ movie);
          
         casS.appendChild(casImg)
         container.appendChild(casS);

        })};
        /**/
async function getCas(id){
    const {data} = await api ("movie/"+ id,{
        params:{
            append_to_response: "credits"
        }
    });
        const castingName = data.credits.cast.map(
        (cas) => cas.name+"-"+cas.character).slice(0,5);
        const castingImg = data.credits.cast.map((cas)=>cas.profile_path).slice(0,5);
        const crewName = data.credits.crew
        .filter((crew)=>
        crew.job.includes("Screenplay")+crew.job.includes("Novel")+crew.job.includes("Director"))
        const crewImg= crewName.map((crew)=>crew.name+"--"+crew.job+"--"+crew.profile_path)
        const casName=document.createElement("p");
        casName.classList.add("casting-name");
        casName.textContent = castingName;
        console.log(data.credits, castingName, castingImg, crewImg);            
        crearCas(castingImg,casS);
}

async function getMovieId(id){
    const {data:movie} = await api ("movie/"+ id);
    const movieImgUrl= "https://image.tmdb.org/t/p/w1280"+movie.backdrop_path;
     console.log(movieImgUrl);
     header.style.background = `
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.35) 19.27%,
      rgba(0, 0, 0, 0) 29.17%
    ),
    url(${movieImgUrl}`;
  movieDetailTitle.textContent = movie.original_title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;
  
  crearCategories(movie.genres, movieDetailCategoriesList);
  getSimilaresMovieId(id);
   crearAfiche(movie, aficheS)
}

async function getSimilaresMovieId(id){
    const {data} = await api (`movie/${id}/similar`);
    const similares =data.results;
    maxPage=data.total_pages
    console.log(maxPage)
crearPeliculas(similares, relatedMoviesScrollContainer, {observa:true,clean:true});
}
function getCargarSimilar(id){
    return async function (){
        const {
            scrollTop,
            clientHeight,
            scrollHeight
        }=document.documentElement
        const scrollAlFinal= (scrollTop + clientHeight) >= (scrollHeight -15);
        const pageISNomAX=page<maxPage;
        if(scrollAlFinal && pageISNomAX){
            page++;
            const {data} = await api ("movie/"+id+"/similar", {
                params: {
                    page,
                },
            });
            const similar =data.results;
               crearPeliculas(similar,relatedMoviesScrollContainer,{observa:true,clean:false});
        }
    }
    }
    function getLikedMovie(){
        const likedMovies= likedMoviesLis();
        const moviesArrai= Object.values(likedMovies);
       crearPeliculas(moviesArrai, likedMovieList,{observa:true,clean:true});
       console.log(likedMovies);

        }

