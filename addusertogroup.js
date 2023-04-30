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



function createRandomPins() {
  const pins = document.querySelectorAll('[name="pin"]');

  for (let i = 0; i < pins.length; i++) {
    const pin = (Math.floor(Math.random() * 10000000) + 10000000).toString().substring(1);
    document.querySelector(`label[for="${pins[i].id}"`).innerHTML = pin;
    pins[i].value = pin;
  }
}
