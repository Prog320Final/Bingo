window.onload = () => {

    //let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

    let bearer; // global variable stores bearer access token to use in requests
    let json_dogs_array; // global array to store json data from requests
    export let myDogs = []; // global array to store dog objects parsed from json requests

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

}