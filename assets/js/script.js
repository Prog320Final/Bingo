

//let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let bearer; // global variable stores bearer access token to use in requests
let json_dogs_array; // global array to store json data from requests

let myDogs = []; // global array to store dog objects parsed from json requests
let savedPets = [];

let cardCounter = 0;


// dog class object to parse relevant information
class Dog {
    constructor(name, id, age, gender, primaryBreed, secondaryBreed, distance, photo, link) {
        this.name = name;
        this.id = id;
        this.age = age;
        this.gender = gender;
        this.primaryBreed = primaryBreed;
        this.secondaryBreed = secondaryBreed;
        this.distance = distance;
        this.photo = photo;
        this.link = link;
    }
}

// sleep function, prevents code from executing until requests are returned
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// function to request an access token for requesting data
async function getAccessToken() {
    const url = "https://api.petfinder.com/v2/oauth2/token"; // static request url for authentication

    let xhr = new XMLHttpRequest(); // object to send requests
    xhr.open("POST", url); // request method
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // request headers

    // function checks and executes if request was successful
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status == 200) {
        bearer = (JSON.parse(xhr.responseText)); // if request was successful, saves retrieved json data
        }
    };
    
    // data containing API Key and API Secret Key for requesting access token
    const data = "grant_type=client_credentials&client_id=RTcFlbH4bSiSoZd98dsAc399pmqiche3d34tmb91ShrNsOwkwM&client_secret=Xeu8G75Gqa2VJJguD1LgFhVlzmXIBhy1wqfqpRio";
    
    xhr.send(data); // sends the request object, with data parameter
}

// function to return the access token
async function accesstoken () {
    await sleep(2000); // awaits sleep function before continuing, needs to wait for request to complete before continuing executing
    return bearer.access_token; // returns access token from parsed json data
}

// function to GET list of dogs using static parameters
async function getDogList() {
    // static request url for first page display
    let url = "https://api.petfinder.com/v2/animals?type=dog&location=98102";

    let xhr = new XMLHttpRequest(); // object to send requests
    xhr.open("GET", url); // request method
    let token = await accesstoken(); // access token required to send requests
    xhr.setRequestHeader("Authorization", "Bearer " + token); // request headers

    // function checks and executes if request was successful
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status == 200) {
        json_dogs_array = (JSON.parse(xhr.responseText)); // if request was successful, saves retrieved json data to array
        console.log(json_dogs_array.animals);
        }
    };

    xhr.send(); // sends the request object
}

// function to GET list of dogs using user input search parameters
async function searchDogs(age, breed, gender, location) {
    // dynamic search url that takes user search parameters
    let url = "https://api.petfinder.com/v2/animals?type=dog";
    // changes search parameters based on user input
    let breedSearch = "&breed=" + breed;
    let genderSearch = "&gender=" + gender;
    let ageSearch = "&age=" + age;
    let locationSearch = "";
    // changes location search parameter
    if (location != "") {
        locationSearch = "&location=" + location;
    }
    // defaults location to seattle
    else {
        locationSearch = "&location=98102";
    }
    
    url = url + breedSearch + genderSearch + ageSearch + locationSearch;

    console.log(url);

    let xhr = new XMLHttpRequest(); // object to send requests
    xhr.open("GET", url); // request method
    let token = await accesstoken(); // access token required to send requests
    xhr.setRequestHeader("Authorization", "Bearer " + token); // request headers

    // function checks and executes if request was successful
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status == 200) {
        json_dogs_array = (JSON.parse(xhr.responseText)); // if request was successful, saves retrieved json data to array
        }
    };
    xhr.send(); // sends the request object

    showDogs();
}

// function to store and print list of dogs retrieved
async function showDogs () {

    // resets card counter to track newly displayed dogs
    cardCounter = 0;

    await sleep(5000);
    myDogs = [];

    // loops through json data retrieved
    for (let i in json_dogs_array.animals) {
        // only pushes dogs with a photo
        if (json_dogs_array.animals[i].photos.length > 0) {
            // stores each dog's information
            let dogName = json_dogs_array.animals[i].name;
            let dogID = json_dogs_array.animals[i].id;
            let dogAge = json_dogs_array.animals[i].age;
            let dogGender = json_dogs_array.animals[i].gender;
            let dogPrimBreed = json_dogs_array.animals[i].breeds.primary;
            let dogSecBreed = json_dogs_array.animals[i].breeds.secondary;
            let dogDistance = Math.round(json_dogs_array.animals[i].distance);
            let dogLink = json_dogs_array.animals[i].url;
            let dogPhoto = json_dogs_array.animals[i].primary_photo_cropped.full;

            // creates dog object to parse relevant information
            let newDog = new Dog(dogName, dogID, dogAge, dogGender, dogPrimBreed, dogSecBreed, dogDistance, dogPhoto, dogLink);

            // pushes the dog object into our dog array
            myDogs.push(newDog);
        }
    }
    // prints array of dogs retrieved
    console.log(myDogs);
    // adds dogs to the list on the page
    showDogsOnPage();
}



function testDisplay(index) {
    let dogName = myDogs[index].name;
    let dogAge = myDogs[index].age;
    let dogGender = myDogs[index].gender;
    let dogBreed = myDogs[index].primaryBreed;
    let dogDistance = myDogs[index].distance;
    let dogPhoto = myDogs[index].photo;

    let selectDiv = "card-" + index;
    console.log(selectDiv);
    const myList = document.getElementById(selectDiv); // gets element id from the page

    addToCardPhoto.appendToImg(myList, dogPhoto);
    addToCardName.appendToHeader(myList, dogName);

    if (myDogs[index].secondaryBreed != null) {
        let dogBreedSec = myDogs[index].secondaryBreed;
        addToCardInfo.appendToList(myList, dogAge, dogGender, dogBreed, dogDistance, dogBreedSec); 
    }
    else {
        addToCardInfo.appendToList(myList, dogAge, dogGender, dogBreed, dogDistance);
    }
}

// function to add values to a list element on the page
const addToCardInfo = {
    appendToList: (card, age, gender, breed, distance, breedSec) => {
        const p = document.createElement('p');
        const br = document.createElement('br');
        //const br = document.createElement('p');
        p.setAttribute('style', 'margin-top: 24px; font-size: 20px; padding: 0 16px; pointer-events: none;')
        p.appendChild(document.createTextNode('Age: ' + age));
        p.appendChild(document.createElement('br'))
        p.appendChild(document.createTextNode('Gender: ' + gender));
        p.appendChild(document.createElement('br'))
        if (breedSec != null) {
            p.appendChild(document.createTextNode('Breeds: ' + breed + ', ' + breedSec));
            //p.appendChild(document.createTextNode('Secondary Breed:' + breed));
            //p.appendChild(document.createElement('br'))
        }
        else {
            p.appendChild(document.createTextNode('Breed: ' + breed));

        }
        p.appendChild(document.createElement('br'))
        p.appendChild(document.createTextNode('Distance: ' + distance + ' miles away'));
        card.appendChild(p);
    }
}

// function to create new dog card on the page
const addNewCard = {
    appendToDiv: (divID) => {
        const card = document.createElement('div');
        $(card).addClass('newbingo');
        card.appendChild(document.createTextNode('test123'));
        divID.appendChild(card);
    }
}

// function to add the name of the dog in a h3 tag with class="name"
const addToCardName = {
    appendToHeader: (header, value) => {
        const h3 = document.createElement('h3');
        h3.setAttribute('class', 'name');
        h3.appendChild(document.createTextNode(value));
        header.appendChild(h3);
    }
}

// function to add the name of the dog in a h3 tag with class="name"
const addToCardPhoto = {
    appendToImg: (photo, value) => {
        const img = document.createElement('img');
        img.src = value;
        //img.appendChild(document.createTextNode(value));
        photo.appendChild(img);
    }
}

function showDogsOnPage() {

    //let listDogPhoto = myDogs[0].photo;
    //let listDogUrl = myDogs[0].link;
    //const myList2 = document.getElementById('testName');

    //addToList.appendToList(myList, listDogPhoto);
    //addToList.appendToList(myList, listDogUrl);
    //const bingoArray = document.getElementsByClassName('bingo--cards');
    
    //let bingoDiv = bingoCards[0];

    for (let i = 0; i < 5; i++) {
        testDisplay(i);
    }

    //addNewCard.appendToDiv(bingoDiv);

    //const card = document.createElement('div');
    //$(card).addClass('newbingo');
    //$(card).addClass('bingo--card');
    //card.setAttribute('class', 'bingo--card');
    //card.setAttribute('style', 'touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);');
    //card.style.userSelect = none;
    //$(card)
    //    .appendTo('.bingo--cards');
    //const test123 = document.getElementsByClassName('bingo--card');
}

// placeholder main function
getAccessToken();
getDogList();
showDogs();


document.getElementById('apply').addEventListener('click', function () {

    let breedFilter = document.getElementById('breeds').value;
    let genderFilter = document.getElementById('gender').value;
    let ageFilter = document.getElementById('age').value;
    let locationFilter = document.getElementById('location').value;
  
    console.log(breedFilter);
    console.log(genderFilter);
    console.log(ageFilter);
    console.log(locationFilter);
  
    searchDogs(ageFilter, breedFilter, genderFilter, locationFilter);
});


// Now comes the code that must wait to run until the document is fully loaded
document.addEventListener("DOMContentLoaded", function (event) {
    //EventListener here shows a hidden menu
    //If the inventory menu is equal to edit then show the avalable filters
    invItems.addEventListener("change", function (event) {
        document.getElementById("editoptions").style.display = "none";

        if (invItems.options[invItems.selectedIndex].value == "edit") {
            document.getElementById("editoptions").style.display = "block";
        }
    });

    document.getElementById("love").addEventListener("click", function() {
        let selectedDog = document.getElementsByClassName("name");
        let firstdog = selectedDog[0].innerHTML;
        for (i = 0; i < myDogs.length; i++) {
            if (firstdog === myDogs[i].name) {
                savedPets.push(myDogs[i]);
                break;
            }
        }
        console.log(savedPets);
    });

    // document.getElementById("buttonDelete").addEventListener("click", function () {

    //     var ID = document.getElementById("deleteID").value;
    //     $.ajax({
    //         type: "DELETE",
    //         url: "/DeleteItem/" + ID,
    //         success: function (result) {
    //         console.log(result);
    //         document.location.href = "index.html#Show";  // go to this page to show item was deleted
    //         },
    //         error: function (xhr, textStatus, errorThrown) {
    //         console.log('Error in Operation');
    //         alert("Server could not delete Note with ID " + ID)
    //         }
    //     });
    // });

    $(document).on('pagebeforeshow', '#Show', function () {
        UpdateDisplay();
    });

});

'use strict';

var bingoContainer = document.querySelector('.bingo');
var allCards = document.querySelectorAll('.bingo--card');
var nope = document.getElementById('nope');
var love = document.getElementById('love');

function initCards(card, index) {
    var newCards = document.querySelectorAll('.bingo--card:not(.removed)');

    newCards.forEach(function (card, index) {
    card.style.zIndex = allCards.length - index;
    card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
    card.style.opacity = (10 - index) / 10;
    });

    bingoContainer.classList.add('loaded');
}

initCards();

allCards.forEach(function (el) {
    var hammertime = new Hammer(el);

    hammertime.on('pan', function (event) {
    el.classList.add('moving');
    });

    hammertime.on('pan', function (event) {
    if (event.deltaX === 0) return;
    if (event.center.x === 0 && event.center.y === 0) return;

    bingoContainer.classList.toggle('bingo_love', event.deltaX > 0);
    bingoContainer.classList.toggle('bingo_nope', event.deltaX < 0);

    var xMulti = event.deltaX * 0.03;
    var yMulti = event.deltaY / 80;
    var rotate = xMulti * yMulti;

    event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
    });

    hammertime.on('panend', function (event) {
    el.classList.remove('moving');
    bingoContainer.classList.remove('bingo_love');
    bingoContainer.classList.remove('bingo_nope');

    var moveOutWidth = document.body.clientWidth;
    var keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

    event.target.classList.toggle('removed', !keep);

    if (keep) {
        event.target.style.transform = '';
    } else {
        var endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
        var toX = event.deltaX > 0 ? endX : -endX;
        var endY = Math.abs(event.velocityY) * moveOutWidth;
        var toY = event.deltaY > 0 ? endY : -endY;
        var xMulti = event.deltaX * 0.03;
        var yMulti = event.deltaY / 80;
        var rotate = xMulti * yMulti;

        event.target.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
        initCards();
    }
    });
});

function createButtonListener(love) {
    return function (event) {
    var cards = document.querySelectorAll('.bingo--card:not(.removed)');
    var moveOutWidth = document.body.clientWidth * 1.5;

    if (!cards.length) return false;

    var card = cards[0];

    card.classList.add('removed');

    if (love) {
        card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
    } else {
        card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
    }

    initCards();

    event.preventDefault();
    };
}

var nopeListener = createButtonListener(false);
var loveListener = createButtonListener(true);

nope.addEventListener('click', nopeListener);
love.addEventListener('click', loveListener);
    

// Select the node that will be observed for mutations
// const targetNode = document.querySelector('.bingo--cards');

// // Options for the observer (which mutations to observe)
// const config = { attributes: true, childList: true, subtree: true };

// // Callback function to execute when mutations are observed
// const callback = function(mutationsList, observer) {
//     // Use traditional 'for loops' for IE 11
//     for(const mutation of mutationsList) {
//         if (mutation.type === 'childList') {
//             initCards();
//             console.log('A child node has been added or removed.');
//         }
//         else if (mutation.type === 'attributes') {
//             //console.log('The ' + mutation.attributeName + ' attribute was modified.');
//         }
//     }
// };

// // Create an observer instance linked to the callback function
// const observer = new MutationObserver(callback);

// // Start observing the target node for configured mutations
// observer.observe(targetNode, config);

// // Later, you can stop observing
// //observer.disconnect();
