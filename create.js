"use strict";

const endpoint = "https://studyplanner-ad697-default-rtdb.europe-west1.firebasedatabase.app/"; 

window.addEventListener("load", main);

function main(event) {
    document.querySelector("#sign_up").addEventListener("submit", createUser);
    document.querySelector("#btn_refresh").addEventListener("mouseup", createRandomPins);
    createRandomPins();
}

async function createUser(event) {
    event.preventDefault();
    const userData = {
        fullName: event.target["full_name"].value,
        email: event.target["email"].value,
        phone: event.target["phone"].value,
        userName: event.target["user_name"].value,
        pin: event.target["pin"].value,
    }

    const postAsJson = JSON.stringify(userData);

    const res = await fetch(`${endpoint}/users/${event.target["user_name"].value}.json`, {
        method: "PUT",
        body: postAsJson
    });
    const data = await res.json();
    
    if(res.ok) {
       window.location = "/login.html";
    } 


}

function createRandomPins() {
    const pins = document.querySelectorAll('[name="pin"]');

    for (let i = 0; i < pins.length; i++) {
        const pin = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        document.querySelector(`label[for="${pins[i].id}"`).innerHTML = pin; 
        pins[i].value = pin;
    }
}