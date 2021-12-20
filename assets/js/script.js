// Selecting on page elements we will be interacting with.
var searchFormEl = $( '#search-input' );
var searchInputEl = $( '#search-value' );
var favoriteInputEl = $( '#favorite-value' );

// Global variables.
var lotrApiKey = "wamtzXv_h1XiQdZTQkoc";
var giphyApiKey = "Pv2YHiUAl6VaFAsN816cOhgxrE28iBKF";
var favoriteCharacterList = [];
var favFilePath = "not-fav.png";
var tempCharData = {};

// Form submission function
function formSubmit ( event ){
    // Prevents default form submission behavior to reload page.
    event.preventDefault();

    /*
    // Conditional logic to determine which search value we are fetching character data from.
    // If both search input and favorite character input is blank, render modal informing user.
    // If only search input is blank, use favorite character selection.
    // If favorite character input is blank, use search input value.
    // If both search input and favorite character input are have values, use the search input value.
    */
    if ( searchInputEl.val() === "" && favoriteInputEl.val() === null ) {
        return renderErrorModal ( "Please enter a character name." , "is-info" );
    } else if ( searchInputEl.val() === "" ) {
        getCharacterData ( favoriteInputEl.val() );
    } else if ( favoriteInputEl.val() === "" ) {
        getCharacterData ( searchInputEl.val().trim() );
        favoriteInputEl.val ( "" );
    } else {
        getCharacterData ( searchInputEl.val().trim() );
        favoriteInputEl.val ( "" );
    };

    // clears out search input after form submission.
    searchInputEl.val ( "" );
};

// Fetch Character data from Lord of the Rings character endpoint based off search value.
function getCharacterData ( searchVal ) {

    // API Request URL and Bearer token.
    var requestUrl = `https://the-one-api.dev/v2/character?name=/${searchVal}/i`;
    var bearer = 'Bearer ' + lotrApiKey;
    
    // Fetch request.
    fetch ( requestUrl , {
        method: 'GET',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        }})
        .then( function ( response ) {
        if ( response.ok ) {
            return response.json()
        .then( function( data ){
            // If only one character is returned, go fetch giphy gif and character quotes.
            if ( data.docs.length === 1 ) {
                getGiphy ( data.docs[0].name );
                getCharacterQuotes ( data.docs[0] );
            } else if (data.docs.length > 1) {
                // If more than one character is returned, render multiple results modal and store character data temporarily in an object for later use.
                renderMultiResultsModal ( data );
                tempCharData = data;
            }
        })
        } else {
            
            throw Error( response.status + ": We were not able to locate the character you searched for." );
        }
        })
        .catch(function ( Error ) {
            renderErrorModal ( Error, "is-warning" );
    });
};

// Fetch Character quote data from Lord of the Rings quote endpoint based off returned character.
function getCharacterQuotes ( charData ) {
    
    // API Request URL and Bearer token.
    var requestUrl = `https://the-one-api.dev/v2/character/${charData._id}/quote`;
    var bearer = 'Bearer ' + lotrApiKey;
    
    // Fetch request.
    fetch( requestUrl , {
        method: 'GET',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        }})
        .then( function ( response ) {
        if ( response.ok ) {
            return response.json()
        .then( function ( data ){
            // Render Character card using both the character data and quote data.
            renderCharacterData ( charData , data );
        })
        } else {
            throw Error( response.status + ": We were not able to locate the character's quotes." );
        }
        })
        .catch( function ( Error ) {
            renderErrorModal( Error, "is-warning" );
        });
};

function getGiphy ( searchVal ) {

    // Create random number generator between 0 and 50? for ranNum variable.
    var ranNum = Math.floor( Math.random() * 9 );
    
    // API Request URL.
    var requestUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${searchVal}&offset=${ranNum}`;
   
    // Fetch Request.
    fetch( requestUrl )
        .then(function ( response ) {
        if ( response.ok ) {
            return response.json()
        
        .then( function ( data ) {
            var giphyLink = data.data[ranNum].images.downsized.url;
            var giphyTitle = data.data[ranNum].title;
            renderGiphy ( giphyLink, giphyTitle );
        });
        } else {
            throw Error( response.statusText + ". We were not able to locate the character you searched for." );
        }
        })
        .catch( function ( Error ) {
            renderModal ( Error, "is-warning" );
        });
};

// When More than one character is returned for a character search, this function will print buttons for each character name returned in a modal.
function renderMultiResultsModal ( data ) {
    
    var htmlTemplate = "";
    // For loop to create buttons for each character name returned.
    for ( i=0; i < data.docs.length; i++ ) { 
        htmlTemplate += `
            <button class="button is-danger is-focus is-fullwidth m-1" data-arrayindex="${i}" data-id="${data.docs[i]._id}">${data.docs[i].name}</button>        
        `;
    }

    // Appending character buttons and modal contents into the specific multi results character modal.
    $('#search-modal-content').html(`
        <article class="message is-info">
            <div class="message-header">
                <p><strong>Uh Oh!</strong></p>
            </div>
            <div class="message-body">
                <p>The character name you searched for has more than one result.<br>Please select the correct one:<br><br></p>
                ${htmlTemplate}
            </div>
        </article>
    `);
    
    // Toggle multi results character modal.
    modalToggle("search-result");
};

// Error modal handler
function renderErrorModal(errorResponse, severity) {
    
    var modalType = ""
    if(severity === "is-warning"){
        modalType = "Warning"
    } else {
        modalType = "We need more information."
    }

    $('#error-modal-content').html(`
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
    modalToggle("error")
}

// Toggles modal with is-active class to handle displaying and hiding a modal.
function modalToggle(modalId){
    $(`#${modalId}-modal`).toggleClass('is-active')
}

// Event listener added to multi results modal buttons which accesses the temporary character data object we stored character data in.
$('#search-modal-content').on('click', '[data-arrayindex]', function(){
    
    getGiphy(tempCharData.docs[this.dataset.arrayindex].name)
    getCharacterQuotes(tempCharData.docs[this.dataset.arrayindex])
    modalToggle("search-result")

})

$( document.body)
    .on('click', '[data-target]', function(){
        if (this.dataset.target === "error") {
            modalToggle(this.dataset.target)
        } 
});







// Function to save character as favorite to local storage

function toggleFavoriteCharacter(event) {
    favButtonToggle(event)
        
    var characterName = event.target.dataset.charname
    
    for (i=0; i < favoriteCharacterList.length; i++) {
        if (favoriteCharacterList[i] === characterName) {
            favoriteCharacterList.splice(i, 1)
            localStorage.setItem("favoriteCharacters", JSON.stringify(favoriteCharacterList));
            favoriteInputEl.val("")
            return renderFavorites(favoriteCharacterList)
        } 
    }

    // If character name is not saved to favorite character list, add it to array
    favoriteCharacterList = favoriteCharacterList.concat(characterName);

    // Saving the updated favorite character array to local storage 
    localStorage.setItem("favoriteCharacters", JSON.stringify(favoriteCharacterList));
    renderFavorites(favoriteCharacterList)
}


// Function to render favorite characters to drop down

function renderFavorites(favorites) {
    
    favoriteInputEl.html("")
    
    htmlTemplateString = "";
    for(var i=0; i < favoriteCharacterList.length; i++) {
        
        //Template literal which will print out a favorite character option for each character saved within the localstorage array
        htmlTemplateString += `
        <option>${favorites[i]}</option>
        `; 
    }

    favoriteInputEl.html(`${htmlTemplateString}`) 
    
}


function renderCharacterData (charData, quoteData) {
    favFileFinder(favoriteCharacterList, charData.name)

    var randomQuote =""
    
    if (quoteData.total===0){
        randomQuote = "This character has no known quotes in the movies."
    } else {
     randomQuote = quoteData.docs[getRandomIndex(quoteData.docs.length)].dialog
    }

    function getRandomIndex( length ) {
        return Math.floor(Math.random()*length);
    }
    
    var charInfoHtmlTemplate = ""
    var wikiUrlTemplate = ""
    for (const key in charData) {
        if (charData.hasOwnProperty(key)) {
            if(charData[key]==="" || key==="_id" || key==="name" || key==="wikiUrl" || charData[key]==="NaN") {
                // do nothing if key has blank value, is the id, or name   
            } else {
            charInfoHtmlTemplate += `
            <li><strong>${capitalizeFirstLetter(key)}:</strong> ${charData[key]}</li>
            `            
            }
        }
    }

    if (charData.hasOwnProperty("wikiUrl")){
        wikiUrlTemplate = `<a href="${charData.wikiUrl}" target="_blank">LOTR Wiki Article</a>`
    } else {
        wikiUrlTemplate = ``
    }
   
    var htmlTemplateString = `
        <div class="box char-width">
            <div class="char-flex">
                <div class="">
                    <h1 class="is-size-2">
                        <strong>${charData.name}</strong> 
                    </h1>
                </div>
                <div class="">
                    <button id="fav-button">
                        <img src="./assets/images/${favFilePath}" data-charname="${charData.name}">
                    </button>
                </div>
            </div>         
            <ul>
                ${charInfoHtmlTemplate}
            </ul>
            <br>
            <p>
                "${randomQuote}"
            </p>

            <br>

            ${wikiUrlTemplate}        
        </div>
    `;
    
        $('#character-text').html(htmlTemplateString)

        $('#fav-button').on('click', toggleFavoriteCharacter)
    }
    

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function favButtonToggle (event) {
    
    if (event.target.getAttribute("src") == "./assets/images/not-fav.png") {
        $(event.target).attr("src", "./assets/images/fav.png")
        return
    } else {
        $(event.target).attr("src", "./assets/images/not-fav.png")
    }

}

function favFileFinder(favList, characterName) {
    for (i=0; i < favList.length; i++) {
        if (favList[i] === characterName) {
            favFilePath= "fav.png"
            return favFilePath
        } else {favFilePath ="not-fav.png"}

    }
    return favFilePath
}



function renderGiphy(gif, title) {
    var htmlTemplateImg = `
        <div class="box">
            <figure id="giphy">
                <img class="img-flex" src="${gif}" alt="${title}">
            </figure>
        </div>
    `;

    
    $('#giphy').html(htmlTemplateImg);
};


searchInputEl.autocomplete({
    source: characterFill
  });

// Event listener for search form submission
searchFormEl.on('submit', formSubmit)

// This function handles navbar burger menu collapse/expand
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
    renderFavorites(favoriteCharacterList)
}

init()