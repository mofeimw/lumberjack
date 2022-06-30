function main() {
    const tableHeader = document.getElementById("tableHeader");
    const tableBody = document.getElementById("tableBody");
    const filter = document.getElementById("filter");

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

    // filters & sorting
    filter.addEventListener("input", filterTable);
    sortOnClick(tableBody);
}

function populateRow(row) {
    let tableRow = tableBody.insertRow();
    for (let i = 0; i < row.length; i++) {
        let cell = tableRow.insertCell(i);

        cell.innerHTML = checkDate(row[i]);
    }
}

// call populateRow() for each row of the table
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
        // traditional for instead of forEach because of BREAK
        for (let i = 0; i < row.length; i++) {
            let data;

            // check if it is a date first
            if (typeof row[i] !== "string") {
                data = checkDate(row[i]);
            } else {
                data = row[i].toLowerCase();
            }

            // look for the user input value
            if (data.includes(filter.value.toLowerCase())) {
                populateRow(row);
                break;
            }
        }
    });
}

function sortOnClick(tableBody) {
    const tableHeaders = tableHeader.querySelectorAll("th");
    const tableRows = Array.from(tableBody.querySelectorAll("tr"));

    // keep track of ascending/descending order
    let directions = Array.from(tableHeaders).map(function (header) {
        return "";
    });

    // loop over each of the table headers
    for (let i = 0; i < tableHeaders.length; i++) {
        // and add a click event handler
        tableHeaders[i].addEventListener("click", function() {
            // determine the direction to sort
            let direction = directions[i] || "asc";
            // multiplier/negator
            let x = (direction === "asc") ? 1 : -1;

            // sort: return either a negative, positive, or zero value
            // negative => a, b
            // positive => b, a
            tableRows.sort(function (rowA, rowB) {
                let a = rowA.querySelectorAll("td")[i].innerHTML;
                let b = rowB.querySelectorAll("td")[i].innerHTML;

                // correctly determine the place of never's
                if (b === "never") {
                    return direction === "asc" ? 1 : -1;
                } else if (a === "never") {
                    return direction === "asc" ? -1 : 1;
                }

                // convert date in the M/D/Y string form into a comparable number
                // 6/23/2005 => 20050623
                if (!isNaN(Date.parse(a)) && !/[a-zA-Z]/.test(a)) {
                    // split date into array of month, day, and year
                    a = a.split("/");
                    b = b.split("/");

                    // add leading zero's
                    a[0] = a[0].toString().length == 1 ? "0" + a[0] : a[0];
                    b[0] = b[0].toString().length == 1 ? "0" + b[0] : b[0];

                    a[1] = a[1].toString().length == 1 ? "0" + a[1] : a[1];
                    b[1] = b[1].toString().length == 1 ? "0" + b[1] : b[1];

                    // mix and match
                    // leading + casts into an integer
                    a = +(a[2] + a[0] + a[1]);
                    b = +(b[2] + b[0] + b[1]);

                    // if direction is ascending: return a - b
                    // else: return b - a
                    return direction === "asc" ? a - b : b - a;
                }

                // not a date
                // compare in alphabetical order
                // multiply by -1 (x) if sort order is descending
                switch (true) {
                    case a > b: return 1 * x;
                    case a < b: return -1 * x;
                    case a === b: return 0;
                }
            });

            // update & flip the sort direction
            directions[i] = direction === "asc" ? "desc" : "asc";

            // update the table
            tableRows.forEach(function(c) {
                // actually moves elements, not technically appending
                tableBody.appendChild(c);
            });
        });
    }
}

// check if the argument is a valid Date
function checkDate(date) {
    if (date instanceof Date) {
        // M/D/Y timezone formatted string
        return date.toLocaleDateString();
    } else if (date == 0) {
        return "never";
        // single lives matter
    } else {
        return date;
    }
}

// get the JSON data
// then dynamically create the table
getData().then(main);
