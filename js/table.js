function createTable() {
    // grab DOM elements
    const tableHeader = document.getElementById("tableHeader");
    const tableBody = document.getElementById("tableBody");
    const filter = document.getElementById("filter");

    // set up event listener for the filter box
    filter.oninput = filterTable;

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

// get the JSON data
// then dynamically create the table
getData().then(createTable);
