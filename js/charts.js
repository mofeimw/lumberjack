function main() {
    const COLORS = [
        "#D4516f", // red
        "#1d8991", // blue
        "#D78374", // orange
        "#50C08E", // green
        "#B08CCC", // purple
        "#F3DE8A", // yellow
        "#83a598", // light blue
        "#d3869b", // light pink
        "#0f403e", // dark green
        "#2B4162", // dark blue
        "#442f54", // dark purple
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
    CANVAS = document.getElementById("chart").getContext('2d');

    // decide on a type of chart depending on the form of data
    // (column of SQLite table)
    SECTIONS.forEach((section, i) => {
        switch (section) {
            // MIME
            case "mime":
                CHART = new Chart(CANVAS, mimes());
                break;

            // date last modified
            case "modified":
                // create a timeline!!!
                break;

            // date last viewed
            case "viewed":
                // create a timeline!!!
                break;
        }
    });
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
        type: 'doughnut',
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
