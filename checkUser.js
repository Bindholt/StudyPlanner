"use strict";

window.addEventListener("load", main);

function main() {
    const validUser = checkUser();
}

function checkUser() {
    const userName = localStorage.getItem("userName");
    if(userName && userName > 0) {
        console.log("yay")
    } else {
        console.log("nay")
    } 
}