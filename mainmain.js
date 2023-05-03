"use strict";

window.addEventListener("load", main);
const endpoint = "https://studyplanner-ad697-default-rtdb.europe-west1.firebasedatabase.app/"; 
const group = localStorage.getItem("groupName");
const memberArray = [];

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
    
    for (const member in groupData.members) {
      const memberResponse = await getMembersInformation(groupData.members[member]);
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
      <section id="members_container">
        
      </section>
  `
  document.querySelector(".group_container").insertAdjacentHTML("afterbegin", groupHTML);
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

async function getGroupInformation() {
  const response = await fetch(`${endpoint}/group/${group}.json`);

  return response;
}

async function getMembersInformation(member) {
  const response = await fetch(`${endpoint}/users/${member}.json`);

  return response;
}