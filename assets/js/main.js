
// Now comes the code that must wait to run until the document is fully loaded
document.addEventListener("DOMContentLoaded", function (event) {


  //EventListener here shows a hidden menu
  //If the inventory menu is equal to edit then show the avalable filters
  invItems.addEventListener("change", function (event) {
    console.log("invItem = " + invItems.options[invItems.selectedIndex].value);
    document.getElementById("starfrags").style.display = "none";

    if (invItems.options[invItems.selectedIndex].value == "starFragchoice") {
      document.getElementById("starfrags").style.display = "block";
    }
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


window.onload = () => {

  //let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

  let bearer; // global variable stores bearer access token to use in requests
  let json_dogs_array; // global array to store json data from requests
  let myDogs = []; // global array to store dog objects parsed from json requests

  // dog class object to parse relevant information
  class Dog {
      constructor(name, id, age, gender, primaryBreed, secondaryBreed){
          this.name = name;
          this.id = id;
          this.age = age;
          this.gender = gender;
          this.primaryBreed = primaryBreed;
          this.secondaryBreed = secondaryBreed;
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

  // function to GET list of dogs using given parameters
  async function getDogList() {
      // static request url, can be modified to be made dynamic
      let url = "https://api.petfinder.com/v2/animals?type=dog&location=98102";

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
  }

  // function to store and print list of dogs retrieved
  async function showDogs () {

      await sleep(5000);

      // loops through json data retrieved
      for (let i in json_dogs_array.animals) {
          // stores each dog's information
          let dogName = json_dogs_array.animals[i].name;
          let dogID = json_dogs_array.animals[i].id;
          let dogAge = json_dogs_array.animals[i].age;
          let dogGender = json_dogs_array.animals[i].gender;
          let dogPrimBreed = json_dogs_array.animals[i].breeds.primary;
          let dogSecBreed = json_dogs_array.animals[i].breeds.secondary;
          
          // creates dog object to parse relevant information
          let newDog = new Dog(dogName, dogID, dogAge, dogGender, dogPrimBreed, dogSecBreed);

          // pushes the dog object into our dog array
          myDogs.push(newDog);
      }
      // prints array of dogs retrieved
      console.log(myDogs);
      // adds dogs to the list on the page
      showDogsOnPage();
  }


  //creates a card with dog information
  // const addToCard = {
  //     appendToCard: (pDogCard) => {
  //         var card = document.createElement("div");
  //         pDogCard.setAttribute('class', 'bingo--card');
  //         appendDetailsToCard: (name ,value) => {
  //             var name = document.createElement("h3");
  //             name.setAttribute('class', 'dogName');
  //             name.appendChild(document.createTextNode(pDogCard.dogName));
  //             var age = document.createElement("p");
  //             age.setAttribute('class', 'dogDetails');
  //             age.appendChild(document.createTextNode(pDogCard.dogAge));
  //             var gender = document.createElement("p");
  //             gender.setAttribute('class','dogDetails');
  //             gender.appendChild(document.createTextNode(pDogCard.dogGender));
  //             var breed = document.createElement("p");
  //             breed.setAttribute('class', 'dogDetails');
  //             breed.appendChild(document.createTextNode(pDogCard.dogBreed));
  //         }
  //     }
  // }

  async function showDogsOnCard(myDogs) {
      for (let i = 0; i < myDogs.length; i++) {
          //let dogId = myDogs[i].id;
          let dogName = myDogs[i].name;
          let dogAge = myDogs[i].age;
          let dogGender = myDogs[i].gender;
          let dogBreed = myDogs[i].primaryBreed;

          console.log(dogName);
          console.log(dogAge);
          //grabs the card deck div
          //appends the card to the deck
          //then appends all the information to the card

          var card = document.createElement('div');
          card.setAttribute('class', 'bingo--card');
            var name = document.createElement('h3');
            name.setAttribute('class', 'dogName');
            name.appendChild(document.createTextNode(dogName));
            card.appendChild(name);
            var age = document.createElement('p');
            age.setAttribute('class', 'dogDetails');
            age.appendChild(document.createTextNode(dogAge));
            card.appendChild(age);
            var gender = document.createElement('p');
            gender.setAttribute('class','dogDetails');
            gender.appendChild(document.createTextNode(dogGender));
            card.appendChild(gender);
            var breed = document.createElement('p');
            breed.setAttribute('class', 'dogDetails');
            breed.appendChild(document.createTextNode(dogBreed));
            card.appendChild(breed);


            var cardDeck = document.getElementById('bingo--cards');
            cardDeck.appendChild(card);


          //addToCard.appendToCard(dogCard);
      }
  }

  function appendDetailsToCard() {

  }



  // function to add values to a list element on the page
  const addToList = {
      appendToList: (list, value) => {
          const li = document.createElement("li");
          li.appendChild(document.createTextNode(value));
          list.appendChild(li);
      }
  }

  // appends dogs to list elements on the page
  function showDogsOnPage() {
      for(let i in myDogs) { // loops through the dog array
          let listDog = myDogs[i].name
          const myList = document.getElementById('dogList'); // gets element id from the page
          addToList.appendToList(myList, listDog); // appends the value to the element
      }
  }
  // placeholder main function
  getAccessToken();
  getDogList();
  showDogs();
  showDogsOnCard(myDogs);
}