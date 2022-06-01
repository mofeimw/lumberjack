async function getJSON() {
    const response = await fetch('file.json');
    JSON = await response.json();

    parse();
}

function parse() {
    let headers = [];

    // get all of the main table headers
    JSON.forEach(function (obj, z) {
        for (let key in obj) {
            if (!headers.includes(key)) {
                headers.push(key);
            }
        }
    });

    // create an array inside TABLE for each header
    headers.forEach(function (header, i) {
        TABLE[header] = [];
        let h = document.createElement("th");
        h.innerHTML = header;
        tableHeader.appendChild(h);
    });

    // loop back through and add all the data
    JSON.forEach(function (obj, z) {
        for (let key in obj) {
            TABLE[key].push(obj[key]);
        }
    });

    populate();
}

function populate() {
    // total number of rows
    // should remain constant for everyone
    ROWS = Object.values(TABLE)[0].length;

    // loop in ASCENDING NUMERIC order
    for (let i = 0; i < ROWS; i++) {
        // insert a row for each row
        let tableRow = tableBody.insertRow();
        let cell = 0;

        // loop through each row and find correct index
        for (let row of Object.keys(TABLE)) {
            TABLE[row].forEach(function (value, j) {
                if (j == i) {
                    let item = tableRow.insertCell(cell);
                    item.innerHTML = value;
                    cell++;
                }
            });
        }
    }
}

function filterTable(e) {
    // clear the table
    tableBody.innerHTML = "";

    // repopulate the full table
    // if the input is blank
    if (filter.value == "") {
        populate();
        return;
    }

    // loop back through in the same manner
    for (let i = 0; i < ROWS; i++) {
        let tableRow = tableBody.insertRow();
        let cell = 0;

        for (let row of Object.keys(TABLE)) {
            let match = false;
            TABLE[row].forEach(function (value, j) {
                if (j == i) {
                    if (value.toLowerCase().includes(filter.value.toLowerCase()) || match) {
                        let item = tableRow.insertCell(cell);
                        item.innerHTML = value;
                        match = true;
                        cell++;
                    }
                }
            });
        }
    }
}

TABLE = {};

const tableHeader = document.getElementById("tableHeader");
const tableBody = document.getElementById("tableBody");
const filter = document.getElementById("filter");

filter.oninput = filterTable;

getJSON();
