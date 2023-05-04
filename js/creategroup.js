"use strict";
import { fetchBaas } from "./restServices.js";
import {checkUser, setStudyGroup, groupMustNotBeSet} from "./checkUser.js";

window.addEventListener("load", main);

const user = localStorage.getItem("userName");  

function main(event) {
  isGroupExist("CaMV");
  handleCheckUser();
  setEventListeners();
}

function setEventListeners() {
  document.querySelector("#create_group").addEventListener("submit", createGroup);
  document.querySelector(".back_to_main").addEventListener("mouseup", () => window.location = "/main.html");
}

function handleCheckUser() {
  checkUser();
  setStudyGroup();
  groupMustNotBeSet("/main.html");
}


async function createGroup(event) {
  event.preventDefault(); 

  if(!await isGroupExist(event.target["group_name"].value)) {
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
  } else {
    showErrorMsg("Group name already exists");
  }
}

async function isGroupExist(groupName) {
  const getGroupURL = `group/${groupName}.json`;

  const groupResponse = await fetchBaas(getGroupURL, "GET");

  if (groupResponse.ok) {
    const groupData = await groupResponse.json();
    
    if(groupData) {
      return true;
    }
    
    return false;
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

function showErrorMsg(msg) {
  document.querySelector(".error_msg").innerText = msg;
}

function goToMain() {
  window.location = "/main.html";
}