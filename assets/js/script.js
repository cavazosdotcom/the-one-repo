var searchFormEl = $('#search-input')
var searchInputEl = $('#search-value')
var favoriteInputEl = $('#favorite-value')

var lotrApiKey = "wamtzXv_h1XiQdZTQkoc"
var giphyApiKey = "WoRs4YZR0DZF0sdkRHlcCVv8LJFz4LTz"

var favoriteCharacterList = []


// Form submission function
function formSubmit(event){
    
    event.preventDefault()

    if (searchInputEl.val()==="" && favoriteInputEl.val()==="") {
        console.log("Can you see this")
        renderModal("Please enter a character name.", "is-info")
        return
    } else if(searchInputEl.val()===""){
        getCharacterData(favoriteInputEl.val())

    } else if (favoriteInputEl.val()==="") {
        getCharacterData(searchInputEl.val())
    } else {
        getCharacterData(searchInputEl.val())
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
        saveFavoriteCharacter(data.docs[0].name)

        console.log(data.docs[0].wikiUrl)
        getCharacterQuotes(data.docs[0]._id)
        
        })
        } else {
            
            throw Error(response.status + ": We were not able to locate the character you searched for.");
        }
        })
        .catch(function (Error) {
            renderModal(Error, "is-warning")
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
            console.log(Error)
            throw Error(response.status + ": We were not able to locate the character's quotes.");
        }
        })
        .catch(function (Error) {
            renderModal(Error, "is-warning")
        });;
}

// Modal handler
function renderModal(errorResponse, severity) {
    console.log
    var modalType = ""
    if(severity === "is-warning"){
        modalType = "Warning"
    } else {
        modalType = "We need more information."
    }

    $('.modal-content').html(`
                <article class="message ${severity}">
                    <div class="message-header">
                        <p>${modalType}</p>
                        <button class="delete" aria-label="delete"></button>
                    </div>
                    <div class="message-body">
                        ${errorResponse}
                    </div>
                </article>
                `)
    modalToggle()
}

function modalToggle(){
    $('.modal').toggleClass('is-active')
}

$('.modal').on('click', modalToggle)

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


// Initial page load function to pull favorite characters from local storage
function init() {

    // This will parse the favorite character list array from local storage
    favoriteCharacterList = JSON.parse(localStorage.getItem("favoriteCharacters"));
    
    // If local storage favorite character values do not exist; set it as a blank array
    if (favoriteCharacterList===null) {
        return favoriteCharacterList = []
    }
    
    renderFavorites()
}

// Function to save character as favorite to local storage

function saveFavoriteCharacter(characterName) {

        // retreives characterlist from local storage
        favoriteCharacterList = JSON.parse(localStorage.getItem("favoriteCharacters"))

        console.log(favoriteCharacterList)

        for (i=0; i < favoriteCharacterList.length; i++) {
            if (favoriteCharacterList[i] === characterName) {
                return
            } else {
                
            }
        }

        // Adding the user stats object we just captured into the leaderboard array
        favoriteCharacterList = favoriteCharacterList.concat(characterName);

        // Saving the updated leaderboard array to local storage 
        localStorage.setItem("favoriteCharacters", JSON.stringify(favoriteCharacterList));

}


// Function to render favorite characters to drop down

function renderFavorites() {

    favoriteInputEl.html("")

    console.log(favoriteInputEl)

    htmlTemplateString = "";
    for(var i=0; i < favoriteCharacterList.length; i++) {
        
        //Template literal which will print out a favorite character option for each character saved within the localstorage array
        htmlTemplateString += `
        <option>${favoriteCharacterList[i].name}</option>
        `; 
    }

    favoriteInputEl.html(`${htmlTemplateString}`) 
    console.log(favoriteInputEl)
    
}


