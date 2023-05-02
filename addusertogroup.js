"use strict";

window.addEventListener("load", main)

// const endpoint = "https://test-studygroup-default-rtdb.europe-west1.firebasedatabase.app/";
const endpoint = "https://studyplanner-ad697-default-rtdb.europe-west1.firebasedatabase.app/"; 
const user = localStorage.getItem("userName");  

function main() {
    console.log("Det kører");

    document.querySelector("#add_user_to_group").addEventListener("submit", addUserInG);

}

async function addUserInG(event) {
  event.preventDefault();

  const groupName = await findGroupName(event.target["invite_code"].value);

  const amount = await findAmountOfGroupMembers(groupName);

  const memberResponse = await insertMemberInGroup(amount, groupName);
  const groupResponse = await insertGroupNameInMember(groupName);

  if (memberResponse.ok && groupResponse.ok) {
    goToMainMain();
  } else {
    console.log("Error something went wrong");
  }
}

async function insertMemberInGroup(amount, groupName) {
        const userData = {
            [user]: user
        }
        
        const postAsJson = JSON.stringify(userData);
        console.log(postAsJson);
      
      const response = await fetch(`${endpoint}/group/${groupName}/members.json`, {
        method: "PATCH",
        body: postAsJson,
      });
      
      return response;
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

async function findGroupName(inviteCode) {
     const response = await fetch(`${endpoint}/inviteCodes/${inviteCode}.json`);
     const data = await response.json();

     if (data !== null) {
        return data.groupName
     } else {
        return showErrorM();
     }
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

function showErrorM() {
    console.log("Error");
}

function goToMainMain() {
  window.location = "/mainmain.html";
}