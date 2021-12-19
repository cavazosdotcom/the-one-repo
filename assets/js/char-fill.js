// Global variable and element selector
var searchFormEl = $( '#search-input' );
var characterFill = [];
var lotrApiKey = 'wamtzXv_h1XiQdZTQkoc';

// Function to fetch all LOTR characters to populate an array for a jQueryUI autocomplete component 
function getAllCharData () {
    var requestUrl = `https://the-one-api.dev/v2/character`;
    var bearer = 'Bearer ' + lotrApiKey;
    
    fetch( requestUrl , {
        method: 'GET',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        }})
        .then( function ( response ) {
            return response.json()
        .then( function( data ) {
            // For each character name returned, add to an array
            for( i=0; i < data.docs.length; i++ ) {
                characterFill = characterFill.concat( data.docs[i].name );
            };
            // Sets character fill array as variable to the whole browser window 
            window.characterFill = characterFill;
            searchInputEl.autocomplete({
                source: characterFill
            });
        });
    });
};

// Calling the function to get all character data on page load
getAllCharData();
