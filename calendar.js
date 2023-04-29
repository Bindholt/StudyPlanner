"use strict";

window.addEventListener("load", main);

const endpoint = "https://studyplanner-ad697-default-rtdb.europe-west1.firebasedatabase.app/"; 
let month = new Date().getMonth() + 1;
let year = new Date().getFullYear();

async function main(event) {
    setEventListeners();
    
    const monthlyEvents = await getMonthlyEvents();
    const daysArray = getDaysOfMonth();
    setDaysHTML(daysArray, ((monthlyEvents) ? monthlyEvents : "") );

    setYearMonthHTML();

    setDialogHTML();
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
        document.querySelector("#day" + i).addEventListener("mouseup", function() {
            dialogOpen(daysArray[i]);
        });
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
    document.querySelector("#event_from").addEventListener("change", setDateToHTML);
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

    //todo: tjekke efter studiedates på datoer
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
    //todo: tjekke efter studiedates på datoer
}

async function dialogOpen(day) {
    resetExistingDateHTML();
    document.querySelector("#date_header").innerHTML = `${day}/${month}/${year}`;
    const dailyEvents = await getDailyEvents(day);
    if (dailyEvents) {
        setExistingDateHTML(dailyEvents);
    }
    document.querySelector("#dialog_day").showModal();
}

function setDialogHTML() {
    document.querySelector("#event_to").disabled = true;
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

function setDateToHTML() {
    const fromTime = document.querySelector("#event_from").value;
    const select = document.querySelector("#event_to");

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
    //todo ikke hardcode. emptyGroup = localStorage.getItem("groupName").
    const response = await fetch(`${endpoint}/events/emptyGroup/${year}/${month}.json`);
    const monthlyEvents = await response.json()
    if (response.ok) {
        return monthlyEvents;
    } else {
        console.log("Somethings wrong. CALL IT!");
        return "";
    }
}

async function getDailyEvents(day) {
    //todo ikke hardcode. emptyGroup = localStorage.getItem("groupName").
    const response = await fetch(`${endpoint}/events/emptyGroup/${year}/${month}/${day}.json`);
    const dailyEvent = await response.json()
    if (response.ok) {
        return dailyEvent;
    } else {
        return false;
    }
}

async function setExistingDateHTML(dailyEvents) {
    for (let event in dailyEvents) {
        document.querySelector("#existing_dates").style.display = "grid";
        const myHTML = /* html */ `
                <div>${dailyEvents[event]["fromTime"]}${(dailyEvents[event]["toTime"]) ? " - " + dailyEvents[event]["toTime"] : "" }</div>
                <div>${dailyEvents[event]["description"]}</div>
                <div></div>
                <div><input type="button" id="update_${dailyEvents[event]["fromTime"]}" value="Opdatér aftale"> <input type="button" id="delete_${dailyEvents[event]["fromTime"]}" value="Slet aftale"></div>
            `
        document.querySelector("#existing_dates").insertAdjacentHTML("beforeend", myHTML);
        document.querySelector(`#delete_${dailyEvents[event]["fromTime"].replace(":", "\\:")}`).addEventListener("mouseup", deleteEvent);
        document.querySelector(`#update_${dailyEvents[event]["fromTime"].replace(":", "\\:")}`).addEventListener("mouseup", updateEvent);
        
    }
}

function resetExistingDateHTML() {
    const defaultHTML = /* html */ `
        <h4>Tidspunkt</h4>
        <h4>Beskrivelse</h4>
    `
    document.querySelector("#existing_dates").innerHTML = defaultHTML;
    document.querySelector("#existing_dates").style.display = "none";
    document.querySelector("#error_exists").style.display = "none";
    document.querySelector("#error_missing_time").style.display = "none";
    document.querySelector("#study_date_description").value = "";
    document.querySelector("#event_from").value = "";
}

async function isEventExist(day, fromTime) {
    //todo ikke hardcode. emptyGroup = localStorage.getItem("groupName").
    const response = await fetch(`${endpoint}/events/emptyGroup/${year}/${month}/${day}/${fromTime}.json`);
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

async function postEvent(event) {
    event.preventDefault();
    const formDate = document.querySelector("#date_header").innerText;
    const day = formDate.substring(0, formDate.indexOf("/"));
    if(validForm() && !await isEventExist(day, event.target["event_from"].value)) {
        const eventData = {
            group: (localStorage.getItem("groupName").length > 0) ? localStorage.getItem("groupName") : "emptyGroup",
            fromTime: event.target["event_from"].value,
            toTime: event.target["event_to"].value,
            description: event.target["study_date_description"].value,
        }

        const postAsJson = JSON.stringify(eventData);
        
        const response = await fetch(`${endpoint}/events/${eventData.group}/${year}/${month}/${day}/${event.target["event_from"].value}.json`, {
            method: "PUT",
            body: postAsJson
        });

        if (response.ok) {
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
        const response = await fetch(`${endpoint}/events/emptyGroup/${year}/${month}/${day}/${time}.json`, {
            method: "DELETE"
        });

        if (response.ok) {
            window.location = window.location;
        }
    }
}   

async function updateEvent(event) {

}