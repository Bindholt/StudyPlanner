"use strict";
import { fetchBaas } from "./restServices.js";
import {checkUser, setStudyGroup, groupMustNotBeSet} from "./checkUser.js";

window.addEventListener("load", main);

function main(event) {
    unsetLocalStorage();
    setEventListeners();
    createRandomPins();
}

function unsetLocalStorage() {
    localStorage.removeItem("userName");
    localStorage.removeItem("groupName");
}

function setEventListeners() {
    document.querySelector("#sign_up").addEventListener("submit", createUser);
    document.querySelector("#btn_refresh_pins").addEventListener("mouseup", createRandomPins);
    document.querySelector("#btn_go_to_login").addEventListener("mouseup", goToLogin);
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
        const putUserURL = `users/${userData.userName}.json`
        
        const userResponse = await fetchBaas(putUserURL, "PUT", userData);
        
        if(userResponse.ok) {
            window.location = "/login.html";
        }  
    } else {
        showErrorMsg();
    }
}

async function isUserExist(userName) {
    const getUserURL = `users/${userName}.json`;

    const userResponse = await fetchBaas(getUserURL, "GET");

    if(userResponse.ok) {
        const data = await userResponse.json();

        if(data !== null) {
            return true;
        } 
        return false;
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