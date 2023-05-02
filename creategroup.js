"use strict";

window.addEventListener("load", main);

// const endpoint = "https://test-studygroup-default-rtdb.europe-west1.firebasedatabase.app/";
const endpoint = "https://studyplanner-ad697-default-rtdb.europe-west1.firebasedatabase.app/"; 
const user = localStorage.getItem("userName");  

function main(event) {
  console.log("Hello");

  document.querySelector("#create_group").addEventListener("submit", createGroup);

}

async function createGroup(event) {
  event.preventDefault(); 
  const inviteCode = await createInviteCode();

  if (!(await isUserGroup(event.target["group_name"].value))) {
    const userData = {
      groupName: event.target["group_name"].value,
      inviteCode: inviteCode,
      members: {[user]: user}
    };
    await postGroup(userData);
    await postInviteCode(userData);
    insertGroupNameInMember(event.target["group_name"].value)
  }
  
}

async function insertGroupNameInMember(groupName) {
  const userData = {
    groupName
  };

  const postAsJson = JSON.stringify(userData);

  const members = await fetch(`${endpoint}/users/${user}.json`, {
        method: "PATCH",
        body: postAsJson,
      });
}

async function postInviteCode(userData) {
  const postAsJson = JSON.stringify(userData);

  const response = await fetch(`${endpoint}/inviteCodes/${userData.inviteCode}.json`, {
    method: "PUT",
    body: postAsJson,
  }); 
  if (response.ok) {
    console.log("Invite codes igennem")
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
    goToMainMain();
    


    const html = /*html*/ `
<p>Group Created</p>

`;
    document.querySelector("#group_created").insertAdjacentHTML("beforeend", html);
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



async function createInviteCode() { 
  const pin = (Math.floor(Math.random() * 10000000) + 10000000).toString().substring(1);
  if (!await doesCodeExist(pin)) {
    console.log(pin);
    return pin;
  } else {
    createInviteCode();
  }
}

async function doesCodeExist(inviteCode) {

  const response = await fetch(`${endpoint}/inviteCodes/${inviteCode}.json`);
  const data = await response.json();
  
  if (data !== null) {

    return true;
  }
  return false;
}

function goToMainMain() {
  window.location = "/mainmain.html";
}