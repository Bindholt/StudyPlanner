"use strict";
import { fetchBaas } from "./restServices.js";
import {checkUser, setStudyGroup, groupMustNotBeSet} from "./checkUser.js";

window.addEventListener("load", main)

const user = localStorage.getItem("userName");  

function main() {
  handleCheckUser();
  setEventListeners();
}

function setEventListeners() {
  document.querySelector("#add_user_to_group").addEventListener("submit", addUserInG);
  document.querySelector(".back_to_main").addEventListener("mouseup", () => window.location = "/StudyPlanner/main.html");
}

function handleCheckUser() {
    checkUser();
    setStudyGroup();
    groupMustNotBeSet("/StudyPlanner/main.html");
}

async function addUserInG(event) {
  event.preventDefault();

  const inviteCode = event.target["invite_code"].value;
  const getGroupByInviteCodeURL = `inviteCodes/${inviteCode}.json`;
  const groupNameResponse = await fetchBaas(getGroupByInviteCodeURL, "GET");
  
  if(groupNameResponse.ok) {

    const group = await groupNameResponse.json();
    if (await group) {
      const memberData = {
        [user]: user
      }
      const patchMemberIntoGroupURL = `group/${group.groupName}/members.json`;
      const memberResponse = await fetchBaas(patchMemberIntoGroupURL, "PATCH", memberData);

      const groupData = {
        groupName: group.groupName
      }
      const patchGroupNameIntoMemberURL = `users/${user}.json`;
      const groupResponse = await fetchBaas(patchGroupNameIntoMemberURL, "PATCH", groupData);
    
      if (memberResponse.ok && groupResponse.ok) {
        groupJoined();
      } else {
        showErrorM("Error: Something went wrong");
        return;
      }
    }  
  } else {
    showErrorM("Invite code does not exist");
    return;
  }
}

function showErrorM(Msg) {
  document.querySelector("#error_msg").innerText = Msg;
}

async function groupJoined() {
  await setStudyGroup();
  goToMain();
}

function goToMain() {
  window.location = "/StudyPlanner/main.html";
}