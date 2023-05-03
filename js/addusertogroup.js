"use strict";
import { getGroupNameByInviteCode } from "./rest-services.json";

window.addEventListener("load", main)

// const endpoint = "https://test-studygroup-default-rtdb.europe-west1.firebasedatabase.app/";
const endpoint = "https://studyplanner-ad697-default-rtdb.europe-west1.firebasedatabase.app/"; 
const user = localStorage.getItem("userName");  

function main() {
  document.querySelector("#add_user_to_group").addEventListener("submit", addUserInG);
}

async function addUserInG(event) {
  event.preventDefault();

  const groupNameResponse = await get(event.target["invite_code"].value);
  
  if(groupNameResponse.ok) {
    const groupName = await groupNameResponse.json();
    if (await groupName) {
      const memberData = {
        [user]: user
      }
      const memberResponse = await patchMemberIntoGroup(memberData, groupName);
      const groupResponse = await insertGroupNameInMember(groupName);
    
      if (memberResponse.ok && groupResponse.ok) {
        goToMain();
      } else {
        console.log("Error something went wrong");
        return;
      }
    }  
  } else {
    showErrorM("Invite code does not exist");
    return;
  }
}

async function insertGroupNameInMember(groupName) {
  const userData = {
    groupName,
  };

  const postAsJson = JSON.stringify(userData);

  const response = await fetch(`${endpoint}/users/${user}.json`, {
    method: "PATCH",
    body: postAsJson,
  });

  return response;
}


async function findAmountOfGroupMembers(groupName) {
  const members = await fetch(`${endpoint}/group/${groupName}/members.json`);
  const membersObject = await members.json(); 

  let i = 0;
  for (let member in membersObject) {
    i++;
  }

  console.log(i);

  return i;
}

function showErrorM(Msg) {
  document.querySelector("#error_msg").innerText = Msg;
}

function goToMain() {
  window.location = "/main.html";
}