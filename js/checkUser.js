"use strict";
import { fetchBaas } from "./restServices.js";

function groupMustBeSet(redirect) {
    const groupName = localStorage.getItem("groupName");
    if(!groupName || groupName.length <= 0) {
        window.location = redirect;
        return;
    } 
}

function groupMustNotBeSet(redirect) {
    const groupName = localStorage.getItem("groupName");
    if(groupName.length > 0) {
        window.location = redirect;
        return;
    } 
}

function checkUser() {
    const userName = localStorage.getItem("userName");
    if(!userName || userName.length <= 0) {
        window.location = "/login.html";
        return;
    } 
    return userName;
}

async function setStudyGroup() {
    const userName = localStorage.getItem("userName");
    const getStudyGroupURL = `users/${userName}/groupName.json`;
    const groupResponse = await fetchBaas(getStudyGroupURL, "GET");

    if(groupResponse.ok) {
        const groupName = await groupResponse.json();

        (groupName) ? localStorage.setItem("groupName", groupName) : localStorage.setItem("groupName", "");
    }
}

export {checkUser, setStudyGroup, groupMustBeSet, groupMustNotBeSet}