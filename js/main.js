"use strict";

import { fetchBaas } from "./rest-services.js";

window.addEventListener("load", main);
const endpoint = "https://studyplanner-ad697-default-rtdb.europe-west1.firebasedatabase.app/"; 
const group = localStorage.getItem("groupName");
let memberArray = [];

async function main() {
  setUserNameHTML();
  setEventListeners();
  
  if(group && group.length > 0) {
    console.log("here");
    handleGroupHTML();
    hasGroupHideLinks();
  } else {
    noGroupHideLinks();
  }
}

function hasGroupHideLinks() {
  document.querySelector("#add_user_to_group").style.display = "none";
  document.querySelector("#create_group").style.display = "none";
}

function noGroupHideLinks() {
  document.querySelector("#calendar").style.display = "none";
  document.querySelector("#chat").style.display = "none";
  document.querySelector("#leave_group").style.display = "none";
  document.querySelector(".group_container").style.display = "none";
  
}

function setUserNameHTML() {
  document.querySelector("#user_name").innerText = localStorage.getItem("userName");
}

function setEventListeners() {
  document.querySelector("#create_group").addEventListener("mouseup", () => window.location = "createGroup.html");
  document.querySelector("#add_user_to_group").addEventListener("mouseup", () => window.location = "addUserToGroup.html");
  document.querySelector("#calendar").addEventListener("mouseup", () => window.location = "calendar.html");
  document.querySelector("#chat").addEventListener("mouseup", () => window.location = "chat.html");
  document.querySelector("#leave_group").addEventListener("mouseup", () => window.location = "leaveGroup.html");
  document.querySelector("#change_user").addEventListener("mouseup", logout);
}

async function handleGroupHTML() {
  const getGroupURL = `group/${group}.json`;
  const groupResponse = await fetchBaas(getGroupURL, "GET");

  if (groupResponse.ok) {
    const groupData = await groupResponse.json();
    setGroupHTML(groupData);
    
    for (const member in groupData.members) {
      const getMemberURL = `users/${member}.json`;
      const memberResponse = await fetchBaas(getMemberURL, "GET");

      if (memberResponse.ok) {
        const memberData = await memberResponse.json();
        memberArray.push(memberData);
        setMemberHTML(memberData);
      }
    }
  }
}

function setGroupHTML(groupData) {
  const groupHTML = /* html */ `
      <h2>Group: ${groupData.groupName}</h2>
      <h3>Invite code: ${groupData.inviteCode}</h3>
      <label for="sort">Sort by</label>
      <select id="sort" name="sort">
        <option value=""></option>
        <option value="first_name">First Name</option>
        <option value="last_name">Last Name</option>
      </select>
      <section id="members_container">

      </section>
  `
  document.querySelector(".group_container").insertAdjacentHTML("afterbegin", groupHTML);
  document.querySelector("#sort").addEventListener("change", event => sortMembers(event));
}

function sortMembers(event) {
  switch (event.target.value) {
    case "first_name":
      memberArray = memberArray.sort((a,b) => a.fullName.split(" ")[0].localeCompare(b.fullName.split(" ")[0]));
      break;
    case "last_name":
      memberArray = memberArray.sort((a,b) =>  a.fullName.split(" ")[a.fullName.split(" ").length -1].localeCompare(b.fullName.split(" ")[b.fullName.split(" ").length -1]));
      break;
    default:
      return;
  }

  document.querySelector("#members_container").innerHTML = "";
  for (const member in memberArray) {
    setMemberHTML(memberArray[member]);
  }


}

function setMemberHTML(member) {  
  const memberHTML = /* html */ `
    <div class="member_container">
      <div>${member.fullName}</div>
      <div>${member.phone}</div>
      <div>${member.email}</div>
    </div>  
  `
  document.querySelector("#members_container").insertAdjacentHTML("beforeend", memberHTML)
}

function logout() {
  localStorage.removeItem("userName");
  localStorage.removeItem("groupName");
  
  window.location = "/login.html";
}