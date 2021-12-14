var searchFormEl = $('#search-input')
var searchInputEl = $('#search-value')
var favoriteInputEl = $('#favorite-value')

var lotrApiKey = "wamtzXv_h1XiQdZTQkoc"
var giphyApiKey = "Pv2YHiUAl6VaFAsN816cOhgxrE28iBKF"



// Form submission function
function formSubmit(event){
    
    event.preventDefault()

    if (searchInputEl.val()==="" && favoriteInputEl.val()==="") {
        alert("Please enter a value")} 
    else if(searchInputEl.val()===""){
        getCharacterData(favoriteInputEl.val())
        getGiphy(favoriteInputEl.val())

    } else if (favoriteInputEl.val()==="") {
        getCharacterData(searchInputEl.val())
        console.log()
        getGiphy(searchInputEl.val())
        
    } else {
        getCharacterData(searchInputEl.val())
        getGiphy(searchInputEl.val())
    }
    
    // clears out search input after form submission
    searchInputEl.val("")
    favoriteInputEl.val("")
}


// Fetch request

function getCharacterData (searchVal) {

    var requestUrl = `https://the-one-api.dev/v2/character?name=/${searchVal}/i`;
    
    var bearer = 'Bearer ' + lotrApiKey;
    
    fetch(requestUrl , {
        method: 'GET',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        }})
        .then(function (response) {
        if (response.ok) {
            return response.json()
        .then(function(data){
        
        console.log(data);
        // console.log(data.docs[0].dataset['_id'])
        console.log(data.docs[0]._id)
        console.log(data.docs[0].name)
        console.log(data.docs[0].wikiUrl)
        getCharacterQuotes(data.docs[0]._id)
        
        })
        } else {
            throw Error(response.statusText + ". We were not able to locate the character you searched for.");
        }
        })
        .catch(function (Error) {
            console.log(Error)
            // renderModal(Error, "is-warning")
    });;
};

function getCharacterQuotes(charData){
    var requestUrl = `https://the-one-api.dev/v2/character/${charData}/quote`;
    
    var bearer = 'Bearer ' + lotrApiKey;
    
    fetch(requestUrl , {
        method: 'GET',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        }})
        .then(function (response) {
        if (response.ok) {
            return response.json()
        .then(function(data){
        
        console.log(data);
        // console.log(data.docs[0].dataset['_id'])
        console.log(data.docs)
        console.log(data.docs.length)
        console.log(data.docs[0].dialog)
        
        })
        } else {
            throw Error(response.statusText + ". We were not able to locate the character you searched for.");
        }
        })
        .catch(function (Error) {
            console.log(Error)
            // renderModal(Error, "is-warning")
        });;
}



function getGiphy(searchVal) {

    // TODO: create random number generator between 0 and 50? for ranNum variable
    var ranNum = 1
    var requestUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${searchVal}&offset=${ranNum}`;
   
    fetch(requestUrl)
        .then(function (response) {
        if (response.ok) {
            return response.json()
        
        .then(function (data) {
            console.log(data);
            console.log(data.data[ranNum].images.looping.mp4);
        });
        } else {
            throw Error(response.statusText + ". We were not able to locate the character you searched for.");
        }
        })
        .catch(function (Error) {
            console.log(Error)
            // renderModal(Error, "is-warning")
        });;
}


// Event listener for search form submission

searchFormEl.on('submit', formSubmit)

$(document).ready(function() {

    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
  
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
  
    });
  });
