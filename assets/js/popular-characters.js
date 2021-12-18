var searchFormEl = $('#search-input')
var popularCharacters = []

getAllCharData()

function getAllCharData () {

    var requestUrl = `https://the-one-api.dev/v2/character`;
    
    var bearer = 'Bearer ' + "wamtzXv_h1XiQdZTQkoc";
    
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
        for(i=0; i < data.docs.length; i++) {
            popularCharacters = popularCharacters.concat(data.docs[i].name)
        }

        window.popularCharacters = popularCharacters
        searchInputEl.autocomplete({
            source: popularCharacters
          });
        console.log(data.docs)
        
        })
        } else {
            
            throw Error(response.status + ": We were not able to locate the character you searched for.");
        }
        })
        .catch(function (Error) {
            renderErrorModal(Error, "is-warning")
    });;
};


// var popularCharacters = [
//     "Frodo Baggins",
//     "Samwise Gamgee",
//     "Gandalf",
//     "Aragorn II Elessar",
//     "Legolas Greenleaf",
//     "Peregrin Took",
//     "Meriadoc Brandybuck",
//     "Sauron",
//     "Gimli",
//     "Bilbo Baggins",
//     "Boromir II",
//     "Gollum",
//     "Saruman",
//     "Faramir",
//     "Elrond Half-elven",
//     "Galadriel",
//     "Éowyn",
//     "Théoden Ednew",
//     "Éomer Éadig",
//     "Farmer Cotton",
//     "Treebeard",
//     "Gríma Wormtongue",
//     "Denethor II",
//     "Tom Bombadil",
//     "Gloin",
//     "Shelob",
//     "Isildur",
//     "Celeborn the Wise",
//     "Haldir",
//     "Shadowfax",
//     "Thorin II Oakenshield",
//     "Balin",
//     "Dwalin",
//     "Bifur",
//     "Bofur",
//     "Bombur",
//     "Fíli",
//     "Kíli",
//     "Óin",
//     "Nori",
//     "Dori",
//     "Ori",
//     "Radagast",
//     "Azog",
//     "Smaug",
//     "Hamfast Gamgee",
//     "Bill the Pony",
//     "Elendil",
//     "Glorfindel",
//     "Goldberry",
//     "Barliman Butterbur",
//     "Shagrat",
//     "Uglúk",
//     "Bill Ferny",
//     "Beregond",
//     "Gorbag",
//     "Imrahil",
//     "Farmer Maggot",
//     "Lotho Sackville-Baggins",
//     "Fredegar 'Fatty' Bolger",
//     "Eorl the Young",
//     "Gildor Inglorion",
//     "Nob",
//     "Varda",
//     "Grishnákh"
//   ];
  

// window.popularCharacters = popularCharacters