function main() {
    const COLORS = [
        "#1d8991", // blue
        "#D4516f", // red
        "#D78374", // orange
        "#50C08E", // green
        "#B08CCC", // purple
        "#9ED9E0", // light blue
        "#E49EA6", // light red
        "#F8C19C", // light orange
        "#F5EA99", // yellow
        "#B0E5AF", // light green
        "#DDBAF7", // light purple
        "#2A586C", // dark blue
        "#72314B", // dark red
        "#36685E", // dark green
        "#59477B", // dark purple
    ];

    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;

    Chart.defaults.backgroundColor = COLORS;
    Chart.defaults.color = "#F9CEC3";

    Chart.defaults.font.family = "Gothic A1";
    Chart.defaults.font.size = 14;
    Chart.defaults.font.weight = 500;

    Chart.defaults.plugins.legend.position = "left";

    // grab the canvas
    CANVAS = document.getElementById("chart").getContext("2d");

    // decide on the type of chart to display
    if (SECTIONS.includes("mime")) {
        CHART = new Chart(CANVAS, mimes());
    } else if (SECTIONS.includes("modified")) {
        // do something
        null;
    } else if (SECTIONS.includes("viewed")) {
        // do something
        null;
    }
}

// count the amount of each MIME type
function mimes() {
    let mimes = {};

    for (var i = 0; i < DATA["mime"].length; i++) {
        if (DATA["mime"][i] in mimes) {
            mimes[DATA["mime"][i]] += 1;
        } else {
            mimes[DATA["mime"][i]] = 1;
        }
    }

    return pieChart(mimes);
}

// make a pie/donut chart
function pieChart(data) {
    let args = {
        type: "doughnut",
        data: {
            labels: Object.keys(data),
            datasets: [
                {
                    data: Object.values(data)
                }
            ]
        },
        options: {
            borderWidth: 0
        }
    };

    return args;
}

// get the JSON data
getData().then(main);
