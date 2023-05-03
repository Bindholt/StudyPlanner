"use strict";

const endpoint = "https://studyplanner-ad697-default-rtdb.europe-west1.firebasedatabase.app/"; 

async function getGroupNameByInviteCode(inviteCode) {
    const response = await fetch(`${endpoint}/inviteCodes/${inviteCode}.json`);

    return response;
}

async function patchMemberIntoGroup(userData, groupName) {
      const postAsJson = JSON.stringify(userData);
      
      const response = await fetch(`${endpoint}/group/${groupName}/members.json`, {
        method: "PATCH",
        body: postAsJson,
      });
      
      return response;
}

export {getGroupNameByInviteCode, patchMemberIntoGroup};