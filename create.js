"use strict";

const endpoint = "https://studyplanner-ad697-default-rtdb.europe-west1.firebasedatabase.app/"; 

window.addEventListener("load", main);

function main(event) {
    document.querySelector("#sign_up").addEventListener("submit", createUser);
    document.querySelector("#btn_refresh_pins").addEventListener("mouseup", createRandomPins);
    document.querySelector("#btn_go_to_login").addEventListener("mouseup", goToLogin);
    createRandomPins();
}

async function createUser(event) {
    event.preventDefault();
    
    resetErrorMsg();
    
    if(!await isUserExist(event.target["user_name"].value)) {
        const userData = {
            fullName: event.target["full_name"].value,
            email: event.target["email"].value,
            phone: event.target["phone"].value,
            userName: event.target["user_name"].value,
            pin: event.target["pin"].value,
            groupName: "",
        }
        await postUser(userData);     

    } else {
        showErrorMsg();
    }
}


async function postUser(userData) {
    const postAsJson = JSON.stringify(userData);

    const response = await fetch(`${endpoint}/users/${userData.userName}.json`, {
        method: "PUT",
        body: postAsJson
    });

    if (response.ok) {
        window.location = "/login.html";
    }
}

async function isUserExist(userName) {
    const response = await fetch(`${endpoint}/users/${userName}.json`);
    const data = await response.json();

    if(data !== null) {
        return true;
    } 
    return false;
}

function createRandomPins() {
    const pins = document.querySelectorAll('[name="pin"]');

    for (let i = 0; i < pins.length; i++) {
        const pin = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        document.querySelector(`label[for="${pins[i].id}"`).innerHTML = pin; 
        pins[i].value = pin;
    }
}

function resetErrorMsg() {
    document.querySelector("#error_user_name").style.display = "none";
    document.querySelector("#error_user_name1").style.display = "none";
}

function showErrorMsg() {
    document.querySelector("#error_user_name").style.display = "block";
    document.querySelector("#error_user_name1").style.display = "block";
    document.querySelector("#user_name").focus();
}

function goToLogin() {
    window.location = "/login.html";
}