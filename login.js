"use strict";

const endpoint = "https://studyplanner-ad697-default-rtdb.europe-west1.firebasedatabase.app/";

window.addEventListener("load", main);

function main() {
    document.querySelector("#sign_in").addEventListener("submit", login);
}

async function login(event) {
    event.preventDefault();
    const userName = document.querySelector("#user_name").value;

    const response = await fetch(`${endpoint}/users/${userName}.json`);

    const userData = await response.json();

    if(response.ok && await validPin(userData.pin)) { 
        await setLocalStorage(userData);
        window.location = "/main.html";
    } else {
        alert("WRONG PASSWORD >:(");
    }
    console.log(userData);
}

async function validPin(fetchedPin) {
    const pin = document.querySelector("#pin").value;

    return pin === fetchedPin;
}

async function setLocalStorage(userData) {
    localStorage.setItem("userName", userData.userName);
    localStorage.setItem("groupName", userData.groupName);
    
}