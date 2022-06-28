async function getData() {
    // get the JSON data
    const response = await fetch('/lumber/data.json');
    JSON_DATA = await response.json();

    // get all of the SQLite columns/sections
    SECTIONS = [];
    JSON_DATA.forEach(function (obj, z) {
        for (let key in obj) {
            if (!SECTIONS.includes(key)) {
                SECTIONS.push(key);
            }
        }
    });

    // data in OBJECT form
    DATA = {};
    // create an array inside DATA object for each section
    SECTIONS.forEach(function (section, i) {
        DATA[section] = [];

        // only for tables
        if (typeof tableHeader !== "undefined") {
            let h = document.createElement("th");
            h.innerHTML = section;
            tableHeader.appendChild(h);
        }
    });

    // loop back through and add all the data
    JSON_DATA.forEach(function (obj, z) {
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
}
