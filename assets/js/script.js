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
function formSubmit( event ){
    // Prevents default form submission behavior to reload page.
    event.preventDefault();

    /*
    // Conditional logic to determine which search value we are fetching character data from.
    // If both search input and favorite character input is blank, render modal informing user.
    // If only search input is blank, use the selected favorite character's id.
    // If favorite character input is blank, use search input value.
    // If both search input and favorite character input are have values, use the search input value.
    // The second argument in the getCharacterData function will help determine the API endpoint we will be requesting data from.
    */
    if ( searchInputEl.val() === "" && favoriteInputEl.val() === null ) {
        return renderErrorModal( "Please enter a character name." , "is-info" );
    } else if ( searchInputEl.val() === "" ) {
        getCharacterData( $( '#favorite-value option:selected' ).data('id') , "favs" );
    } else if ( favoriteInputEl.val() === "" ) {
        getCharacterData( searchInputEl.val().trim() , "text" );
        favoriteInputEl.val( "" );
    } else {
        getCharacterData( searchInputEl.val().trim() , "text" );
        favoriteInputEl.val( "" );
    };

    // clears out search input after form submission.
    searchInputEl.val( "" );
};

// Fetch Character data from Lord of the Rings character endpoint based off search value.
function getCharacterData( searchVal , input ) {

    /*
    // Conditional logic to determine API Request url.
    // If searching a favorite character drop down list, look up character by ID.
    // If searching from text input form, look them up by name value in regex query string.
    */
    if (input === "favs" ) {
        var requestUrl = `https://the-one-api.dev/v2/character/${searchVal}/`
    } else if (input === "text" ) { 
        var requestUrl = `https://the-one-api.dev/v2/character?name=/${searchVal}/i`;
    }
    // API Bearer token.
    var bearer = 'Bearer ' + lotrApiKey;
    
    // Fetch request.
    fetch( requestUrl , {
        method: 'GET',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        }})
        .then( function( response ) {
        if ( response.ok ) {
            return response.json()
        .then( function( data ){
            // If only one character is returned, go fetch giphy gif and character quotes.
            if ( data.docs.length === 1 ) {
                getGiphy( data.docs[0].name );
                getCharacterQuotes( data.docs[0] );
            } else if (data.docs.length > 1) {
                // If more than one character is returned, render multiple results modal and store character data temporarily in an object for later use.
                renderMultiResultsModal( data );
                tempCharData = data;
            }
        })
        } else {
            
            throw Error( response.status + ": We were not able to locate the character you searched for." );
        }
        })
        .catch(function( Error ) {
            renderErrorModal( Error, "is-warning" );
    });
};

// Fetch Character quote data from Lord of the Rings quote endpoint based off returned character.
function getCharacterQuotes( charData ) {
    
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
        .then( function( response ) {
        if ( response.ok ) {
            return response.json()
        .then( function( data ){
            // Render Character card using both the character data and quote data.
            renderCharacterData( charData , data );
        })
        } else {
            throw Error( response.status + ": We were not able to locate the character's quotes." );
        }
        })
        .catch( function( Error ) {
            renderErrorModal( Error, "is-warning" );
        });
};

function getGiphy( searchVal ) {

    /*
    // Create random number generator between 0-9 to select a random gif. 
    // Constraining API request to select a gif from the top 10 results to filter out unrelated gifs. 
    // The higher the number the more likely to have an unrelated gif.
    */
    var ranNum = getRandomIndex( 9 );
    
    // API Request URL.
    var requestUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${searchVal}&offset=${ranNum}`;
   
    // Fetch Request.
    fetch( requestUrl )
        .then(function( response ) {
        if ( response.ok ) {
            return response.json()
        
        .then( function( data ) {
            var giphyLink = data.data[ranNum].images.downsized.url;
            var giphyTitle = data.data[ranNum].title;
            renderGiphy( giphyLink, giphyTitle );
        });
        } else {
            throw Error( response.statusText + ". We were not able to locate the character you searched for." );
        }
        })
        .catch( function( Error ) {
            renderModal( Error, "is-warning" );
        });
};

// When More than one character is returned for a character search, this function will print buttons for each character name returned in a modal.
function renderMultiResultsModal( data ) {
    
    var htmlTemplate = "";
    // For loop to create buttons for each character name returned.
    for ( let i=0; i < data.docs.length; i++ ) { 
        htmlTemplate += `
            <button class="button is-danger is-focus is-fullwidth m-1" data-arrayindex="${i}" data-id="${data.docs[i]._id}">${data.docs[i].name}</button>        
        `;
    }

    // Appending character buttons and modal contents into the specific multi results character modal.
    $( '#search-modal-content' ).html(`
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
    modalToggle( "search-result" );
};

// Function to handle rendering error modal.
function renderErrorModal( errorResponse , severity ) {
    
    // Modal type and conditional logic determines what the Modal Header/title will display as, "Need more info" or Warning message from failed fetch request.
    var modalType = "";
    if( severity === "is-warning" ){
        modalType = "Warning";
    } else {
        modalType = "We need more information.";
    };

    // Adding error information to error modal container.
    $( '#error-modal-content' ).html(`
        <article class="message ${severity}">
            <div class="message-header">
                <p>${modalType}</p>
                <button class="delete" aria-label="delete"></button>
            </div>
            <div class="message-body">
                ${errorResponse}
            </div>
        </article>
    `);

    // Toggles error modal
    modalToggle( "error" );
};

// Toggles modal with is-active class to handle displaying and hiding a modal.
function modalToggle( modalId ){
    $( `#${modalId}-modal` ).toggleClass( 'is-active' );
};


// Function to save character as favorite to local storage;
function toggleFavoriteCharacter( event ) {
    
    // Toggles the favorite button icon
    favButtonToggle( event );
    
    // Storing each unique character's id, and character name in object to be stored in local storage.
    var storedCharacterData = {
        id: event.target.dataset.id,
        name: event.target.dataset.charname
    };

    /*
    // For loop to check if character is already on favorites list.
    // If they are remove them from the array, save local storage with new favorite character list.
    // Then re-render the favorite character list. 
    */
    for ( let i=0; i < favoriteCharacterList.length; i++ ) {
        if ( favoriteCharacterList[i].id === storedCharacterData.id ) {
            favoriteCharacterList.splice( i , 1 );
            localStorage.setItem( "favoriteCharacters" , JSON.stringify( favoriteCharacterList ));
            favoriteInputEl.val("");
            return renderFavorites( favoriteCharacterList );
        };
    };

    // If character is not already saved to favorite character list, add the character data object to favorite character list array.
    favoriteCharacterList = favoriteCharacterList.concat( storedCharacterData );

    // Saving the updated favorite character array to local storage.
    localStorage.setItem( "favoriteCharacters" , JSON.stringify( favoriteCharacterList ));
    // Render favorite character list with the new favorite character list.
    renderFavorites( favoriteCharacterList );
};


// Function to render favorite characters to drop down.
function renderFavorites( favorites ) {
    
    // Resets favorite character drop down contents before we re-print the favorite character options.
    favoriteInputEl.html("");
    htmlTemplateString = "";

    //Template literal which will print out a favorite character option for each character saved within the localstorage array.
    for ( let i=0; i < favoriteCharacterList.length; i++ ) {
        htmlTemplateString += `
            <option data-id="${favorites[i].id}">${favorites[i].name}</option>
        `; 
    };

    // Adds template literal to favorite character dropdown.
    favoriteInputEl.html( `${htmlTemplateString}` );
};

// Function to render character data onto page using both character data and quote data.
function renderCharacterData ( charData , quoteData ) {

    // Determines whether the character we are rendering is a favorite or non-favorite character.
    favFileFinder( favoriteCharacterList , charData._id );
    
    /*
    // Logic to determine a random quote.
    // If the character selected has no quotes, let the user know that.
    // Otherwise select a random quote from quote data.
    */
    var randomQuote ="";
    if ( quoteData.total === 0 ) {
        randomQuote = "This character has no known quotes in the movies.";
    } else {
        randomQuote = quoteData.docs[getRandomIndex(quoteData.docs.length)].dialog;
    };

    /*
    // Logic to print character data to a list.
    // For loop will loop through each character object's keys.
    // The following keys will not be printed to the list: Name, _id, wikiURL, and any character key that has a blank value or "NaN" value.
    // Otherwise the loop will add the information to an unordered list.
    */
    var charInfoHtmlTemplate = "";
    for ( const key in charData ) {
        if ( charData.hasOwnProperty(key) ) {
            if( charData[key] === "" || key === "_id" || key === "name" || key === "wikiUrl" || charData[key] === "NaN" ) {
                // Do nothing if key has blank value, is the id, or name.
            } else {
                charInfoHtmlTemplate += `
                    <li><strong>${capitalizeFirstLetter(key)}:</strong> ${charData[key]}</li>
                `;
            };
        };
    };

    /*
    // Logic to handle rendering the wiki URL.
    // If condition to check if character has a wiki Url, if they do add it to an anchor tag template literal.
    // If the character does not have a wiki URL (small minor offshoot characters), the anchor tag template literal will be blank. 
    */
    var wikiUrlTemplate = "";
    if ( charData.hasOwnProperty( "wikiUrl" ) ) {
        wikiUrlTemplate = `<a href="${charData.wikiUrl}" target="_blank">LOTR Wiki Article</a>`;
    } else {
        wikiUrlTemplate = ``;
    };
   
    // Template literal combining all other template literals to print character data to page.
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
                        <img src="./assets/images/${favFilePath}" data-charname="${charData.name}" data-id="${charData._id}">
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
    
    // Appends the character data template literal to character-text container.
    $( '#character-text' ).html( htmlTemplateString );

    // Add event listener for rendered character data favorite button.
    $( '#fav-button' ).on( 'click', toggleFavoriteCharacter );
};

// Function that renders giphy gif to giphy container.
function renderGiphy( gif, title ) {
    var htmlTemplateImg = `
        <div class="box">
            <figure id="giphy">
                <img class="img-flex" src="${gif}" alt="${title}">
            </figure>
        </div>
    `;

    $('#giphy').html(htmlTemplateImg);
};

// Function to return a random number to select a random index from array.
function getRandomIndex( length ) {
    return Math.floor( Math.random()*length );
};

// Function to capitalize the first letter of a word.
function capitalizeFirstLetter( string ) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Function to swap icon between fav.png and not-fav.png.
function favButtonToggle( event ) {
    
    if ( event.target.getAttribute("src") == "./assets/images/not-fav.png" ) {
        return $(event.target).attr("src", "./assets/images/fav.png");
    } else {
        return $(event.target).attr("src", "./assets/images/not-fav.png");
    };
};

// Function to determine to display fav.png or not-fav.png icon for the favorite button.
function favFileFinder( favList, id ) {
    for ( let i=0; i < favList.length; i++ ) {
        if ( favList[i].id === id ) {
            favFilePath = "fav.png";
            return favFilePath;
        } else {
            favFilePath = "not-fav.png";
        };
    };
    return favFilePath;
};

// JqueryUI method to autofill based off the characterFill array from char-fill.js.
searchInputEl.autocomplete({
    source: characterFill
});

// Event listener for search form submission.
searchFormEl.on( 'submit' , formSubmit );

// This function handles navbar burger menu collapse/expand.
$(document).ready(function() {
    // Check for click events on the navbar burger icon.
    $(".navbar-burger").click(function() {
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu".
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });
});

// Event listener added to multi results modal buttons which accesses the temporary character data object we stored character data in.
$('#search-modal-content').on( 'click' , '[data-arrayindex]' , function() {
    
    // Handle fetch requests for giphy and character quotes based off the values from our stored temporary character data object.
    getGiphy( tempCharData.docs[this.dataset.arrayindex].name );
    getCharacterQuotes( tempCharData.docs[this.dataset.arrayindex] );
    modalToggle( "search-result" );

});

// Event listener for error modal to handle closing the modal.
$(document.body)
    .on( 'click' , '[data-target]' , function(){
        if ( this.dataset.target === "error" ) {
            modalToggle( this.dataset.target );
        };
});


// Initial page load function to pull favorite characters from local storage.
function init() {

    // This will parse the favorite character list array from local storage.
    favoriteCharacterList = JSON.parse(localStorage.getItem("favoriteCharacters"));
    
    // If local storage favorite character values do not exist; set it as a blank array.
    if ( favoriteCharacterList === null ) {
        return favoriteCharacterList = [];
    };
    renderFavorites( favoriteCharacterList );
};

// Calling the initial page load function.
init();