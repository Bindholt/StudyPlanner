"use strict";

window.addEventListener("load", main);

function main() {
    const validUser = checkUser();
}

function checkUser() {
    const userName = localStorage.getItem("userName");
    if(!userName || userName.length <= 0) {
        window.location = "/login.html";
    }
}