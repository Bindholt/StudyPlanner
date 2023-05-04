"use strict";
import { fetchBaas } from "./restServices.js";
import {checkUser, setStudyGroup, groupMustBeSet} from "./checkUser.js";
window.addEventListener("load", main);

const endpoint = "https://studyplanner-ad697-default-rtdb.europe-west1.firebasedatabase.app/"; 
let month = new Date().getMonth() + 1;
let year = new Date().getFullYear();
const groupName = (localStorage.getItem("groupName").length > 0 ? localStorage.getItem("groupName") : "testGroup")

async function main(event) {
    handleCheckUser(); 
    setEventListeners();
    document.querySelector("h1").innerText = groupName;
    const monthlyEvents = await getMonthlyEvents();
    const daysArray = getDaysOfMonth();
    setDaysHTML(daysArray, ((monthlyEvents) ? monthlyEvents : "") );

    setYearMonthHTML();

    setDialogHTML();
}

function handleCheckUser() {
    checkUser();
    setStudyGroup();
    groupMustBeSet("/main.html");
}

function setDaysHTML(daysArray, monthlyEvents) {    
    document.querySelector("#days").innerHTML = "";
    console.log(daysArray);

    for (let i = 0; i < daysArray.length; i++) {
        let listHTML;
        if (monthlyEvents[daysArray[i]]) {
            listHTML = /* html */ `
                <li id=${"day" + i}><span class="active">${daysArray[i]}</span></li>
            `
        } else {
            listHTML = /* html */ `
                <li id=${"day" + i}>${daysArray[i]}</li>
            `
        }
        
        document.querySelector("#days").insertAdjacentHTML("beforeend", listHTML);
        document.querySelector("#day" + i).addEventListener("mouseup", () => dialogOpen(daysArray[i]));
    }
}

function setYearMonthHTML() {
    const monthName = new Date(0, month - 1).toLocaleString('default', { month: 'long' });
    document.querySelector("#year_month").innerHTML = /* html */ `
        <div>${monthName}</div>
        <div>${year}</div>
    `;
}

function getDaysOfMonth() {
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysArray = [];

    for (let i = 1; i <= daysInMonth; i++) {
        daysArray.push(i);
    }

    return daysArray;
}

function getCurrentDate() {
    const date = new Date();
    const ISODateString = date.toISOString();
    const year = ISODateString.slice(0, 4);
    const month = ISODateString.slice(5, 7);
    const day = ISODateString.slice(8, 10);
    const hours = ISODateString.slice(11, 13);
    const minutes = ISODateString.slice(14, 16);
    const seconds = ISODateString.slice(17, 19);
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    
    return formattedDate;
}

function setEventListeners() {
    document.querySelector("#prev").addEventListener("mouseup", decrementMonth);
    document.querySelector("#next").addEventListener("mouseup", incrementMonth);
    document.querySelector("#event_from").addEventListener("change", setUntilDateSelectHTML);
    document.querySelector("#date_form").addEventListener("submit", postEvent);
}

async function incrementMonth() {
    if (month === 12) {
        month = 1;
        year++;
    } else {
        month++;
    }
    setYearMonthHTML();
    
    const monthlyEvents = await getMonthlyEvents();
    const daysArray = getDaysOfMonth();
    setDaysHTML(daysArray, (monthlyEvents === null ? [] : monthlyEvents))
}

async function decrementMonth() {
    if (month === 1) {
        month = 12;
        year--;
    } else {
        month--;
    }
    setYearMonthHTML();

    const monthlyEvents = await getMonthlyEvents();
    const daysArray = getDaysOfMonth();
    setDaysHTML(daysArray, (monthlyEvents === null ? [] : monthlyEvents))
}

async function dialogOpen(day) {
    resetDialog();
    document.querySelector("#date_header").innerHTML = `${day}/${month}/${year}`;

    const getDailyEventsURL = `events/${groupName}/${year}/${month}/${day}.json`;
    const eventsResponse = await fetchBaas(getDailyEventsURL, "GET");

    if(eventsResponse.ok) {
        const events = await eventsResponse.json();
        if (events) {
            setExistingDateHTML(events);
        }
        document.querySelector("#dialog_day").showModal();
    }
}

function setDialogHTML() {
    document.querySelector("#event_until").disabled = true;
    for (let hour = 8; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const padHour = hour.toString().padStart(2, '0');
            const padMinute = minute.toString().padStart(2, '0');
            const time = `${padHour}:${padMinute}`;
            const selectHTML = /* html */ `
                <option value="${padHour + ":" + padMinute}">${time}</option>
            `
            document.querySelector("#event_from").insertAdjacentHTML("beforeend", selectHTML);
        }
    }
}

function setUntilDateSelectHTML() {
    const fromTime = document.querySelector("#event_from").value;
    const select = document.querySelector("#event_until");

    if (fromTime.length > 0) {
        select.disabled = false;
        select.innerHTML = "";
        select.insertAdjacentHTML("afterbegin", "<option></option>");

        let hour = Number(fromTime.substring(0, fromTime.indexOf(":")));
        let minute = Number(fromTime.substring(fromTime.indexOf(":") +1, fromTime.length)) + 15;

        for (hour; hour < 24; hour++) {
            for (minute; minute < 60; minute += 15) {
                const padHour = hour.toString().padStart(2, '0');
                const padMinute = minute.toString().padStart(2, '0');
                const time = `${padHour}:${padMinute}`;
                const selectHTML = /* html */ `
                    <option value="${padHour + ":" + padMinute}">${time}</option>
                `
                select.insertAdjacentHTML("beforeend", selectHTML);
            }
            minute = 0;
        }
    } else {
        select.disabled = true;
    }
}

async function getMonthlyEvents() {
    const getMonthlyEventsURL = `events/${groupName}/${year}/${month}.json`;
    const eventsResponse = await fetchBaas(getMonthlyEventsURL, "GET");

    if (eventsResponse.ok) {
        const monthlyEvents = await eventsResponse.json();
        return monthlyEvents;
    } else {
        console.log("Somethings wrong. CALL IT!");
        return "";
    }
}

function setExistingDateHTML(dailyEvents) {
    for (let event in dailyEvents) {
        document.querySelector("#existing_dates").style.display = "grid";
        const myHTML = /* html */ `
                <div>${dailyEvents[event]["fromTime"]}${(dailyEvents[event]["untilTime"]) ? " - " + dailyEvents[event]["untilTime"] : "" }</div>
                <div>${dailyEvents[event]["description"]}</div>
                <div></div>
                <div><input type="button" id="update_${dailyEvents[event]["fromTime"]}" value="Opdatér aftale"> <input type="button" id="delete_${dailyEvents[event]["fromTime"]}" value="Slet aftale"></div>
            `
        document.querySelector("#existing_dates").insertAdjacentHTML("beforeend", myHTML);
        document.querySelector(`#delete_${dailyEvents[event]["fromTime"].replace(":", "\\:")}`).addEventListener("mouseup", deleteEvent);
        document.querySelector(`#update_${dailyEvents[event]["fromTime"].replace(":", "\\:")}`).addEventListener("mouseup", function() {
            editEvent(dailyEvents[event]["fromTime"], dailyEvents[event]["untilTime"], dailyEvents[event]["description"])
        });
        
    }
}

function resetDialog() {
    const dateForm = document.querySelector("#date_form");
    const fieldset = dateForm.querySelector("fieldset");
    const defaultHTML = /* html */ `
        <h4>Tidspunkt</h4>
        <h4>Beskrivelse</h4>
    `
    const existingDates = document.querySelector("#existing_dates");
    existingDates.innerHTML = defaultHTML;
    existingDates.style.display = "none";
    
    fieldset.querySelector("#error_exists").style.display = "none";
    fieldset.querySelector("#error_missing_time").style.display = "none";
    fieldset.querySelector("#study_date_description").value = "";
     
    const fromSelect = fieldset.querySelector("#event_from") 
    const untilSelect = fieldset.querySelector("#event_until")
    fromSelect.value = "";
    fromSelect.disabled = false;
    untilSelect.value = "";

    dateForm.removeEventListener("submit", postEvent);
    dateForm.removeEventListener("submit", updateEvent);
    dateForm.addEventListener("submit", postEvent);
    
    fieldset.querySelector("legend").innerText = "Opret ny begivenhed";
    fieldset.querySelector("#submit_btn").value = "Opret aftale";
    fieldset.querySelector("#reset_btn").disabled = false;
}

async function isEventExist(day, fromTime) {
    const getEventURL = `events/${groupName}/${year}/${month}/${day}/${fromTime}.json`;

    const response = await fetchBaas(getEventURL, "GET");
    const data = await response.json();

    if(data !== null) {
        showErrorMsgExists();
        return true;
    } 
    return false;
}

function validForm(){
    const returnVal = document.querySelector("#event_from").value !== "";
    
    if(!returnVal) {
        showErrorMsgForm();
    }

    return returnVal;
}

function showErrorMsgExists() {
    document.querySelector("#error_missing_time").style.display = "none";
    document.querySelector("#error_exists").style.display = "block";
}

function showErrorMsgForm() {
    document.querySelector("#error_exists").style.display = "none";
    document.querySelector("#error_missing_time").style.display = "block";
}


async function editEvent(fromTime, untilTime, description) {
    const form = document.querySelector("#date_form");
    const fieldset = form.querySelector("fieldset");
    const fromSelect = fieldset.querySelector("#event_from");
    const untilSelect = fieldset.querySelector("#event_until");
    const descriptionTextArea = fieldset.querySelector("#study_date_description");

    fieldset.querySelector("legend").innerText = "Opdatér begivenhed " + fromTime;
    fieldset.querySelector("#submit_btn").value = "Opdatér aftale";
    fieldset.querySelector("#reset_btn").disabled = true;
    fromSelect.disabled = true;
    fromSelect.value = fromTime;
    setUntilDateSelectHTML();
    untilSelect.value = untilTime;
    descriptionTextArea.value = description;
    document.querySelector("#date_form").removeEventListener("submit", postEvent);
    document.querySelector("#date_form").addEventListener("submit", updateEvent);
}

async function updateEvent(event) {
    event.preventDefault();
    const formDate = document.querySelector("#date_header").innerText;
    const day = formDate.substring(0, formDate.indexOf("/"));
    
    const eventData = {
        fromTime: event.target["event_from"].value,
        untilTime: event.target["event_until"].value,
        description: event.target["study_date_description"].value,
    }

    const patchEventURL = `events/${groupName}/${year}/${month}/${day}/${event.target["event_from"].value}.json`;

    const eventResponse = await fetchBaas(patchEventURL, "PATCH", eventData);

    if (eventResponse.ok) {
        window.location = window.location;
    }
}

async function postEvent(event) {
    event.preventDefault();
    const formDate = document.querySelector("#date_header").innerText;
    const day = formDate.substring(0, formDate.indexOf("/"));
    if(validForm() && !await isEventExist(day, event.target["event_from"].value)) {
        const eventData = {
            group: groupName,
            fromTime: event.target["event_from"].value,
            untilTime: event.target["event_until"].value,
            description: event.target["study_date_description"].value,
        }
        const putEventURL = `events/${eventData.group}/${year}/${month}/${day}/${event.target["event_from"].value}.json`;

        const eventResponse = await fetchBaas(putEventURL, "PUT", eventData)

        if (eventResponse.ok) {
            window.location = window.location;
        }
    }
}

async function deleteEvent(event) {
    const formDate = document.querySelector("#date_header").innerText;
    const day = formDate.substring(0, formDate.indexOf("/"));
    const id = event.target.id;
    const time = id.substring(id.indexOf("_") + 1, id.length);   

    
    if(confirm(`Er du sikker på at du gerne vil slette aftalen som starter ${time}?`)) {  
        const deleteEventURL = `events/${groupName}/${year}/${month}/${day}/${time}.json`;

        const eventResponse = await fetchBaas(deleteEventURL, "DELETE");

        if (eventResponse.ok) {
            window.location = window.location;
        }
    }
}   