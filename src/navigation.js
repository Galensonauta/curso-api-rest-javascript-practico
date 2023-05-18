let page =1;
let maxPage;
let InfiniteScroll;

searchFormLupa.addEventListener("click", ()=>{
    location.hash ="#search="+ searchFormInput.value;
});
trendingPreviewTitle.addEventListener("click",()=>{
    location.hash = "#trends"
});
headerArrow.addEventListener("click", ()=>{
    location.hash= "";
})

window.addEventListener("DOMContentLoaded", navegador, false);
window.addEventListener("hashchange", navegador, false);
window.addEventListener("scroll", InfiniteScroll, false);


function navegador (){
    if(InfiniteScroll){
        window.removeEventListener("scroll", InfiniteScroll, {passive:false});
        InfiniteScroll= undefined;
    }
    console.log({location});

    if (location.hash.startsWith("#trends")){
        trendsPage();
    }
    else if (location.hash.startsWith("#search=")){
        searchPage();
    }
    else if (location.hash.startsWith("#movie=")){
        movieDetailsPage();
    }
    else if (location.hash.startsWith("#category=")){
        categoriesPage();
    }
    else {
        homePage();
    }
    document.body.scrollTo=0;
    document.documentElement.scrollTop=0;

    if(InfiniteScroll){
        window.addEventListener("scroll", InfiniteScroll, {
        passive:false});
    }
    page=1
}

 function homePage(){

    header.classList.remove("header-container--long");
    header.style.background = "";
    headerArrow.classList.add("inactive");
    headerArrow.classList.remove("header-arrow--white");
    headerTitle.classList.remove("inactive");
    headerCategoryView.classList.add("inactive");
    searchForm.classList.remove("inactive");

    trendingPreview.classList.remove("inactive");
    likedMovieSec.classList.remove("inactive");
    categoriesPreview.classList.remove("inactive");
    movieDetail.classList.add("inactive");
    genericList.classList.add("inactive");
    


    getTrendingMoviesPreview();
    getCategoriesPreview();
    InfiniteScroll=getCargarTrendingMoviesPreview;
    getLikedMovie()
    
}
function categoriesPage(){
    
    header.classList.remove("header-container--long");
    header.style.background = "";

    headerArrow.classList.remove("inactive");
    headerArrow.classList.remove("header-arrow--white");

    headerTitle.classList.add("inactive");
    headerCategoryView.classList.remove("inactive");

    searchForm.classList.add("inactive");

    trendingPreview.classList.add("inactive");
    likedMovieSec.classList.add("inactive");

    categoriesPreview.classList.add("inactive");
    movieDetail.classList.add("inactive");
    genericList.classList.remove("inactive");

    //consumo del api usando la funcion creada en main
    const [_, categoryData]= location.hash.split("=");
    const [categoryId, categoryName]= categoryData.split("-");
    headerCategoryView.innerHTML= categoryName;
    getMovieCategory(categoryId);
    InfiniteScroll= getCargarCategory(categoryId)
    
}
function trendsPage(){
    header.classList.remove("header-container--long");
    header.style.background = "";

    headerArrow.classList.remove("inactive");
    headerArrow.classList.add("header-arrow--white");

    headerTitle.classList.remove("inactive");
    headerCategoryView.classList.remove("inactive");

    searchForm.classList.add("inactive");

    trendingPreview.classList.add("inactive");
    likedMovieSec.classList.add("inactive");

    categoriesPreview.classList.add("inactive");
    movieDetail.classList.add("inactive");
    genericList.classList.remove("inactive");
    headerCategoryView.innerHTML= "Lo mas buscado";
    getTrendingMovies();
}
function movieDetailsPage(){
    
    header.classList.add("header-container--long");
    header.style.background = "";
    headerArrow.classList.remove("inactive");
    headerArrow.classList.add("header-arrow--white");
    headerTitle.classList.add("inactive");
    headerCategoryView.classList.add("inactive");

    searchForm.classList.add("inactive");

    trendingPreview.classList.add("inactive");
    likedMovieSec.classList.add("inactive");

    categoriesPreview.classList.add("inactive");
    movieDetail.classList.remove("inactive");
    genericList.classList.add("inactive");
    
    const [_, movieId]= location.hash.split("=");

    getMovieId(movieId);
    InfiniteScroll= getCargarSimilar(movieId)
    getVideo(movieId);
    getCas(movieId);
    
}

function searchPage(){
    header.classList.remove("header-container--long");
    header.style.background = "";

    headerArrow.classList.remove("inactive");
    headerArrow.classList.remove("header-arrow--white");

    headerTitle.classList.add("inactive");
    headerCategoryView.classList.add("inactive");

    searchForm.classList.remove("inactive");

    trendingPreview.classList.add("inactive");
    likedMovieSec.classList.add("inactive");

    categoriesPreview.classList.add("inactive");
    movieDetail.classList.add("inactive");
    genericList.classList.remove("inactive");
    
    //consumo del api usando la funcion creada en main
    const [_, query]= location.hash.split("=");
    getMoviePorSearch(query);
    InfiniteScroll=getCargarSearch(query);
}