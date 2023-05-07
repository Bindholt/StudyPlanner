"use strict";
import { fetchBaas } from "./restServices.js";

window.addEventListener("load", main);

function main() {
    unsetLocalStorage();
    setEventListeners();
}

function unsetLocalStorage() {
    localStorage.removeItem("userName");
    localStorage.removeItem("groupName");
}

function setEventListeners() {
    document.querySelector("#sign_in").addEventListener("submit", login);
    document.querySelector("#btn_go_to_create").addEventListener("mouseup", goToCreate);
}

async function login(event) {
    event.preventDefault();
    const userName = document.querySelector("#user_name").value;

    const getUserURL = `users/${userName}.json`;
    const userResponse = await fetchBaas(getUserURL, "GET");

    if (userResponse.ok) {
        const userData = await userResponse.json();

        if (await userData) {
            if(await validPin(userData.pin)) { 
                await setLocalStorage(userData);
                window.location = "/StudyPlanner/main.html";
            } else {
                showErrorMsgPin();
            }
        } else {
            showErrorMsgUser();
        }
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
    window.location = "/StudyPlanner/create.html";
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