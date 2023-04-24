"use strict";

window.addEventListener("load", main);

function main(event) {
    document.querySelector("h1").innerText = `Welcome ${localStorage.getItem("userName")}!`
}