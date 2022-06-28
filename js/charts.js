function createCharts() {
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
    Chart.defaults.font.family = "Gothic A1";
    Chart.defaults.font.weight = "bold";
    Chart.defaults.font.size = 13;
    Chart.defaults.plugins.legend.position = "left";

    SECTIONS.forEach((section, i) => {
        switch (section) {
            case "mime":
                fileTypes();
                break;
        }
    });
}

function fileTypes() {
    let mimes = {};

    for (var i = 0; i < DATA["mime"].length; i++) {
        if (DATA["mime"][i] in mimes) {
            mimes[DATA["mime"][i]] += 1;
        } else {
            mimes[DATA["mime"][i]] = 1;
        }
    }

    pieChart(mimes);
}

function pieChart(data) {
    const pieCanvas = document.getElementById("pieChart").getContext('2d');

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

    const pieChart = new Chart(pieCanvas, args);
}

getData().then(createCharts);


