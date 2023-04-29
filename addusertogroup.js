"use strict";

window.addEventListener("load", main)

const displaypasswordHtml = document.getElementById("password_generated");

function main() {
    console.log("Det kører");

    document.querySelector("#auto_password").addEventListener("click", displayPassword);

}


function autoGPassword() {
    let pass = ""

    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +'abcdefghijklmnopqrstuvwxyz0123456789@#$';

    for (let i = 1; i <= 10; i++) {
        let generate = Math.floor(Math.random() * str.length + 1 );

        pass+= str.charAt(generate)
    }
    console.log(pass);
    return pass;
    
}

const displayPassword = () => {
    displaypasswordHtml.innerHTML = autoGPassword();
}

