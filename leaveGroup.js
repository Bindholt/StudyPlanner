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
    const groupDelete = await fetch(`${endpoint}/group/${group}/members/${user}.json`, {
        method: "DELETE",
    });

    const userDelete = await fetch(`${endpoint}/users/${user}/groupName.json`, {
        method: "DELETE",
    });
}