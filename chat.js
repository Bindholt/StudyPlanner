"use strict";

window.addEventListener("load", main);

const endpoint =
  "https://studyplanerchat-default-rtdb.europe-west1.firebasedatabase.app/";

const time = new Date().toISOString();
const user = localStorage.getItem("userName");

async function main() {
  console.log("JSvirker");
  createHtml();
  await updateChatGrid();
  checkChatAge();
  createHtmlChat();
  setEventListeners();
  setInterval(updateChat, 1000);
}

async function getData(url) {
  const response = await fetch(url);
  const data = await response.json();
  const chats = prepareData(data);

  return chats;
}

function setEventListeners() {
  document
    .querySelector("#btn_submit")
    .addEventListener("mouseup", btnSubmitEvent);

  document
    .querySelector("#chat_input")
    .addEventListener("keydown", function (event) {
      if (event.keyCode === 13) {
        EnterSubmitEvent();
      }
    });
}

function prepareData(dataObject) {
  const chatArr = [];
  for (const key in dataObject) {
    const chat = dataObject[key];
    chat.id = key;
    chatArr.push(chat);
  }
  return chatArr;
}

function createHtml() {
  const myHTML = /*HTMl*/ `
    <h1>test</h1>
  `;
  document.querySelector("body").insertAdjacentHTML("beforeend", myHTML);
}

async function updateChatGrid() {
  const chats = await getData(`${endpoint}/chat.json`);
  showChats(chats);
}

function showChats(data) {
  data.forEach(showSingleChat);
}

function showSingleChat(chat) {
  const chatHTML = /*HTML*/ `
    <div class="chat_message">
      <p>${chat.text}</p>
      <p class="timestamp">${chat.time}</p>
      <p class="username">${chat.userName}</p>
    </div>
  `;
  document
    .querySelector(".chat_container")
    .insertAdjacentHTML("beforeend", chatHTML);
}

async function createChat(text, time, userName) {
  const newChat = { text, time, userName };
  const chatAsJson = JSON.stringify(newChat);

  const res = await fetch(`${endpoint}/chat.json`, {
    method: "POST",
    body: chatAsJson,
  });
  const data = await res.json();
  return data;
}

async function deletePost(id) {
  const url = `${endpoint}/chat/${id}.json`;
  const res = await fetch(url, { method: "DELETE" });
  console.log(res);

  if (res.ok) {
    console.log("Post succesfully Deleted in Firebase");
    updateChatGrid();
  }
}

async function checkChatAge() {
  const chats = await getData(`${endpoint}/chat.json`);

  for (const chat of chats) {
    const currentTime = Date.now();
    const chatAge = currentTime - new Date(chat.time).getTime();

    if (chatAge > 1000 * 60 * 60) {
      deletePost(chat.id);
    }
  }
}

function createHtmlChat() {
  const ChatInputHTML = /*html*/ `
<h2>chat</h2>
<input type="text" id="chat_input">
<button id='btn_submit'>submit</button>
`;
  document.querySelector("body").insertAdjacentHTML("beforeend", ChatInputHTML);
}

function btnSubmitEvent(event) {
  event.preventDefault();
  const chatTextInput = document.querySelector("#chat_input").value;
  createChat(chatTextInput, time, user);
  clearInput();
}
function EnterSubmitEvent(event) {
  const chatTextInput = document.querySelector("#chat_input").value;
  createChat(chatTextInput, time, user);
  clearInput();
}

function updateChat() {
  getData(`${endpoint}/chat.json`).then(function (chats) {
    document.querySelector(".chat_container").innerHTML = "";
    showChats(chats);
  });
}

function clearInput() {
  document.querySelector("#chat_input").value = "";
  document.querySelector("#chat_input").focus();
}
