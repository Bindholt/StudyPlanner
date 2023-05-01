"use strict";

const endpoint = "https://studyplanner-ad697-default-rtdb.europe-west1.firebasedatabase.app/"; 

window.addEventListener("load", main);
const user = localStorage.getItem("userName");
const group = localStorage.getItem("groupName");

async function main() {
    setGroupNameHTML();
    setEventListener();
}

function setGroupNameHTML() {
    document.querySelector("h1").innerHTML = group;
}

function setEventListener() {
    document.querySelector("#btn_leave").addEventListener("mouseup", leaveGroup);
}

async function leaveGroup() {
    const groupFetch = await fetch(`${endpoint}/group/${group}/members/2.json`);
    console.log(groupFetch.json());
}