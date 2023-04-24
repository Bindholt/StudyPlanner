"use strict";

const endpoint = ""; //se REST-projekt -> app.js filen for endpoint struktur.

window.addEventListener("load", main);

function main(event) {
    document.querySelector("#signup").addEventListener("submit", createUser);
}

function createUser(event) {
    event.preventDefault();
    console.log(event.target["email"].value);
}