// fills table with js(on) file contents
function fillRow(entry) {
    var row = table.insertRow();

    var action = row.insertCell(0);
    action.innerHTML = entry.action;

    var date = row.insertCell(1);
    date.innerHTML = entry.date;

    var time = row.insertCell(2);
    time.innerHTML = entry.time;

    var file = row.insertCell(3);
    file.innerHTML = entry.file;
}

// filters log contents
function filterLog(e) {
    table.innerHTML = "";
    if (filter.value == "") {
        log.map(entry => {
            fillRow(entry);
        });
        return;
    }

    log.map(entry => {
        for (var key in entry) {
            console.log(entry[key]);
            if (entry[key].toLowerCase().includes(filter.value)) {
                fillRow(entry);
            }
        }
    });
}

// grab elements
var table = document.getElementById("table");
var filter = document.getElementById("filter");

// initial table rollout, convert dates on the first pass
log.map(entry => {
    var localTime = new Date(Date.parse(entry.date + "T" + entry.time));
    localTime.setHours(localTime.getHours() - 5);
    entry.time = localTime.toLocaleTimeString();

    fillRow(entry);
});

// add event handler to filter textbox
filter.oninput = filterLog;
