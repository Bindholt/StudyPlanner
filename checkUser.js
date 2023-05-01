"use strict";

window.addEventListener("load", main);
const endpoint = "https://studyplanner-ad697-default-rtdb.europe-west1.firebasedatabase.app/"; 

async function main() {
    const userName = checkUser();

    const group = await getStudyGroup(userName);
}

function checkUser() {
    const userName = localStorage.getItem("userName");
    if(!userName || userName.length <= 0) {
        window.location = "/login.html";
        return;
    } 
    return userName;
}

async function getStudyGroup(userName) {
    const response = await fetch(`${endpoint}/group/CMV?/`)
}