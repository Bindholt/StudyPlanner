"use strict";
import { fetchBaas } from "./restServices.js";
import {checkUser, setStudyGroup, groupMustBeSet} from "./checkUser.js";
window.addEventListener("load", main);

const time = new Date().toISOString();
const user = localStorage.getItem("userName");
const group = localStorage.getItem("groupName");
let searchChatArr = [];

async function main() {
  handleCheckUser();
  updateChat();
  checkChatAge();
  createChatHTML();
  createSearchHTML();
  setEventListeners();
  setInterval(updateChat, 1000);
}

function handleCheckUser() {
  checkUser();
  setStudyGroup();
  groupMustBeSet("/main.html");
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

  const searchInput = document.querySelector("#input_search")
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
    const chatData = { text, time, userName };
    const postChatURL = `chat/${group}.json`;
    const chatResponse = await fetchBaas(postChatURL, "POST", chatData);

    if (chatResponse.ok) {
      const data = await chatResponse.json();
      return data;
    }
  }
}

async function deletePost(id) {
  const deleteChatByIdURL = `chat/${group}/${id}.json`;
  const res = await fetchBaas(deleteChatByIdURL, "DELETE");

  if (res.ok) {
    console.log("Post successfully Deleted in Firebase");
  }
}

async function checkChatAge() {
  const getGroupChatURL = `chat/${group}.json`;
  const chatResponse = await fetchBaas(getGroupChatURL, "GET");
  
  if(chatResponse.ok) {
    const chatData = await chatResponse.json();
    const chats = prepareData(chatData);

    for (const chat of chats) {
      const currentTime = Date.now();
      const chatAge = currentTime - new Date(chat.time).getTime();

      if (chatAge > 1000 * 60 * 60) {
        deletePost(chat.id);
      }
    }
  }
}

function createChatHTML() {
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
  const getGroupChatURL = `chat/${group}.json`;
  const chatResponse = await fetchBaas(getGroupChatURL, "GET");

  if(chatResponse.ok) {
    const chatData = await chatResponse.json();
    const chats = prepareData(chatData);

    document.querySelector(".chat_container").innerHTML = "";
    
    showChats(chats);
  }
  
}

function clearInput() {
  document.querySelector("#chat_input").value = "";
  document.querySelector("#chat_input").focus();
}

function createSearchHTML() {
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
        <div class="chat_output">${searchChatArr[chat].text} <span>${searchChatArr[chat].time} ${searchChatArr[chat].userName}</span> </div>
      `;
      chatContainer.insertAdjacentHTML("afterbegin", html);
    }
  }
}
