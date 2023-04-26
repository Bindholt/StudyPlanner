"use strict";

window.addEventListener("load", main);

let month = new Date().getMonth() + 1;
let year = new Date().getFullYear();

function main(event) {
    setEventListeners();
    setDaysHTML();
    setYearMonthHTML();
    setDialogHTML();
}

function setDaysHTML() {
    document.querySelector("#days").innerHTML = "";
    const daysArray = getDaysOfMonth();
    console.log(daysArray);

    for (let i = 0; i < daysArray.length; i++) {
        const listHTML = /* html */ `
            <li id=${"day" + i}>${daysArray[i]}</li>
        `
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
}

function incrementMonth() {
    if (month === 12) {
        month = 1;
        year++;
    } else {
        month++;
    }
    setYearMonthHTML();
    setDaysHTML(year, month)

    //todo: tjekke efter studiedates på datoer
}

function decrementMonth() {
    if (month === 1) {
        month = 12;
        year--;
    } else {
        month--;
    }
    setYearMonthHTML();
    setDaysHTML(year, month)
    
    //todo: tjekke efter studiedates på datoer
}

function dialogOpen(day) {
    console.log(day);
    document.querySelector("#date_header").innerHTML = `${day}/${month}/${year}`;
    document.querySelector("#dialog_day").showModal();
}

function setDialogHTML() {
    document.querySelector("#event_to").disabled = true;
    for (let hour = 8; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const selectHTML = /* html */ `
                <option value="${hour + "," + minute}">${time}</option>
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

        let hour = Number(fromTime.substring(0, fromTime.indexOf(",")));
        let minute = Number(fromTime.substring(fromTime.indexOf(",") +1, fromTime.length)) + 15;

        for (hour; hour < 24; hour++) {
            for (minute; minute < 60; minute += 15) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const selectHTML = /* html */ `
                    <option value="${hour + "," + minute}">${time}</option>
                `
                select.insertAdjacentHTML("beforeend", selectHTML);
            }
            minute = 0;
        
        }
    } else {
        select.disabled = true;
    }
}

async function postEvent(event) {
    const eventData = {
        date: event.target["date_header"].innerText,
        group: localStorage.getItem("groupName"),
        fromTime: event.target["event_from"].value,
        toTime: event.target["event_to"].value,
        description: event.target["study_date_description"].value,
    }

    const postAsJson = JSON.stringify(eventData);

    const response = await fetch(`${endpoint}/events/${eventData.group}/${date}/${fromTime}.json`, {
        method: "PUT",
        body: postAsJson
    });

    if (response.ok) {
        window.location = "/login.html";
    }
}