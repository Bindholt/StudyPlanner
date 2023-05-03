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
    const groupResponse = await deleteGroup();

    const userResponse = await deleteGroupFromUser();

    if (groupResponse.ok && userResponse.ok) {
        window.location = "/main.html";
    } else {
        console.log("something went horribly wrong");
    }
}

async function deleteGroupFromUser() {
    const response = await fetch(`${endpoint}/users/${user}/groupName.json`, {
        method: "DELETE",
    });

    return response;
}

async function deleteGroup() {
    const response = await fetch(`${endpoint}/group/${group}/members/${user}.json`, {
        method: "DELETE",
    });

    return response;
}
