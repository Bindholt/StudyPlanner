"use strict";
import { getGroupNameByInviteCode, patchMemberIntoGroup, patchGroupNameIntoMember } from "./rest-services.js";

window.addEventListener("load", main)

const user = localStorage.getItem("userName");  

function main() {
  document.querySelector("#add_user_to_group").addEventListener("submit", addUserInG);
}
let test;
async function addUserInG(event) {
  event.preventDefault();

  const groupNameResponse = await getGroupNameByInviteCode(event.target["invite_code"].value);
  
  if(groupNameResponse.ok) {

    const group = await groupNameResponse.json();
    if (await group) {
      const memberData = {
        [user]: user
      }
      const memberResponse = await patchMemberIntoGroup(memberData, group.groupName);

      const groupData = {
        groupName: group.groupName
      }
      const groupResponse = await patchGroupNameIntoMember(groupData, user);
    
      if (memberResponse.ok && groupResponse.ok) {
        goToMain();
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

function goToMain() {
  window.location = "/main.html";
}