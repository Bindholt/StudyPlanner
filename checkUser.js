"use strict";

window.addEventListener("load", main);
const endpoint = "https://studyplanner-ad697-default-rtdb.europe-west1.firebasedatabase.app/"; 

let test;
async function main() {
    const userName = checkUser();

    if(!checkStudyGroup()) {
        await getStudyGroup(userName);
    };
}

function checkUser() {
    const userName = localStorage.getItem("userName");
    if(!userName || userName.length <= 0) {
        window.location = "/login.html";
        return;
    } 
    return userName;
}

function checkStudyGroup() {
    const groupName = localStorage.getItem("groupName");
    return groupName !== null && (groupName.length > 0);
}

async function getStudyGroup(userName) {
    const response = await fetch(`${endpoint}/users/${userName}/groupName.json`);
    const groupName = await response.json();
    localStorage.setItem("groupName", groupName);
}