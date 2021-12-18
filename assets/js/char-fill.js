var searchFormEl = $('#search-input')
var characterFill = []
var lotrApiKey = 'wamtzXv_h1XiQdZTQkoc'

getAllCharData()

function getAllCharData () {

    var requestUrl = `https://the-one-api.dev/v2/character`;
    
    var bearer = 'Bearer ' + lotrApiKey;
    
    fetch(requestUrl , {
        method: 'GET',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        }})
        .then(function (response) {
        
            return response.json()
        .then(function(data){
            for(i=0; i < data.docs.length; i++) {
                characterFill = characterFill.concat(data.docs[i].name)
            }

            window.characterFill = characterFill
            searchInputEl.autocomplete({
                source: characterFill
            });
        
        })
    })
}
