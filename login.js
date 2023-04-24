"use strict";

const endpoint = "https://studyplanner-ad697-default-rtdb.europe-west1.firebasedatabase.app/";

window.addEventListener("load", main);

function main() {
    document.querySelector("#sign_in").addEventListener("submit", login);
}

async function login(event) {
    event.preventDefault();
    const userName = document.querySelector("#user_name").value;
    const pin = document.querySelector("#pin").value;
    console.log(userName);
    const response = await fetch(`${endpoint}/users/${userName}.json`);
    const data = await response.json();

    if(response.ok && await validPin(data.pin)) {
        alert("SUCCESS! :D");
        //set localStorage
    } else {
        alert("WRONG PASSWORD >:(");
    }
    console.log(data);
}

async function validPin(fetchedPin) {
    const pin = document.querySelector("#pin").value;

    return pin === fetchedPin;
}