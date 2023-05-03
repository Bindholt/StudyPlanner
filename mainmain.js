"use strict";

window.addEventListener("load", main);
const endpoint = "https://studyplanner-ad697-default-rtdb.europe-west1.firebasedatabase.app/"; 
const group = localStorage.getItem("groupName");

async function main() {
  setEventListeners();
  if(group && group.length > 0) {
    handleGroupHTML();
  } else {

  }
}

function setEventListeners() {
  document.querySelector("#create_group").addEventListener("mouseup", () => window.location = "createGroup.html");
  document.querySelector("#add_user_to_group").addEventListener("mouseup", () => window.location = "addUserToGroup.html");
  document.querySelector("#calendar").addEventListener("mouseup", () => window.location = "calendar.html");
  document.querySelector("#chat").addEventListener("mouseup", () => window.location = "chat.html");
  document.querySelector("#leave_group").addEventListener("mouseup", () => window.location = "leaveGroup.html");
}
let test;
async function handleGroupHTML() {
  const groupResponse = await getGroupInformation();

  if (groupResponse.ok) {
    const groupData = await groupResponse.json();
    test = groupData;
    setGroupHTML(groupData);
  }
}

function setGroupHTML(groupData) {
  const groupHTML = /* html */ `
      <div>Group: ${groupData.groupName}</div>
      <div>Invite code: ${groupData.inviteCode}</div>
      <section>
        
      </section>
  `
  document.querySelector(".group_container").insertAdjacentHTML("afterbegin", groupHTML);
}

async function getGroupInformation() {
  const response = await fetch(`${endpoint}/group/${group}.json`);

  return response;
}