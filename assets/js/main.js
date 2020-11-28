var listId = 1;
var savedPets = [];


// Now comes the code that must wait to run until the document is fully loaded
document.addEventListener("DOMContentLoaded", function (event) {


  //EventListener here shows a hidden menu
  //If the inventory menu is equal to edit then show the avalable filters
  invItems.addEventListener("change", function (event) {
    console.log("invItem = " + invItems.options[invItems.selectedIndex].value);
    document.getElementById("editoptions").style.display = "none";

    if (invItems.options[invItems.selectedIndex].value == "edit") {
      document.getElementById("editoptions").style.display = "block";
    }
  });
  //If the user likes a dog save it to an array to be printed later
  document.getElementById("love").addEventListener("click", function(){
    var selectedDog = document.getElementById("dogId");
    for (i =0; i< myDogs.length;i++){
      if(selectedDog === myDogs[i].ID){
        savedPets.add(myDogs[i]);
        break;
      }
      };
      
    savedPets.push(new Item(selectedDog));
    listId++;
  });

  document.getElementById("buttonDelete").addEventListener("click", function () {

    var ID = document.getElementById("deleteID").value;
    $.ajax({
      type: "DELETE",
      url: "/DeleteItem/" + ID,
      success: function (result) {
        console.log(result);
        document.location.href = "index.html#Show";  // go to this page to show item was deleted
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log('Error in Operation');
        alert("Server could not delete Note with ID " + ID)
      }
    });

  });
  $(document).on('pagebeforeshow', '#Show', function () {
    UpdateDisplay();
  }
  );



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
