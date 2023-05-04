"use strict";
import { fetchBaas } from "./restServices.js";
import {checkUser, setStudyGroup, groupMustNotBeSet} from "./checkUser.js";

window.addEventListener("load", main);

const user = localStorage.getItem("userName");  

function main(event) {
  handleCheckUser();
  document.querySelector("#create_group").addEventListener("submit", createGroup);
}

function handleCheckUser() {
  checkUser();
  setStudyGroup();
  groupMustNotBeSet("/main.html");
}


async function createGroup(event) {
  event.preventDefault(); 
  const inviteCode = await createInviteCode();

  const userData = {
    groupName: event.target["group_name"].value,
    inviteCode: inviteCode,
    members: {[user]: user}
  };

  const putGroupURL = `group/${userData.groupName}.json`;
  const groupResponse = await fetchBaas(putGroupURL, "PUT", userData);

  const putInviteCodeURL = `inviteCodes/${userData.inviteCode}.json`;
  const codeResponse = await fetchBaas(putInviteCodeURL, "PUT", userData);

  const groupNameData = {
    groupName: event.target["group_name"].value
  };

  const patchGroupNameInUserURL = `users/${user}.json`;
  const memberResponse = await fetchBaas(patchGroupNameInUserURL, "PATCH", groupNameData)

  if (groupResponse.ok && codeResponse.ok && memberResponse.ok) {
    goToMain();
  } else {
    console.log("There was an error");
  }
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
  const getInviteCodeURL = `inviteCodes/${inviteCode}.json`;
  const codeResponse = await fetchBaas(getInviteCodeURL, "GET");

  if(codeResponse.ok) {
    const data = await codeResponse.json();
  
    if (data !== null) {
  
      return true;
    }
    return false;
  }
}

function goToMain() {
  window.location = "/main.html";
}