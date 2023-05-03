"use strict";

window.addEventListener("load", main);

const endpoint =
  "https://studyplanerchat-default-rtdb.europe-west1.firebasedatabase.app/";

const time = new Date().toISOString();
const user = localStorage.getItem("userName");
const group = localStorage.getItem("groupName");
let searchChatArr = [];

async function main() {
  updateChat();
  checkChatAge();
  createHtmlChat();
  setEventListeners();
  insertSearchInput();

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

  document.querySelector("#input_search").addEventListener("input", () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const matchingChats = searchChatArr.filter((chat) =>
      chat.text.toLowerCase().includes(searchTerm)
    );
    showSearchChat(matchingChats);
  });
}

function prepareData(dataObject) {
  const chatArr = [];
  searchChatArr = [];
  for (const key in dataObject) {
    const chat = dataObject[key];
    chat.id = key;
    chatArr.push(chat);
    searchChatArr.push(chat);
  }
  return chatArr;
}

function showChats(data) {
  data.forEach(showSingleChat);
}

function showSingleChat(chat) {
  const chatHTML = /*HTML*/ `
    <div class="chat_message">
    <span class="username">${chat.userName}</span>
    <span class="timestamp">${chat.time}</span>
    <p>${chat.text}</p>
    </div>
  `;
  document
    .querySelector(".chat_container")
    .insertAdjacentHTML("afterBegin", chatHTML);
}

async function createChat(text, time, userName) {
  if (text.length > 0) {
    const newChat = { text, time, userName };
    const chatAsJson = JSON.stringify(newChat);

    const res = await fetch(`${endpoint}/chat/${group}.json`, {
      method: "POST",
      body: chatAsJson,
    });
    const data = await res.json();
    return data;
  }
}

async function deletePost(id) {
  const url = `${endpoint}/chat/${group}/${id}.json`;
  const res = await fetch(url, { method: "DELETE" });
  console.log(res);

  if (res.ok) {
    console.log("Post successfully Deleted in Firebase");
  }
}

async function checkChatAge() {
  const chats = await getData(`${endpoint}/chat/${group}.json`);

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
<input type="text" id="chat_input" placeholder="Type here"size="40">
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

async function updateChat() {
  const chats = await getData(`${endpoint}/chat/${group}.json`);
  document.querySelector(".chat_container").innerHTML = "";
  showChats(chats);
}

function clearInput() {
  document.querySelector("#chat_input").value = "";
  document.querySelector("#chat_input").focus();
}

function insertSearchInput() {
  const html = /*html*/ `
    <input type="search" id="input_search" placeholder="search after text message" >
  `;
  document
    .querySelector(".search_chat_container")
    .insertAdjacentHTML("beforeend", html);
}


function showSearchChat(searchChatArr) {
  const chatContainer = document.querySelector(".search_chat");
  chatContainer.innerHTML = "";
  if (document.querySelector("#input_search").value.length > 0) {
    for (const chat in searchChatArr) {
      const html = /*html*/ `
        <div class="chat_output">${searchChatArr[chat].text} <span>${searchChatArr[chat].time}</span> 
      `;
      chatContainer.insertAdjacentHTML("afterbegin", html);
    }
  }
}
