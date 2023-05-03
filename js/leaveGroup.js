"use strict";
import { fetchBaas } from "./rest-services.js";

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
    const deleteUserFromGroupURL = `group/${group}/members/${user}.json`;
    const fromGroupResponse = await fetchBaas(deleteUserFromGroupURL, "DELETE");

    const deleteGroupFromUserURL = `users/${user}/groupName.json`;
    const fromUserResponse = await fetchBaas(deleteGroupFromUserURL, "DELETE");

    if (fromGroupResponse.ok && fromUserResponse.ok) {
        window.location = "/main.html";
    } else {
        console.log("something went horribly wrong");
    }
}