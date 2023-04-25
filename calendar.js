"use strict";

window.addEventListener("load", main);

let globalMonth = new Date().getMonth() + 1;
let globalYear = new Date().getFullYear();

function main(event) {
    setEventListeners();
    setDaysHTML(globalYear, globalMonth);
    setYearMonthHTML();
}

function setDaysHTML(year, month) {
    document.querySelector("#days").innerHTML = "";
    const daysArray = getDaysOfMonth(year, month);
    console.log(daysArray);

    for (let i = 0; i < daysArray.length; i++) {
        const listHTML = /* html */ `
            <li>${daysArray[i]}</li>
        `
        document.querySelector("#days").insertAdjacentHTML("beforeend", listHTML);
    }
}

function setYearMonthHTML() {
    const monthName = new Date(0, globalMonth - 1).toLocaleString('default', { month: 'long' });
    document.querySelector("#year_month").innerHTML = /* html */ `
        <div>${monthName}</div>
        <div>${globalYear}</div>
    `;
}

function getDaysOfMonth(year, month) {
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
}

function incrementMonth() {
    if (globalMonth === 12) {
        globalMonth = 1;
        globalYear++;
    } else {
        globalMonth++;
    }
    setYearMonthHTML();
    setDaysHTML(globalYear, globalMonth)

    //todo: tjekke efter studiedates på datoer
}

function decrementMonth() {
    if (globalMonth === 1) {
        globalMonth = 12;
        globalYear--;
    } else {
        globalMonth--;
    }
    setYearMonthHTML();
    setDaysHTML(globalYear, globalMonth)
    
    //todo: tjekke efter studiedates på datoer
}