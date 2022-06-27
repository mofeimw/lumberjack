async function getJSON() {
    const response = await fetch('/lumber/data.json');
    JSON = await response.json();

    parse();
}

function parse() {
    // the table headers at the top
    let headers = [];

    // data in OBJECT form
    DATA = {};

    // get all of the main table headers
    JSON.forEach(function (obj, z) {
        for (let key in obj) {
            if (!headers.includes(key)) {
                headers.push(key);
            }
        }
    });

    // create an array inside object for each header
    headers.forEach(function (header, i) {
        DATA[header] = [];
        let h = document.createElement("th");
        h.innerHTML = header;
        tableHeader.appendChild(h);
    });

    // loop back through and add all the data
    JSON.forEach(function (obj, z) {
        for (let key in obj) {
            // check if the data is a number
            if (!isNaN(obj[key])) {
                // check if it is an epoch (?) timestamp
                // 13 digits = milliseconds
                // 10 digits = seconds
                if (obj[key].toString().length == 13 || obj[key].toString().length == 10) {
                    // make a new JavaScript Date
                    // and convert to the local timezone date
                    obj[key] = new Date(obj[key]).toLocaleDateString();
                // never
                } else if (obj[key] == 0) {
                    obj[key] = "never"
                }
            }

            DATA[key].push(obj[key]);
        }
    });

    // total number of rows
    // should remain constant for everyone
    R = Object.values(DATA)[0].length;
    TABLE = [];

    // loops through in ASCENDING NUMERICAL order
    // to sort into an ARRAY of the rows
    for (let i = 0; i < R; i++) {
        let tableRow = [];

        for (let row of Object.keys(DATA)) {
            DATA[row].forEach(function (value, j) {
                if (j == i) {
                    tableRow.push(value);
                }
            });
        }

        TABLE.push(tableRow);
    }

    // fill the table up
    populateTable();
}

function populateRow(row) {
    let tableRow = tableBody.insertRow();
    for (let i = 0; i < row.length; i++) {
        let cell = tableRow.insertCell(i);
        cell.innerHTML = row[i];
    }
}

function populateTable() {
    TABLE.forEach(function (row, l) {
        populateRow(row);
    });
}

function filterTable() {
    // clear the table
    tableBody.textContent = "";

    // repopulate the full table
    // if the input is blank
    if (filter.value == "") {
        populateTable();
        return;
    }

    // loop through the table
    TABLE.forEach(function (row, l) {
        // loop through each row
        for (let i = 0; i < row.length; i++) {
            // look for the user input value
            // traditional for instead of forEach because of BREAK
            if (row[i].toLowerCase().includes(filter.value.toLowerCase())) {
                populateRow(row);
                break;
            }
        }
    });
}

const tableHeader = document.getElementById("tableHeader");
const tableBody = document.getElementById("tableBody");
const filter = document.getElementById("filter");

filter.oninput = filterTable;

getJSON();
