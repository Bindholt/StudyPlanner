"use strict";

const endpoint = "https://studyplanner-ad697-default-rtdb.europe-west1.firebasedatabase.app/";

window.addEventListener("load", main);

function main() {
    document.querySelector("#sign_in").addEventListener("submit", login);
    document.querySelector("#btn_go_to_create").addEventListener("mouseup", goToCreate);
}

async function login(event) {
    event.preventDefault();
    const userName = document.querySelector("#user_name").value;

    const response = await fetch(`${endpoint}/users/${userName}.json`);

    const userData = await response.json();

    if (await userData) {
        if(response.ok && await validPin(userData.pin)) { 
            await setLocalStorage(userData);
            window.location = "/main.html";
        } else {
            showErrorMsgPin();
        }
    } else {
        showErrorMsgUser();
    }
    
    
}

async function validPin(fetchedPin) {
    const pin = document.querySelector("#pin").value;

    return pin === fetchedPin;
}

async function setLocalStorage(userData) {
    if(userData.userName) {
        localStorage.setItem("userName", userData.userName);
    }
    if(userData.groupName) {
        localStorage.setItem("groupName", userData.groupName);
    }
}

function goToCreate() {
    window.location = "/create.html";
}

function showErrorMsgPin() {
    resetErrorMsg();
    document.querySelector("#error_pin").style.display = "block";
    document.querySelector("#error_pin1").style.display = "block";
    document.querySelector("#pin").focus();
}

function showErrorMsgUser() {
    resetErrorMsg();
    document.querySelector("#error_user").style.display = "block";
    document.querySelector("#error_user1").style.display = "block";
    document.querySelector("#pin").focus();
}

function resetErrorMsg() {
    document.querySelector("#error_user").style.display = "none";
    document.querySelector("#error_user1").style.display = "none";
    document.querySelector("#error_pin").style.display = "none";
    document.querySelector("#error_pin1").style.display = "none";
}