var searchFormEl = $('#search-input')
var searchInputEl = $('#search-value')
var favoriteInputEl = $('#favorite-value')

var lotrApiKey = "wamtzXv_h1XiQdZTQkoc"
var giphyApiKey = "Pv2YHiUAl6VaFAsN816cOhgxrE28iBKF"
var giphyLink;
var favoriteCharacterList = []
var favFilePath = "not-fav.png"

function TestsFunction() { TestsDiv.style.display = 'block' }
// Form submission function
function formSubmit(event){
    
    event.preventDefault()

    if (searchInputEl.val()==="" && favoriteInputEl.val()===null) {
        console.log("Can you see this")
        renderErrorModal("Please enter a character name.", "is-info")
        return
    } else if(searchInputEl.val()===""){
        getCharacterData(favoriteInputEl.val())
        // getGiphy(favoriteInputEl.val())

    } else if (favoriteInputEl.val()==="") {
        getCharacterData(searchInputEl.val().trim())
        favoriteInputEl.val("")
        console.log()
        // getGiphy(searchInputEl.val())
        
    } else {
        getCharacterData(searchInputEl.val().trim())
        favoriteInputEl.val("")
        // getGiphy(searchInputEl.val())
    }
    
    // clears out search input after form submission
    searchInputEl.val("")
    // favoriteInputEl.val("")
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
            if (data.docs.length === 1) {
                getGiphy(data.docs[0].name)
                getCharacterQuotes(data.docs[0])
            } else if (data.docs.length > 1) {
                renderMultiResultsModal(data)
            }
            
        console.log(data);
        // console.log(data.docs[0].dataset['_id'])
        console.log(data.docs[0].wikiUrl)
        console.log(data.docs[0]._id)
        console.log(data.docs[0].name)
        // saveFavoriteCharacter(data.docs[0].name)
        
        
        })
        } else {
            
            throw Error(response.status + ": We were not able to locate the character you searched for.");
        }
        })
        .catch(function (Error) {
            renderErrorModal(Error, "is-warning")
    });;
};

function getCharacterQuotes(charData){
    var requestUrl = `https://the-one-api.dev/v2/character/${charData._id}/quote`;
    
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

        renderCharacterData(charData , data)
        // console.log(charData)
        // console.log(charData._id)
        // console.log(data);
        // // console.log(data.docs[0].dataset['_id'])
        // console.log(data.docs)
        // console.log(data.docs.length)
        // console.log(data.docs[0].dialog)
        
        })
        } else {
            console.log(Error)
            throw Error(response.status + ": We were not able to locate the character's quotes.");
        }
        })
        .catch(function (Error) {
            renderErrorModal(Error, "is-warning")
        });;
}

// Modal handler
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

function renderMultiResultsModal(data) {
    
    var htmlTemplate = ""
    for (i=0; i < data.docs.length; i++) {
        console.log(data.docs[i]._id)
        console.log(data.docs[i].name)
        htmlTemplate += `
        <button class="button is-dark is-fullwidth m-1" data-id="${data.docs[i]._id}">${data.docs[i].name}</button>        
            `;
    }


    $('#search-modal-content').html(`
                <article class="message is-info">
                    <div class="message-header">
                        <p>"is-info"</p>
                        
                    </div>
                    <div class="message-body">
                        ${htmlTemplate}
                    </div>
                </article>
                `)
    modalToggle("search-result")
    // <button class="delete" aria-label="delete"></button>
    
};

// $('#search-modal-content').on('click', '[data-target]', modalToggle("search-result"))
// $('#error-modal').on('click', modalToggle("error"))


function modalToggle(modalId){
    $(`#${modalId}-modal`).toggleClass('is-active')
}


$( document.body)
.on('click', '[data-target]', function(){
    if (this.dataset.target === "error") {
        modalToggle(this.dataset.target)
    } else if (this.dataset.target === "search-result"){

        modalToggle(this.dataset.target)
    }
    // modalToggle(this.dataset.target)
    // $(`#${this.dataset.target}`).toggleClass('is-active')}
});


function getGiphy(searchVal) {

    // TODO: create random number generator between 0 and 50? for ranNum variable
    var ranNum = Math.floor(Math.random() * 9);
    console.log(ranNum);
    var requestUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${searchVal}&offset=${ranNum}`;
   
    fetch(requestUrl)
        .then(function (response) {
        if (response.ok) {
            return response.json()
        
        .then(function (data) {
            // console.log(ranNum);
            // console.log(data.data[ranNum].images.downsized.url);
            giphyLink = data.data[ranNum].images.downsized.url;
            console.log(data)
            renderGiphy(giphyLink);
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


// Initial page load function to pull favorite characters from local storage
function init() {

    // This will parse the favorite character list array from local storage
    favoriteCharacterList = JSON.parse(localStorage.getItem("favoriteCharacters"));
    
    // If local storage favorite character values do not exist; set it as a blank array
    if (favoriteCharacterList===null) {
        console.log(favoriteCharacterList)

        return favoriteCharacterList = []
    }
    
    renderFavorites(favoriteCharacterList)
}

// Function to save character as favorite to local storage

function toggleFavoriteCharacter(event) {
    favButtonToggle(event)
        
    var characterName = event.target.dataset.charname
    
    for (i=0; i < favoriteCharacterList.length; i++) {
        if (favoriteCharacterList[i] === characterName) {
            favoriteCharacterList.splice(i, 1)
            console.log(favoriteCharacterList)
            return renderFavorites(favoriteCharacterList)
        } 
    }

    // If character name is not saved to favorite character list, add it to array
    favoriteCharacterList = favoriteCharacterList.concat(characterName);
    console.log(favoriteCharacterList)
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

init()


function renderCharacterData (charData, quoteData) {
    console.log(favoriteCharacterList)
    favFileFinder(favoriteCharacterList, charData.name)
    console.log(charData)
    console.log(quoteData)
    var randomQuote =""
    
    if (quoteData.total===0){
        randomQuote = "This character has no known quotes in the movies."
    } else {
     randomQuote = quoteData.docs[getRandomIndex(quoteData.docs.length)].dialog
    }

    function getRandomIndex( length ) {
        return Math.floor(Math.random()*length);
    }
    console.log(randomQuote)
    
    var charInfoHtmlTemplate = ""

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
    

    var htmlTemplateString = `
            <div class="columns is-align-items-center">
                <div class="column">
                    <h1 class="is-size-2">
                        <strong>${charData.name}</strong> 
                    </h1>
                </div>
                <div class="column has-text-right">
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
            
            <a href="${charData.wikiUrl}" target="_blank">LOTR Wiki Article</a>
                
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



function renderGiphy(gif) {
    var htmlTemplateImg = `
        <figure id="giphy">
            <img src="${gif}" alt="Image">
        </figure>
    `;

    
    $('#giphy').html(htmlTemplateImg);
};