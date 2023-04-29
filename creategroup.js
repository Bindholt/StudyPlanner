"use strict";

window.addEventListener("load", main);

const endpoint = "https://test-studygroup-default-rtdb.europe-west1.firebasedatabase.app/";

function main(event) {
  console.log("Hello");

  document.querySelector("#createGroup").addEventListener("submit", createGroup);
  document.querySelector("#btn_refresh_pins").addEventListener("mouseup", createRandomPins);

  createRandomPins();
}

async function createGroup(event) {
  event.preventDefault();
  const groupCode = autoGPassword();

  if (!(await isUserGroup(event.target["group_name"].value))) {
    const userData = {
      groupName: event.target["group_name"].value,
      medlemmer: {},
      pin: event.target["pin"].value,
      groupCode: groupCode,
    };
    await postGroup(userData);
  }
}

async function postGroup(userData) {
  const postAsJson = JSON.stringify(userData);

  const response = await fetch(`${endpoint}/group/${userData.groupName}.json`, {
    method: "PUT",
    body: postAsJson,
  });

  if (response.ok) {
    console.log("Det gået igennem");

    const html = /*html*/ `
<p>Group Created</p>

`;
    document.querySelector("#groupCreated").insertAdjacentHTML("beforeend", html);
  }
}

async function isUserGroup(groupName) {
  const response = await fetch(`${endpoint}/users/${groupName}.json`);
  const data = await response.json();

  if (data !== null) {
    return true;
  }
  return false;
}

function createRandomPins() {
  const pins = document.querySelectorAll('[name="pin"]');

  for (let i = 0; i < pins.length; i++) {
    const pin = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    document.querySelector(`label[for="${pins[i].id}"`).innerHTML = pin;
    pins[i].value = pin;
  }
}

function autoGPassword() {
  let pass = "";

  let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

  for (let i = 1; i <= 10; i++) {
    let generate = Math.floor(Math.random() * str.length + 1);

    pass += str.charAt(generate);
  }
  
  return pass;
}